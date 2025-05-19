/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// QUAN TRỌNG: Không sử dụng markdown trong các phản hồi
const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};
// Khai báo kiểu dữ liệu cho lịch sử chat
type ChatHistory = {
    role: 'user' | 'model';
    parts: { text: string }[];
}[];

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
let chatSession: any = null;
let history: ChatHistory = [];

export async function POST(request: Request) {
    try {
        const { message, tools } = await request.json();
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

        // Khởi tạo chat session nếu chưa có
        if (!chatSession) {
            const toolsContext = tools.map((tool: any) => ({
                id: tool.id,
                name: tool.name,
                description: tool.description,
                keyFeatures: tool.keyFeatures
            }));

            chatSession = model.startChat({
                generationConfig,
                history: history,
                safetySettings: [
                    {
                        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                    },
                ],
            });

            // Gửi hướng dẫn và context ban đầu cho AI
            await chatSession.sendMessage(
                "Bạn không được sử dụng bất kỳ cú pháp markdown nào trong câu trả lời của mình. " +
                "Không sử dụng ký tự *, _, `, #, hoặc bất kỳ cú pháp định dạng văn bản đặc biệt nào khác. " +
                "Đây là danh sách các công cụ AI của trang web ShowAI mà bạn có thể tham khảo để trả lời: " +
                JSON.stringify(toolsContext)
            );
        }

        // Thêm tin nhắn của người dùng vào lịch sử
        history.push({
            role: 'user',
            parts: [{ text: message }]
        });

        // Gửi tin nhắn và nhận phản hồi
        const result = await chatSession.sendMessage(message);
        const text = result.response.text().replace(/[*_`#]/g, '');

        // Thêm phản hồi của AI vào lịch sử
        history.push({
            role: 'model',
            parts: [{ text: text }]
        });

        return Response.json({
            reply: text,
            history: history // Trả về cả lịch sử chat
        });
    } catch (error) {
        console.error('AI Chat error:', error);
        return Response.json({
            reply: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
            error: true
        });
    }
} 