/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

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



let apiKey: string | null = null;

async function getApiKey() {
  if (!apiKey) {
    const response = await fetch('/api/ai/gemini');
    if (!response.ok) {
      throw new Error('Không thể lấy API key');
    }
    const data = await response.json();
    apiKey = data.apiKey;
  }
  return apiKey;
}

interface CharacterContext {
  basic: boolean;
  appearance: boolean;
  background: boolean;
  personality: boolean;
  physical: boolean;
}

interface Character {
  character_id: number;
  name: string;
  description: string;
  role: string;
  gender: string;
  birthday: string;
  height: string;
  weight: string;
  personality: string;
  appearance: string;
  background: string;
}

interface OutlineContext {
  title: boolean;
  description: boolean;
}

interface Outline {
  outline_id: number;
  title: string;
  description: string;
}

interface ChapterSelection {
  title: boolean;
  summary: boolean;
  dialogues: boolean;
  data: {
    title: string;
    summary: string;
    dialogues?: {
      type: 'dialogue' | 'aside';
      content: string;
      character_name?: string;
    }[];
  };
}

interface Chapter {
  chapter_id: number;
  title: string;
  summary: string;
  status: string;
}

export async function chatWithAssistant(
  message: string, 
  history: any[] = [], 
  stream = false,
  context?: {
    title?: string;
    description?: string;
    category?: string;
    tags?: string[];
    characters?: { [key: number]: CharacterContext };
    outlines?: { [key: number]: OutlineContext };
    chapters?: { [key: number]: ChapterSelection };
    characterData?: Character[];
    outlineData?: Outline[];
    dialogueData?: { [key: number]: any[] };
    chapterData?: Chapter[];
  }
): Promise<string | ReadableStream> {
  try {
    const key = await getApiKey();
    const genAI = new GoogleGenerativeAI(key!);

    let systemPrompt = `Bạn là một trợ lý AI chuyên về truyện. Nhiệm vụ của bạn là:
- Giúp người dùng tìm hiểu về các truyện
- Trả lời các câu hỏi liên quan đến cốt truyện, nhân vật
- Đưa ra các gợi ý và phân tích về truyện
- Giúp người dùng phát triển ý tưởng viết truyện
- Đưa ra các gợi ý về cách phát triển cốt truyện và nhân vật

Hãy trả lời một cách thân thiện, chuyên nghiệp và dễ hiểu.
Luôn giữ giọng điệu tích cực và khuyến khích người dùng.`;

    if (context) {
      let contextString = '\n\nNgữ cảnh hiện tại của truyện:';
      
      // Thông tin cơ bản
      if (context.title) contextString += `\n- Tên truyện: ${context.title}`;
      if (context.description) contextString += `\n- Mô tả: ${context.description}`;
      if (context.category) contextString += `\n- Thể loại: ${context.category}`;
      if (context.tags?.length) contextString += `\n- Tags: ${context.tags.join(', ')}`;

      // Thông tin chương
      if (context.chapters) {
        contextString += '\n\nDanh sách chương:';
        Object.entries(context.chapters).forEach(([chapterId, chapterContext]) => {
          console.log('Processing chapter:', chapterContext); // Debug log

          contextString += `\n\nChương: ${chapterContext.data.title}`;
          
          if (chapterContext.summary) {
            contextString += `\nTóm tắt: ${chapterContext.data.summary}`;
          }
          
          if (chapterContext.dialogues && chapterContext.data.dialogues && chapterContext.data.dialogues.length > 0) {
            contextString += '\nHội thoại trong chương:';
            chapterContext.data.dialogues.forEach(dialogue => {
              if (dialogue.type === 'dialogue') {
                contextString += `\n- ${dialogue.character_name || 'Không rõ'}: "${dialogue.content}"`;
              } else {
                contextString += `\n- ${dialogue.content}`;
              }
            });
          }
        });
      }

      // Thông tin nhân vật
      if (context.characters && context.characterData) {
        contextString += '\n\nThông tin nhân vật:';
        context.characterData.forEach(char => {
          const charContext = context.characters?.[char.character_id];
          if (charContext) {
            contextString += `\n\nNhân vật: ${char.name}`;
            if (charContext.basic) {
              contextString += `\n- Vai trò: ${char.role}`;
              contextString += `\n- Mô tả: ${char.description}`;
            }
            if (charContext.physical) {
              contextString += `\n- Giới tính: ${char.gender}`;
              contextString += `\n- Ngày sinh: ${char.birthday}`;
              contextString += `\n- Chiều cao: ${char.height}`;
              contextString += `\n- Cân nặng: ${char.weight}`;
            }
            if (charContext.appearance) contextString += `\n- Ngoại hình: ${char.appearance}`;
            if (charContext.personality) contextString += `\n- Tính cách: ${char.personality}`;
            if (charContext.background) contextString += `\n- Tiểu sử: ${char.background}`;
          }
        });
      }

      // Thông tin đại cương
      if (context.outlines && context.outlineData) {
        contextString += '\n\nĐại cương:';
        context.outlineData.forEach(outline => {
          const outlineContext = context.outlines?.[outline.outline_id];
          if (outlineContext) {
            if (outlineContext.title) contextString += `\n\n${outline.title}`;
            if (outlineContext.description) contextString += `\n${outline.description}`;
          }
        });
      }

      systemPrompt += contextString;
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig,
      safetySettings,
      systemInstruction: systemPrompt
    });
    
    if (stream) {
      const chat = model.startChat({
        history: history,
      });
      const result = await chat.sendMessageStream(message);
      return new ReadableStream({
        async start(controller) {
          for await (const chunk of result.stream) {
            controller.enqueue(chunk);
          }
          controller.close();
        },
      });
    }

    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text();
    
    return response;
  } catch (error) {
    console.error("Lỗi khi chat với trợ lý:", error);
    throw error;
  }
}

export interface Message {
  role: "user" | "assistant";
  content: string;
} 