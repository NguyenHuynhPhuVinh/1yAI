/* eslint-disable @typescript-eslint/no-explicit-any */
import { Message } from "@/lib/gemini-chat-config"
import { Loader2 } from "lucide-react"
import ReactMarkdown from "react-markdown"
import Image from "next/image"
import { CommandBox } from "./CommandBox"

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
  chatContainerRef: React.RefObject<HTMLDivElement | null>
  messagesEndRef: React.RefObject<HTMLDivElement | null>
  commandStatus: 'loading' | 'success' | 'error' | null
  categories?: { id: number; name: string }[]
  tags?: { id: number; name: string }[]
}

export function ChatMessages({ messages, isLoading, chatContainerRef, messagesEndRef, commandStatus, categories, tags }: ChatMessagesProps) {
  const getCommandParams = (content: string) => {
    // Xử lý đặc biệt cho create-dialogue
    const createDialogueMatch = content.match(/\/create-dialogue\s*([\s\S]*?)(?=\n\n|$)/);
    if (createDialogueMatch) {
      try {
        // Tìm và parse tất cả các đoạn JSON trong nội dung
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
            // Lấy chapter_id từ dialogue đầu tiên
            const chapter_id = dialogues[0].chapter_id;
            
            return {
              command: '/create-dialogue',
              params: {
                chapter_id,
                dialogues: dialogues.map(d => ({
                  character_id: d.character_id || null,
                  content: d.content,
                  type: d.type || 'dialogue',
                  order_number: d.order_number
                }))
              }
            };
          }
        }
        return null;
      } catch (error) {
        console.error("Lỗi khi parse params create dialogue:", error);
        return null;
      }
    }

    // Kiểm tra các lệnh khác như cũ
    const storyMatch = content.match(/\/create-story\s*({[\s\S]*?})/);
    const characterMatch = content.match(/\/create-character\s*({[\s\S]*?})/);
    const chapterMatch = content.match(/\/create-chapter\s*({[\s\S]*?})/);
    const outlineMatch = content.match(/\/create-outline\s*({[\s\S]*?})/);
    const editMatch = content.match(/\/edit-story\s*({[\s\S]*?})/);
    const editCharacterMatch = content.match(/\/edit-character\s*({[\s\S]*?})/);
    const editChapterMatch = content.match(/\/edit-chapter\s*({[\s\S]*?})/);
    const editOutlineMatch = content.match(/\/edit-outline\s*({[\s\S]*?})/);
    const deleteCharacterMatch = content.match(/\/delete-character\s*({[\s\S]*?})/);
    const deleteChapterMatch = content.match(/\/delete-chapter\s*({[\s\S]*?})/);
    const deleteOutlineMatch = content.match(/\/delete-outline\s*({[\s\S]*?})/);
    const editDialogueMatch = content.match(/\/edit-dialogue\s*({[\s\S]*?})/);
    const deleteDialogueMatch = content.match(/\/delete-dialogue\s*({[\s\S]*?})/);
    const publishStoryMatch = content.match(/\/publish-story\s*({[\s\S]*?})/);
    const deleteStoryMatch = content.match(/\/delete-story\s*({[\s\S]*?})/);


    if (storyMatch) {
      try {
        return {
          command: '/create-story',
          params: JSON.parse(storyMatch[1])
        };
      } catch (error) {
        console.error("Lỗi khi parse params story:", error)
        return null;
      }
    }
    
    if (characterMatch) {
      try {
        return {
          command: '/create-character',
          params: JSON.parse(characterMatch[1])
        };
      } catch (error) {
        console.error("Lỗi khi parse params character:", error)
        return null;
      }
    }

    if (chapterMatch) {
      try {
        return {
          command: '/create-chapter',
          params: JSON.parse(chapterMatch[1])
        };
      } catch (error) {
        console.error("Lỗi khi parse params chapter:", error)
        return null;
      }
    }

    if (outlineMatch) {
      try {
        return {
          command: '/create-outline',
          params: JSON.parse(outlineMatch[1])
        };
      } catch (error) {
        console.error("Lỗi khi parse params outline:", error)
        return null;
      }
    }

    if (editMatch) {
      try {
        return {
          command: '/edit-story',
          params: JSON.parse(editMatch[1])
        };
      } catch (error) {
        console.error("Lỗi khi parse params edit story:", error)
        return null;
      }
    }

    if (editCharacterMatch) {
      try {
        return {
          command: '/edit-character',
          params: JSON.parse(editCharacterMatch[1])
        };
      } catch (error) {
        console.error("Lỗi khi parse params edit character:", error)
        return null;
      }
    }

    if (editChapterMatch) {
      try {
        return {
          command: '/edit-chapter',
          params: JSON.parse(editChapterMatch[1])
        };
      } catch (error) {
        console.error("Lỗi khi parse params edit chapter:", error)
        return null;
      }
    }

    if (editOutlineMatch) {
      try {
        return {
          command: '/edit-outline', 
          params: JSON.parse(editOutlineMatch[1])
        };
      } catch (error) {
        console.error("Lỗi khi parse params edit outline:", error)
        return null;
      }
    }

    if (deleteCharacterMatch) {
      try {
        return {
          command: '/delete-character',
          params: JSON.parse(deleteCharacterMatch[1])
        };
      } catch (error) {
        console.error("Lỗi khi parse params delete character:", error)
        return null;
      }
    }

    if (deleteChapterMatch) {
      try {
        return {
          command: '/delete-chapter',
          params: JSON.parse(deleteChapterMatch[1])
        };
      } catch (error) {
        console.error("Lỗi khi parse params delete chapter:", error)
        return null;
      }
    }

    if (deleteOutlineMatch) {
      try {
        return {
          command: '/delete-outline',
          params: JSON.parse(deleteOutlineMatch[1])
        };
      } catch (error) {
        console.error("Lỗi khi parse params delete outline:", error)
        return null;
      }
    }

    if (editDialogueMatch) {
      try {
        return {
          command: '/edit-dialogue',
          params: JSON.parse(editDialogueMatch[1])
        };
      } catch (error) {
        console.error("Lỗi khi parse params edit dialogue:", error)
        return null;
      }
    }

    if (deleteDialogueMatch) {
      try {
        return {
          command: '/delete-dialogue',
          params: JSON.parse(deleteDialogueMatch[1])
        };
      } catch (error) {
        console.error("Lỗi khi parse params delete dialogue:", error)
        return null;
      }
    }

    if (publishStoryMatch) {
      try {
        return {
          command: '/publish-story',
          params: JSON.parse(publishStoryMatch[1])
        };
      } catch (error) {
        console.error("Lỗi khi parse params publish story:", error)
        return null;
      }
    }

    if (deleteStoryMatch) {
      try {
        return {
          command: '/delete-story',
          params: JSON.parse(deleteStoryMatch[1])
        };
      } catch (error) {
        console.error("Lỗi khi parse params delete story:", error)
        return null;
      }
    }
    
    return null;
  }

  const processMessageContent = (content: string) => {
    const commandData = getCommandParams(content);
    if (commandData) {
      // Tách nội dung trước lệnh
      const parts = content.split(commandData.command)
      if (parts.length > 1) {
        return parts[0].trim()
      }
    }
    return content
  }

  return (
    <div ref={chatContainerRef} className="h-full overflow-y-auto p-4">
      <div className="max-w-3xl mx-auto">
        {messages.map((message, index) => {
          const commandData = message.content ? getCommandParams(message.content) : null;
          
          return (
            <div
              key={index}
              className={`mb-4 flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg p-4 max-w-[80%] space-y-4 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {(message.images && message.images.filter(img => img.url).length > 0) && (
                  <div className="flex gap-2 mb-4">
                    {message.images?.map((image, index) => (
                      image.url && (
                        <div key={index} className="relative w-40 h-40">
                          <Image
                            src={image.url}
                            alt={`Image ${index + 1}`}
                            fill
                            className="object-contain rounded-lg"
                          />
                        </div>
                      )
                    ))}
                  </div>
                )}
                {message.content && (
                  <ReactMarkdown>
                    {processMessageContent(message.content)}
                  </ReactMarkdown>
                )}
                
                {commandData && (
                  <CommandBox 
                    command={commandData.command}
                    status={
                      message.command_status ||
                      (index === messages.length - 1 ? commandStatus : null) ||
                      'success'
                    }
                    params={commandData.params}
                    categories={categories}
                    tags={tags}
                  />
                )}
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-4 animate-pulse">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
} 