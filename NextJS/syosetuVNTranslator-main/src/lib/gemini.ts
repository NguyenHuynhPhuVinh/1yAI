/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  GenerativeModel,
  ChatSession,
  GenerateContentStreamResult
} from "@google/generative-ai";

let apiKey = "";
let genAI: GoogleGenerativeAI;
let model: GenerativeModel;

// Định nghĩa system prompt
const systemPrompt = `Bạn là một dịch giả chuyên nghiệp, chuyên dịch tiểu thuyết Nhật Bản (từ trang Syosetu) sang tiếng Việt. Hãy tuân thủ các nguyên tắc sau:

1. Dịch chính xác nội dung gốc, giữ nguyên ý nghĩa và cảm xúc của tác giả.
2. Sử dụng ngôn ngữ tự nhiên, trôi chảy và phù hợp với văn phong tiểu thuyết tiếng Việt.
3. Giữ nguyên tên riêng, địa danh và thuật ngữ đặc biệt trong thế giới tiểu thuyết.
4. Chuyển đổi các biểu thức và thành ngữ Nhật Bản sang các biểu thức tương đương trong tiếng Việt.
5. Duy trì cấu trúc đoạn văn và định dạng của bản gốc.
6. Đảm bảo tính nhất quán trong việc sử dụng thuật ngữ và phong cách dịch.
7. Chỉ trả về bản dịch tiếng Việt, không thêm bất kỳ giải thích hay bình luận nào.
8. Khi được cung cấp các chương trước đó, hãy đảm bảo tính nhất quán trong cách dịch tên nhân vật, thuật ngữ và phong cách.

Hãy dịch văn bản được cung cấp sang tiếng Việt một cách tự nhiên và chuyên nghiệp.`;

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Cấu hình an toàn
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

export async function initGemini(): Promise<boolean> {
  try {
    // Thử lấy API key từ localStorage trước
    const savedApiKey = localStorage.getItem('gemini_api_key');
    
    if (savedApiKey) {
      apiKey = savedApiKey;
    } else {
      // Nếu không có trong localStorage, thử lấy từ server
      const response = await fetch('/api/gemini-key');
      const data = await response.json();
      
      if (data.error) {
        console.error("Lỗi khi lấy API key:", data.error);
        return false;
      }
      
      apiKey = data.apiKey;
      
      // Lưu API key vào localStorage để sử dụng sau này
      localStorage.setItem('gemini_api_key', apiKey);
    }
    
    // Khởi tạo Gemini với API key
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig,
      safetySettings,
      systemInstruction: systemPrompt,
    });

    return true;
  } catch (error) {
    console.error("Lỗi khi khởi tạo Gemini:", error);
    return false;
  }
}

// Hàm dịch văn bản với stream
export async function translateTextStream(
  text: string, 
  previousChapters: { title: string, content: string }[] = [],
  glossaryTerms: { original: string, translated: string, description?: string }[] = []
): Promise<GenerateContentStreamResult> {
  if (!model) {
    throw new Error("Gemini chưa được khởi tạo");
  }

  // Tạo chat session mới với systemInstruction đã được cấu hình
  const chat = model.startChat();
  
  // Xây dựng context từ thuật ngữ và chương trước
  let contextPrompt = "";
  
  // Thêm thuật ngữ nếu có
  if (glossaryTerms.length > 0) {
    contextPrompt += "Dưới đây là danh sách thuật ngữ cần tuân thủ khi dịch:\n\n";
    contextPrompt += "| Thuật ngữ gốc | Thuật ngữ dịch | Mô tả |\n";
    contextPrompt += "|--------------|--------------|-------|\n";
    
    for (const term of glossaryTerms) {
      contextPrompt += `| ${term.original} | ${term.translated} | ${term.description || ''} |\n`;
    }
    
    contextPrompt += "\nHãy đảm bảo sử dụng đúng các thuật ngữ trên trong bản dịch.\n\n";
  }
  
  // Thêm các chương trước đó vào chat history
  if (previousChapters.length > 0) {
    // Giới hạn số lượng chương trước đó để tránh vượt quá token limit
    const limitedChapters = previousChapters.slice(-2);
    
    for (const chapter of limitedChapters) {
      await chat.sendMessage(`### ${chapter.title} ###\n${chapter.content}`);
      await chat.sendMessage("Tôi đã ghi nhớ phong cách và thuật ngữ từ chương này.");
    }
  }
  
  // Gửi văn bản cần dịch với context
  return chat.sendMessageStream(contextPrompt + text);
}

// Thêm hàm để người dùng có thể cập nhật API key
export function updateApiKey(newApiKey: string): void {
  apiKey = newApiKey;
  localStorage.setItem('gemini_api_key', apiKey);
  
  // Khởi tạo lại Gemini với API key mới
  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig,
    safetySettings,
    systemInstruction: systemPrompt,
  });
}

// Hàm phân tích cấu trúc ngữ pháp và giải thích dịch
export async function analyzeGrammarStream(
  text: string
): Promise<GenerateContentStreamResult> {
  // Kiểm tra và khởi tạo Gemini nếu chưa được khởi tạo
  if (!genAI || !model) {
    const initialized = await initGemini();
    if (!initialized) {
      throw new Error("Không thể khởi tạo Gemini");
    }
  }

  // Tạo model phân tích riêng biệt
  const analyzeModel = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig,
    safetySettings,
  });

  // Tạo prompt phân tích ngữ pháp
  const analyzePrompt = `Phân tích cấu trúc ngữ pháp và giải thích cách dịch dòng text tiếng Nhật sau đây sang tiếng Việt:
"${text}"

1. Cấu trúc ngữ pháp: (Phân tích cấu trúc ngữ pháp, chỉ ra các thành phần chính của câu, đánh dấu các trợ từ, trạng ngữ, từ nối, v.v.)
2. Giải thích dịch: (Giải thích cách dịch, lưu ý về từ vựng đặc biệt, cách chuyển ngữ phù hợp với văn cảnh, v.v.)

Trả lời theo định dạng:
GRAMMAR: <phân tích cấu trúc ngữ pháp>
EXPLANATION: <giải thích dịch>`;

  // Gửi yêu cầu phân tích và trả về kết quả dạng stream
  return analyzeModel.generateContentStream(analyzePrompt);
} 