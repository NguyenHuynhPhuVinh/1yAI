/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    GoogleGenerativeAI,
} from "@google/generative-ai";
import { SYSTEM_PROMPT, generationConfig, safetySettings, Message } from './gemini-chat-config';

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

interface Story {
  story_id: number
  title: string
  main_category: string
  status: 'draft' | 'published' | 'archived'
  description?: string
  cover_image?: string | null
  view_count?: number
  favorite_count?: number
  updated_at?: string
  tags?: string[]
  chapters?: {
    chapter_id: number
    title: string
    summary?: string
    status: string
  }[]
  dialogues?: {
    chapter_id: number
    dialogues: {
      type: 'dialogue' | 'aside'
      content: string
      character_name?: string
      dialogue_id?: number
      order_number?: number
    }[]
  }[]
  characters?: {
    name: string
    description: string
    gender: string
    personality: string
    appearance: string
    role: string
    character_id: number
    birthday?: string
    height?: string
    weight?: string
    background?: string
  }[]
  outlines?: {
    outline_id: number
    title: string
    description: string
  }[]
}

export async function chat(
  message: string,
  history: Message[] = [],
  imageFiles?: File[] | null,
  onCreateStory?: (params: any) => Promise<void>,
  onCreateCharacter?: (params: any) => Promise<void>,
  onCreateChapter?: (params: any) => Promise<void>,
  onCreateOutline?: (params: any) => Promise<void>,
  onEditStory?: (params: any) => Promise<void>,
  categories: { id: number; name: string }[] = [],
  tags: { id: number; name: string }[] = [],
  selectedStory?: Story | null,
  onEditCharacter?: (params: any) => Promise<void>,
  onEditChapter?: (params: any) => Promise<void>,
  onEditOutline?: (params: any) => Promise<void>,
  onDeleteCharacter?: (params: any) => Promise<void>,
  onDeleteChapter?: (params: any) => Promise<void>,
  onDeleteOutline?: (params: any) => Promise<void>,
  onCreateDialogue?: (params: any) => Promise<void>,
  onEditDialogue?: (params: any) => Promise<void>,
  onDeleteDialogue?: (params: any) => Promise<void>,
  onPublishStory?: (params: any) => Promise<void>,
  onDeleteStory?: (params: any) => Promise<void>,
): Promise<ReadableStream> {
  try {
    const key = await getApiKey();
    const genAI = new GoogleGenerativeAI(key!);

    // Tạo system prompt với thông tin truyện được chọn
    let systemPromptWithData = `${SYSTEM_PROMPT}

Danh sách thể loại có sẵn:
${categories.map(cat => `- ${cat.name} (ID: ${cat.id})`).join('\n')}

Danh sách tag có sẵn:
${tags.map(tag => `- ${tag.name} (ID: ${tag.id})`).join('\n')}`;

    // Thêm thông tin truyện nếu có
    if (selectedStory) {
      systemPromptWithData += `

Truyện đang được chọn:
Tiêu đề: ${selectedStory.title}
Mô tả: ${selectedStory.description || 'Chưa có mô tả'}
Thể loại: ${selectedStory.main_category}
Tags: ${selectedStory.tags?.join(', ') || 'Chưa có tags'}
Trạng thái: ${selectedStory.status}
ID: ${selectedStory.story_id}

${selectedStory.characters?.length ? `
Danh sách nhân vật:
${selectedStory.characters.map(char => `
- Tên: ${char.name}
  ID: ${char.character_id}
  Mô tả: ${char.description}
  Giới tính: ${char.gender}
  Ngày sinh: ${char.birthday || 'Chưa có'}
  Chiều cao: ${char.height || 'Chưa có'}
  Cân nặng: ${char.weight || 'Chưa có'}
  Tính cách: ${char.personality}
  Ngoại hình: ${char.appearance}
  Vai trò: ${char.role}
  Quá khứ: ${char.background || 'Chưa có'}
`).join('\n')}` : ''}

${selectedStory.outlines?.length ? `
Đại cương:
${selectedStory.outlines.map(outline => `
- ID: ${outline.outline_id}
  Tiêu đề: ${outline.title}
  Mô tả: ${outline.description}
`).join('\n')}` : ''}

${selectedStory.chapters?.length ? `
Các chương của truyện:
${selectedStory.chapters.map(chapter => `
- ID: ${chapter.chapter_id}
  Tiêu đề: ${chapter.title}
  Tóm tắt: ${chapter.summary || 'Chưa có tóm tắt'}
  ${selectedStory.dialogues?.find(d => d.chapter_id === chapter.chapter_id)?.dialogues.map(dialogue => `
    [${dialogue.type === 'dialogue' ? 'Hội thoại' : 'Mô tả'}]
    ID: ${dialogue.dialogue_id}
    ${dialogue.character_name ? `Nhân vật: ${dialogue.character_name}` : ''}
    Nội dung: ${dialogue.content}
    Thứ tự: ${dialogue.order_number}
  `).join('\n  ') || 'Chưa có hội thoại'}
`).join('\n')}` : ''}

Lưu ý: Hãy tập trung vào việc phát triển và cải thiện truyện này dựa trên các thông tin trên.`;
    }

    console.log(systemPromptWithData);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig,
      safetySettings,
      systemInstruction: systemPromptWithData
    });

    const chat = model.startChat({
      history: history.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
    });

    const parts: (string | { inlineData: { data: string; mimeType: string } })[] = [message]
    
    if (imageFiles?.length) {
      for (const file of imageFiles) {
        const imageData = await file.arrayBuffer()
        parts.push({
          inlineData: {
            data: Buffer.from(imageData).toString("base64"),
            mimeType: file.type
          }
        })
      }
    }

    const result = await chat.sendMessageStream(parts);

    return new ReadableStream({
      async start(controller) {
        let accumulatedText = "";
        
        for await (const chunk of result.stream) {
          const text = chunk.text();
          accumulatedText += text;
          
          // Kiểm tra lệnh tạo truyện và tạo nhân vật
          if (accumulatedText.includes("/create-story") || 
              accumulatedText.includes("/create-character") || 
              accumulatedText.includes("/create-chapter") || 
              accumulatedText.includes("/create-outline") ||
              accumulatedText.includes("/edit-story") ||
              accumulatedText.includes("/edit-character") ||
              accumulatedText.includes("/edit-chapter") ||
              accumulatedText.includes("/edit-outline") ||
              accumulatedText.includes("/delete-character") ||
              accumulatedText.includes("/delete-chapter") ||
              accumulatedText.includes("/delete-outline") ||
              accumulatedText.includes("/create-dialogue") ||
              accumulatedText.includes("/edit-dialogue") ||
              accumulatedText.includes("/delete-dialogue") ||
              accumulatedText.includes("/publish-story") ||
              accumulatedText.includes("/delete-story")) {

            // Xử lý đặc biệt cho create-dialogue
            const createDialogueMatch = accumulatedText.match(/\/create-dialogue\s*([\s\S]*?)(?=\n\n|$)/);
            if (createDialogueMatch && onCreateDialogue) {
              try {
                const dialogueContent = createDialogueMatch[1];
                const jsonMatches = dialogueContent.match(/({[\s\S]*?})/g);
                
                if (jsonMatches) {
                  const dialogues = jsonMatches.map(json => {
                    try {
                      return JSON.parse(json);
                    } catch (e) {
                      console.error("Lỗi parse JSON dialogue:", e);
                      return null;
                    }
                  }).filter(Boolean);

                  if (dialogues.length > 0) {
                    const chapter_id = dialogues[0].chapter_id;
                    await onCreateDialogue({
                      chapter_id,
                      dialogues: dialogues.map(d => ({
                        character_id: d.character_id || null,
                        content: d.content,
                        type: d.type || 'dialogue',
                        order_number: d.order_number
                      }))
                    });
                  }
                }
              } catch (error) {
                console.error("Lỗi khi xử lý lệnh tạo hội thoại:", error);
              }
            }

            // Xử lý các lệnh khác như cũ
            const storyMatch = accumulatedText.match(/\/create-story\s*({[\s\S]*?})/);
            const characterMatch = accumulatedText.match(/\/create-character\s*({[\s\S]*?})/);
            const chapterMatch = accumulatedText.match(/\/create-chapter\s*({[\s\S]*?})/);
            const outlineMatch = accumulatedText.match(/\/create-outline\s*({[\s\S]*?})/);
            const editMatch = accumulatedText.match(/\/edit-story\s*({[\s\S]*?})/);
            const editCharacterMatch = accumulatedText.match(/\/edit-character\s*({[\s\S]*?})/);
            const editChapterMatch = accumulatedText.match(/\/edit-chapter\s*({[\s\S]*?})/);
            const editOutlineMatch = accumulatedText.match(/\/edit-outline\s*({[\s\S]*?})/);
            const deleteCharacterMatch = accumulatedText.match(/\/delete-character\s*({[\s\S]*?})/);
            const deleteChapterMatch = accumulatedText.match(/\/delete-chapter\s*({[\s\S]*?})/);
            const deleteOutlineMatch = accumulatedText.match(/\/delete-outline\s*({[\s\S]*?})/);
            const deleteDialogueMatch = accumulatedText.match(/\/delete-dialogue\s*({[\s\S]*?})/);
            const editDialogueMatch = accumulatedText.match(/\/edit-dialogue\s*({[\s\S]*?})/);
            const publishStoryMatch = accumulatedText.match(/\/publish-story\s*({[\s\S]*?})/);
            const deleteStoryMatch = accumulatedText.match(/\/delete-story\s*({[\s\S]*?})/);
            // Xử lý lệnh tạo truyện
            if (storyMatch && onCreateStory) {
              try {
                const params = JSON.parse(storyMatch[1]);
                await onCreateStory(params);
              } catch (error) {
                console.error("Lỗi khi xử lý lệnh tạo truyện:", error);
              }
            }

            if (characterMatch && onCreateCharacter && selectedStory) {
              try {
                const params = JSON.parse(characterMatch[1]);
                await onCreateCharacter({
                  ...params,
                  storyId: selectedStory.story_id
                });
              } catch (error) {
                console.error("Lỗi khi xử lý lệnh tạo nhân vật:", error);
              }
            }

            if (chapterMatch && onCreateChapter && selectedStory) {
              try {
                const params = JSON.parse(chapterMatch[1]);
                await onCreateChapter({
                  ...params,
                  storyId: selectedStory.story_id
                });
              } catch (error) {
                console.error("Lỗi khi xử lý lệnh tạo chương:", error);
              }
            }

            if (outlineMatch && onCreateOutline && selectedStory) {
              try {
                const params = JSON.parse(outlineMatch[1]);
                await onCreateOutline(params);
              } catch (error) {
                console.error("Lỗi khi xử lý lệnh tạo đại cương:", error);
              }
            }

            if (editMatch && onEditStory && selectedStory) {
              try {
                const params = JSON.parse(editMatch[1]);
                await onEditStory(params);
              } catch (error) {
                console.error("Lỗi khi xử lý lệnh sửa truyện:", error);
              }
            }

            if (editCharacterMatch && onEditCharacter && selectedStory) {
              try {
                const params = JSON.parse(editCharacterMatch[1]);
                await onEditCharacter(params);
              } catch (error) {
                console.error("Lỗi khi xử lý lệnh sửa nhân vật:", error);
              }
            }

            if (editChapterMatch && onEditChapter && selectedStory) {
              try {
                const params = JSON.parse(editChapterMatch[1]);
                await onEditChapter(params);
              } catch (error) {
                console.error("Lỗi khi xử lý lệnh sửa chương:", error);
              }
            }

            if (editOutlineMatch && onEditOutline && selectedStory) {
              try {
                const params = JSON.parse(editOutlineMatch[1]);
                await onEditOutline(params);
              } catch (error) {
                console.error("Lỗi khi xử lý lệnh sửa đại cương:", error);
              }
            }

            if (deleteCharacterMatch && onDeleteCharacter && selectedStory) {
              try {
                const params = JSON.parse(deleteCharacterMatch[1]);
                await onDeleteCharacter(params);
              } catch (error) {
                console.error("Lỗi khi xử lý lệnh xóa nhân vật:", error);
              }
            }

            if (deleteChapterMatch && onDeleteChapter && selectedStory) {
              try {
                const params = JSON.parse(deleteChapterMatch[1]);
                await onDeleteChapter(params);
              } catch (error) {
                console.error("Lỗi khi xử lý lệnh xóa chương:", error);
              }
            }

            if (deleteOutlineMatch && onDeleteOutline && selectedStory) {
              try {
                const params = JSON.parse(deleteOutlineMatch[1]);
                await onDeleteOutline(params);
              } catch (error) {
                console.error("Lỗi khi xử lý lệnh xóa đại cương:", error);
              }
            }

            if (editDialogueMatch && onEditDialogue && selectedStory) {
              const editDialogueMatch = accumulatedText.match(/\/edit-dialogue\s*({[\s\S]*?})/);
              if (editDialogueMatch && onEditDialogue) {
                try {
                  const params = JSON.parse(editDialogueMatch[1]);
                  await onEditDialogue(params);
                } catch (error) {
                  console.error("Lỗi khi xử lý lệnh sửa hội thoại:", error);
                }
              }
            }
  
            if (deleteDialogueMatch && onDeleteDialogue && selectedStory) {
              const deleteDialogueMatch = accumulatedText.match(/\/delete-dialogue\s*({[\s\S]*?})/);
              if (deleteDialogueMatch && onDeleteDialogue) {
                try {
                  const params = JSON.parse(deleteDialogueMatch[1]);
                  await onDeleteDialogue(params);
                } catch (error) {
                  console.error("Lỗi khi xử lý lệnh xóa hội thoại:", error);
                }
              }
            }

            if (publishStoryMatch && onPublishStory && selectedStory) {
              try {
                const params = JSON.parse(publishStoryMatch[1]);
                await onPublishStory(params);
              } catch (error) {
                console.error("Lỗi khi xử lý lệnh xuất bản truyện:", error);
              }
            }

            if (deleteStoryMatch && onDeleteStory && selectedStory) {
              try {
                const params = JSON.parse(deleteStoryMatch[1]);
                await onDeleteStory(params);
              } catch (error) {
                console.error("Lỗi khi xử lý lệnh xóa truyện:", error);
              }
            }
            
          }

          controller.enqueue(text);
        }
        controller.close();
      },
    });
  } catch (error) {
    console.error("Lỗi khi chat với AI:", error);
    throw error;
  }
}