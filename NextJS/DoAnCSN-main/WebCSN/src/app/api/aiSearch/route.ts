/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
    try {
        const { tools, query } = await request.json();

        const simplifiedTools = tools.map((tool: any) => ({
            id: tool.id,
            name: tool.name,
            description: tool.description,
            keyFeatures: tool.keyFeatures
        }));

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        const prompt = `
        Bạn là một AI assistant giúp tìm kiếm công cụ AI phù hợp nhất. 
        Dựa trên danh sách công cụ sau: ${JSON.stringify(simplifiedTools)}
        
        Hãy tìm và sắp xếp các công cụ phù hợp nhất với yêu cầu: "${query}"
        
        Chỉ trả về một mảng số ID, ví dụ: [1,2,3,4]. Không trả về bất kỳ text nào khác.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        try {
            // Thử parse text trực tiếp
            const toolIds = JSON.parse(text);

            if (!Array.isArray(toolIds)) {
                throw new Error('Response không phải là mảng');
            }

            // Chuyển đổi ID sang string nếu cần
            const stringIds = toolIds.map(id => id.toString());

            // Sắp xếp lại tools theo thứ tự của AI
            const sortedTools = stringIds
                .map(id => tools.find((tool: { id: { toString: () => any; }; }) => tool.id.toString() === id))
                .filter(Boolean);

            // Nếu không tìm thấy kết quả nào, trả về tất cả tools
            if (sortedTools.length === 0) {
                return Response.json({ data: tools });
            }

            return Response.json({ data: sortedTools });

        } catch (parseError) {
            console.error('Parse error:', parseError);
            // Nếu không parse được, trả về tất cả tools
            return Response.json({ data: tools });
        }

    } catch (error) {
        console.error('AI Search error:', error);
        // Trả về mảng rỗng khi có lỗi
        return Response.json({ data: [] });
    }
}