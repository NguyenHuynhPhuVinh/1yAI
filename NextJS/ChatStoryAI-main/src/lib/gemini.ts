import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { SYSTEM_PROMPTS, createStoryPrompt, createEditStoryPrompt, createCharacterPrompt, createEditCharacterPrompt, createCoverImagePrompt, createAvatarPrompt, createDialoguePrompt, createChapterPrompt, createEditChapterPrompt, createOutlinePrompt, createEditOutlinePrompt, createSearchPrompt } from './gemini-prompts';

let apiKey: string | null = null;

async function getApiKey() {
  // Nếu chạy trên client, gọi API để lấy key
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

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
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

interface StoryIdea {
  title: string;
  description: string;
  mainCategory: string;
  suggestedTags: string[];
}

interface CharacterIdea {
  name: string;
  description: string;
  gender: string;
  birthday: string;
  height: string;
  weight: string;
  personality: string;
  appearance: string;
  background: string;
  role: string;
}

interface DialogueItem {
  content: string;
  type: string;
  characters: string[];
}

interface MultipleDialoguesResponse {
  dialogues: DialogueItem[];
}

interface CoverImagePrompt {
  prompt: string;
  negativePrompt: string;
  style: string;
}

interface ChapterIdea {
  title: string;
  summary: string;
}

interface StoryContext {
  title: string;
  description: string;
  mainCategory: string;
  tags: string[];
  characters?: {
    name: string;
    description: string;
    gender: string;
    personality: string;
    appearance: string;
    role: string;
  }[];
}

interface OutlineIdea {
  title: string;
  description: string;
}

interface SearchResult {
  story_id: number;
  relevance_score: number;
  reason: string;
}

interface SearchResponse {
  results: SearchResult[];
}

export async function generateStoryIdea(userPrompt: string, categories: string[], tags: string[]): Promise<StoryIdea> {
  try {
    const key = await getApiKey();
    const genAI = new GoogleGenerativeAI(key!);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      safetySettings,
      generationConfig,
      systemInstruction: SYSTEM_PROMPTS.STORY
    });
    
    const chat = model.startChat({
      history: [
        createStoryPrompt(categories, tags)
      ],
    });

    const result = await chat.sendMessage([{ text: userPrompt }]);
    const response = result.response.text();
    
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : response;
    
    let storyIdea: StoryIdea;
    try {
      storyIdea = JSON.parse(jsonString);
      // Kiểm tra tính hợp lệ của dữ liệu
      if (!storyIdea.title || !storyIdea.description || !storyIdea.mainCategory || !Array.isArray(storyIdea.suggestedTags)) {
        throw new Error('Dữ liệu không hợp lệ');
      }
    } catch (parseError) {
      console.error("Lỗi khi parse JSON:", parseError);
      throw new Error('Không thể xử lý phản hồi từ AI');
    }
    
    return storyIdea;
  } catch (error) {
    console.error("Lỗi khi tạo ý tưởng:", error);
    throw new Error('Có lỗi xảy ra khi tạo ý tưởng. Vui lòng thử lại sau.');
  }
}

export async function generateCharacterIdea(
  prompt: string, 
  role: string,
  storyContext: {
    title: string;
    description: string;
    mainCategory: string;
    tags: string[];
  },
  existingCharacter?: {
    name: string;
    description: string;
    gender: string;
    birthday: string;
    height: string;
    weight: string;
    personality: string;
    appearance: string;
    background: string;
    role: string;
  }
): Promise<CharacterIdea> {
  try {
    const key = await getApiKey();
    const genAI = new GoogleGenerativeAI(key!);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      safetySettings,
      generationConfig,
      systemInstruction: SYSTEM_PROMPTS.CHARACTER
    });

    const chat = model.startChat({
      history: [
        existingCharacter 
          ? createEditCharacterPrompt(role, storyContext, existingCharacter)
          : createCharacterPrompt(role, storyContext),
      ],
    });

    const result = await chat.sendMessage([{ text: prompt }]);
    const response = result.response.text();
    
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : response;
    
    let characterIdea: CharacterIdea;
    try {
      characterIdea = JSON.parse(jsonString);
      // Kiểm tra tính hợp lệ của dữ liệu
      if (!characterIdea.name || !characterIdea.description || !characterIdea.role) {
        throw new Error('Dữ liệu không hợp lệ');
      }
    } catch (parseError) {
      console.error("Lỗi khi parse JSON:", parseError);
      throw new Error('Không thể xử lý phản hồi từ AI');
    }
    
    return characterIdea;
  } catch (error) {
    console.error("Lỗi khi tạo nhân vật:", error);
    throw error;
  }
}

