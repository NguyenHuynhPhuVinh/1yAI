import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-1.5-flash";
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string || "AIzaSyB_eNpMTroPTupXzl_oey08M0d-luxJ3OE"; // Update with your API key

export async function generateChatResponse(prompt: string): Promise<string> {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
    ];
    const model = genAI.getGenerativeModel({ model: MODEL_NAME, safetySettings });

    const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
    };

    // Assume the chat history is stored in localStorage
    let chatHistory = JSON.parse(window.localStorage.getItem('chatHistory') || '[]');
    // Kiểm tra nếu chatHistory vượt quá 100 phần tử
    if (chatHistory.length > 100) {
        // Bỏ 2 phần tử đầu tiên của mảng
        chatHistory = chatHistory.slice(2);
    }
    const chat = model.startChat({
        generationConfig,
        history: chatHistory, // Load chat history from localStorage
    });

    const result = await chat.sendMessage(prompt);
    const response = result.response;

    // Update chat history
    chatHistory.push({
        role: "user",
        parts: [{ text: prompt }],
    });
    chatHistory.push({
        role: "model",
        parts: [{ text: response.text() }],
    });
    window.localStorage.setItem('chatHistory', JSON.stringify(chatHistory));

    // Đoạn code để xóa hai mảng cuối trong chatHistory
    chatHistory.splice(-2);

    // Lưu lại chatHistory đã được cập nhật sau khi xóa
    window.localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    return response.text();
}