export async function generateDialogueSuggestion(
  prompt: string,
  storyContext: StoryContext,
  numDialogues: number,
  chapterTitle?: string,
  chapterSummary?: string,
  existingDialogues?: {
    character_name?: string;
    content: string;
    type: 'dialogue' | 'aside';
  }[],
  publishedChapters?: {
    title: string;
    summary?: string;
  }[],
  outlines?: {
    title: string;
    description: string;
  }[]
): Promise<DialogueItem[]> {
  try {
    const key = await getApiKey();
    const genAI = new GoogleGenerativeAI(key!);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      safetySettings,
      generationConfig,
      systemInstruction: SYSTEM_PROMPTS.DIALOGUE
    });
    
    const chat = model.startChat({
      history: [
        createDialoguePrompt(
          prompt, 
          storyContext, 
          numDialogues, 
          chapterTitle,
          chapterSummary,
          existingDialogues,
          publishedChapters,
          outlines
        )
      ],
    });

    const result = await chat.sendMessage(prompt || "Hãy tạo một số đoạn đối thoại phù hợp");
    const response = result.response.text();
    
    console.log("Raw response:", response);
    
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : response;
    
    try {
      const parsedResponse = JSON.parse(jsonString) as MultipleDialoguesResponse;
      
      if (!parsedResponse.dialogues || !Array.isArray(parsedResponse.dialogues)) {
        throw new Error('Dữ liệu đối thoại không hợp lệ');
      }
      
      // Validate each dialogue
      parsedResponse.dialogues.forEach(dialogue => {
        if (!dialogue.content || 
            !['dialogue', 'aside'].includes(dialogue.type) || 
            !Array.isArray(dialogue.characters)) {
          throw new Error('Dữ liệu đối thoại không hợp lệ');
        }
      });
      
      return parsedResponse.dialogues;
    } catch (parseError) {
      console.error("Lỗi khi parse JSON:", parseError, "Response:", response);
      throw new Error('Không thể xử lý phản hồi từ AI');
    }
  } catch (error) {
    console.error("Lỗi khi tạo đối thoại:", error);
    throw error;
  }
}

export async function generateStoryEdit(
  userPrompt: string, 
  categories: string[], 
  tags: string[],
  existingStory: {
    title: string;
    description: string;
    mainCategory: string;
    currentTags: string[];
  }
): Promise<StoryIdea> {
  try {
    const key = await getApiKey();
    const genAI = new GoogleGenerativeAI(key!);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      safetySettings,
      generationConfig,
      systemInstruction: SYSTEM_PROMPTS.EDIT_STORY
    });
    
    const chat = model.startChat({
      history: [
        createEditStoryPrompt(categories, tags, existingStory),
      ],
    });

    const result = await chat.sendMessage([{ text: userPrompt }]);
    const response = result.response.text();
    
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : response;
    
    let editedStory: StoryIdea;
    try {
      editedStory = JSON.parse(jsonString);
      if (!editedStory.title || !editedStory.description || !editedStory.mainCategory || !Array.isArray(editedStory.suggestedTags)) {
        throw new Error('Dữ liệu chỉnh sửa không hợp lệ');
      }
    } catch (parseError) {
      console.error("Lỗi khi parse JSON:", parseError);
      throw new Error('Không thể xử lý phản hồi từ AI');
    }
    
    return editedStory;
  } catch (error) {
    console.error("Lỗi khi chỉnh sửa truyện:", error);
    throw new Error('Có lỗi xảy ra khi chỉnh sửa. Vui lòng thử lại sau.');
  }
}

export async function generateCoverImagePrompt(
  storyInfo: {
    title: string;
    description: string;
    mainCategory: string;
    tags: string[];
  }
): Promise<CoverImagePrompt> {
  try {
    const key = await getApiKey();
    const genAI = new GoogleGenerativeAI(key!);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      safetySettings,
      generationConfig,
      systemInstruction: SYSTEM_PROMPTS.COVER_IMAGE
    });
    
    const chat = model.startChat({
      history: [
        createCoverImagePrompt(storyInfo),
      ],
    });

    const result = await chat.sendMessage([{ 
      text: "Hãy tạo prompt cho ảnh bìa dựa trên thông tin truyện đã cung cấp" 
    }]);
    
    const response = result.response.text();
    
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : response;
    
    let coverPrompt: CoverImagePrompt;
    try {
      coverPrompt = JSON.parse(jsonString);
      if (!coverPrompt.prompt || !coverPrompt.negativePrompt || !coverPrompt.style) {
        throw new Error('Dữ liệu prompt ảnh bìa không hợp lệ');
      }
    } catch (parseError) {
      console.error("Lỗi khi parse JSON:", parseError);
      throw new Error('Không thể xử lý phản hồi từ AI');
    }
    
    return coverPrompt;
  } catch (error) {
    console.error("Lỗi khi tạo prompt ảnh bìa:", error);
    throw new Error('Có lỗi xảy ra khi tạo prompt ảnh bìa. Vui lòng thử lại sau.');
  }
}

export async function generateAvatarPrompt(
  characterInfo: {
    name: string;
    description: string;
    gender: string;
    personality: string;
    appearance: string;
    role: string;
  }
): Promise<CoverImagePrompt> {
  try {
    const key = await getApiKey();
    const genAI = new GoogleGenerativeAI(key!);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      safetySettings,
      generationConfig,
      systemInstruction: SYSTEM_PROMPTS.AVATAR_IMAGE
    });
    
    const chat = model.startChat({
      history: [
        createAvatarPrompt(characterInfo),
      ],
    });

    const result = await chat.sendMessage([{
      text: "Hãy tạo prompt cho ảnh avatar dựa trên thông tin nhân vật đã cung cấp"
    }]);

    const response = result.response.text();
    
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : response;
    
    let avatarPrompt: CoverImagePrompt;
    try {
      avatarPrompt = JSON.parse(jsonString);
      if (!avatarPrompt.prompt || !avatarPrompt.negativePrompt || !avatarPrompt.style) {
        throw new Error('Dữ liệu prompt avatar không hợp lệ');
      }
    } catch (parseError) {
      console.error("Lỗi khi parse JSON:", parseError);
      throw new Error('Không thể xử lý phản hồi từ AI');
    }
    
    return avatarPrompt;
  } catch (error) {
    console.error("Lỗi khi tạo prompt avatar:", error);
    throw new Error('Có lỗi xảy ra khi tạo prompt avatar. Vui lòng thử lại sau.');
  }
}

export async function generateChapterIdea(
  prompt: string,
  storyContext: StoryContext,
  publishedChapters?: {
    title: string;
    summary?: string;
  }[]
): Promise<ChapterIdea> {
  try {
    const key = await getApiKey();
    const genAI = new GoogleGenerativeAI(key!);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      safetySettings,
      generationConfig,
      systemInstruction: SYSTEM_PROMPTS.CHAPTER
    });
    
    const chat = model.startChat({
      history: [
        createChapterPrompt(storyContext, publishedChapters)
      ],
    });

    const result = await chat.sendMessage([{ text: prompt }]);
    const response = result.response.text();
    
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : response;
    
    let chapterIdea: ChapterIdea;
    try {
      chapterIdea = JSON.parse(jsonString);
      if (!chapterIdea.title || !chapterIdea.summary) {
        throw new Error('Dữ liệu không hợp lệ');
      }
    } catch (parseError) {
      console.error("Lỗi khi parse JSON:", parseError);
      throw new Error('Không thể xử lý phản hồi từ AI');
    }
    
    return chapterIdea;
  } catch (error) {
    console.error("Lỗi khi tạo ý tưởng chương:", error);
    throw error;
  }
}

export async function generateChapterEdit(
  prompt: string,
  storyContext: StoryContext,
  existingChapter: {
    title: string;
    summary?: string;
  },
  publishedChapters?: {
    title: string;
    summary?: string;
  }[]
): Promise<ChapterIdea> {
  try {
    const key = await getApiKey();
    const genAI = new GoogleGenerativeAI(key!);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      safetySettings,
      generationConfig,
      systemInstruction: SYSTEM_PROMPTS.EDIT_CHAPTER
    });
    
    const chat = model.startChat({
      history: [
        createEditChapterPrompt(storyContext, existingChapter, publishedChapters)
      ],
    });

    const result = await chat.sendMessage([{ text: prompt }]);
    const response = result.response.text();
    
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : response;
    
    let editedChapter: ChapterIdea;
    try {
      editedChapter = JSON.parse(jsonString);
      if (!editedChapter.title || !editedChapter.summary) {
        throw new Error('Dữ liệu chỉnh sửa không hợp lệ');
      }
    } catch (parseError) {
      console.error("Lỗi khi parse JSON:", parseError);
      throw new Error('Không thể xử lý phản hồi từ AI');
    }
    
    return editedChapter;
  } catch (error) {
    console.error("Lỗi khi chỉnh sửa chương:", error);
    throw error;
  }
}

export async function generateOutlineIdea(
  prompt: string,
  storyContext: StoryContext,
  publishedChapters?: {
    title: string;
    summary?: string;
  }[]
): Promise<OutlineIdea> {
  try {
    const key = await getApiKey();
    const genAI = new GoogleGenerativeAI(key!);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      safetySettings,
      generationConfig,
      systemInstruction: SYSTEM_PROMPTS.OUTLINE
    });
    
    const chat = model.startChat({
      history: [
        createOutlinePrompt(storyContext, publishedChapters)
      ],
    });

    const result = await chat.sendMessage([{ text: prompt }]);
    const response = result.response.text();
    
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : response;
    
    let outlineIdea: OutlineIdea;
    try {
      outlineIdea = JSON.parse(jsonString);
      if (!outlineIdea.title || !outlineIdea.description) {
        throw new Error('Dữ liệu không hợp lệ');
      }
    } catch (parseError) {
      console.error("Lỗi khi parse JSON:", parseError);
      throw new Error('Không thể xử lý phản hồi từ AI');
    }
    
    return outlineIdea;
  } catch (error) {
    console.error("Lỗi khi tạo ý tưởng đại cương:", error);
    throw error;
  }
}

export async function generateOutlineEdit(
  prompt: string,
  storyContext: StoryContext,
  existingOutline: {
    title: string;
    description: string;
  },
  publishedChapters?: {
    title: string;
    summary?: string;
  }[]
): Promise<OutlineIdea> {
  try {
    const key = await getApiKey();
    const genAI = new GoogleGenerativeAI(key!);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      safetySettings,
      generationConfig,
      systemInstruction: SYSTEM_PROMPTS.EDIT_OUTLINE
    });
    
    const chat = model.startChat({
      history: [
        createEditOutlinePrompt(storyContext, existingOutline, publishedChapters)
      ],
    });

    const result = await chat.sendMessage([{ text: prompt }]);
    const response = result.response.text();
    
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : response;
    
    let editedOutline: OutlineIdea;
    try {
      editedOutline = JSON.parse(jsonString);
      if (!editedOutline.title || !editedOutline.description) {
        throw new Error('Dữ liệu chỉnh sửa không hợp lệ');
      }
    } catch (parseError) {
      console.error("Lỗi khi parse JSON:", parseError);
      throw new Error('Không thể xử lý phản hồi từ AI');
    }
    
    return editedOutline;
  } catch (error) {
    console.error("Lỗi khi chỉnh sửa đại cương:", error);
    throw error;
  }
}

export async function searchStoriesWithAI(
  query: string,
  stories: {
    story_id: number;
    title: string;
    description: string;
    main_category: string;
    tags: string[];
  }[]
): Promise<SearchResult[]> {
  try {
    const key = await getApiKey();
    const genAI = new GoogleGenerativeAI(key!);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      safetySettings,
      generationConfig,
      systemInstruction: SYSTEM_PROMPTS.SEARCH
    });
    
    const chat = model.startChat({
      history: [
        createSearchPrompt(stories)
      ],
    });

    const result = await chat.sendMessage([{ text: query }]);
    const response = result.response.text();
    
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : response;
    
    let searchResults: SearchResponse;
    try {
      searchResults = JSON.parse(jsonString);
      if (!Array.isArray(searchResults.results)) {
        throw new Error('Dữ liệu không hợp lệ');
      }
    } catch (parseError) {
      console.error("Lỗi khi parse JSON:", parseError);
      throw new Error('Không thể xử lý phản hồi từ AI');
    }
    
    return searchResults.results;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm:", error);
    throw error;
  }
} 