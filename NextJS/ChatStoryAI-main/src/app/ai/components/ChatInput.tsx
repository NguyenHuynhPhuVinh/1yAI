/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import { Plus, Send, X} from "lucide-react"
import Image from "next/image"
import { useRef, useEffect, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface Story {
  story_id: number
  title: string
  main_category: string
  status: 'draft' | 'published' | 'archived'
  chapters?: any[]
  dialogues?: any[]
  characters?: any[]
  outlines?: any[]
}

interface ChatInputProps {
  input: string
  isLoading: boolean
  onInputChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  selectedImages: string[]
  onImageUpload: (file: File) => void
  onClearImage: (index: number) => void
  onClearAllImages: () => void
  onStorySelect: (story: Story | null) => void
}

export function ChatInput({ 
  input, 
  isLoading, 
  onInputChange, 
  onSubmit,
  selectedImages,
  onImageUpload,
  onClearImage,
  onClearAllImages,
  onStorySelect
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [stories, setStories] = useState<Story[]>([])
  const [isLoadingStories, setIsLoadingStories] = useState(true)
  const [selectedValue, setSelectedValue] = useState<string>("0")

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/stories')
      const data = await response.json()
      if (response.ok) {
        setStories(data.stories)
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách truyện:", error)
      toast.error("Không thể tải danh sách truyện")
    } finally {
      setIsLoadingStories(false)
    }
  }

  // Lắng nghe sự kiện tạo truyện thành công
  useEffect(() => {
    const handleStoryCreated = async (event: CustomEvent) => {
      await fetchStories() // Fetch lại danh sách truyện
      // Tự động chọn truyện mới tạo
      const newStory = event.detail
      if (newStory?.story_id) {
        onStorySelect(newStory)
      }
    }

    window.addEventListener('story-created' as any, handleStoryCreated)
    return () => {
      window.removeEventListener('story-created' as any, handleStoryCreated)
    }
  }, [onStorySelect])

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStoryDetails = async (story: Story) => {
    try {
      // Fetch all related data
      const [chaptersRes, charactersListRes, outlinesRes] = await Promise.all([
        fetch(`/api/stories/${story.story_id}/chapters`),
        fetch(`/api/stories/${story.story_id}/characters`),
        fetch(`/api/stories/${story.story_id}/outlines`)
      ]);

      if (chaptersRes.ok) {
        const chaptersData = await chaptersRes.json();
        const allChapters = chaptersData.chapters;
        
        const dialoguesPromises = allChapters.map(async (chapter: any) => {
          const dialoguesRes = await fetch(`/api/stories/${story.story_id}/chapters/${chapter.chapter_id}/dialogues`);
          if (dialoguesRes.ok) {
            const dialoguesData = await dialoguesRes.json();
            return {
              chapter_id: chapter.chapter_id,
              dialogues: dialoguesData.dialogues
            };
          }
          return null;
        });
        
        const chapterDialogues = await Promise.all(dialoguesPromises);
        story.chapters = allChapters;
        story.dialogues = chapterDialogues.filter(d => d !== null);
      }

      if (charactersListRes.ok) {
        const charactersListData = await charactersListRes.json();
        const charactersDetailPromises = charactersListData.characters.map(async (char: any) => {
          const detailRes = await fetch(`/api/stories/${story.story_id}/characters/${char.character_id}/get`);
          if (detailRes.ok) {
            const detailData = await detailRes.json();
            return detailData.character;
          }
          return null;
        });
        
        const characters = await Promise.all(charactersDetailPromises);
        story.characters = characters.filter(c => c !== null);
      }

      if (outlinesRes.ok) {
        const outlinesData = await outlinesRes.json();
        story.outlines = outlinesData.outlines;
      }

      return story;
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu truyện:', error);
      return null;
    }
  };

  // Trong useEffect cho command-executed
  useEffect(() => {
    const handleCommandExecuted = async (event: any) => {
      console.log('[ChatInput] Command executed event received:', event.detail);
      await fetchStories();
      
      // Sử dụng selectedValue đã lưu
      if (selectedValue && selectedValue !== "0") {
        console.log('[ChatInput] Current selected story value:', selectedValue);
        const story = stories.find(s => s.story_id.toString() === selectedValue);
        if (story) {
          const updatedStory = await fetchStoryDetails(story);
          if (updatedStory) {
            console.log('[ChatInput] Story details fetched successfully');
            onStorySelect(updatedStory);
          }
        }
      } else {
        console.log('[ChatInput] No story selected');
      }
    };

    window.addEventListener('command-executed', handleCommandExecuted);
    return () => {
      window.removeEventListener('command-executed', handleCommandExecuted);
    };
  }, [stories, onStorySelect, selectedValue]); // Thêm selectedValue vào dependencies

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach(file => {
        onImageUpload(file)
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(e)
    // Reset textarea height sau khi gửi
    if (textareaRef.current) {
      textareaRef.current.style.height = '56px'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  return (
    <div className="border-t bg-background/50 backdrop-blur-xl">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
        multiple
      />
      <div className="mx-auto max-w-4xl px-2 sm:px-4 py-2 sm:py-4">
        {selectedImages.length > 0 && (
          <div className="relative">
            <div className="flex gap-2 overflow-x-auto pb-2 mb-2 sm:mb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative w-40 h-40 flex-shrink-0">
                  <div className="absolute inset-0">
                    <Image
                      src={image}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                  <div className="absolute top-1 right-1">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-5 w-5 rounded-full"
                      onClick={() => onClearImage(index)}
                      disabled={isLoading}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {selectedImages.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAllImages}
                className="absolute top-1 right-1"
                disabled={isLoading}
              >
                Xóa tất cả
              </Button>
            )}
          </div>
        )}
        
        <form className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-end" onSubmit={handleSubmit}>
          <Select
            value={selectedValue}
            onValueChange={async (value) => {
              setSelectedValue(value);
              const story = stories.find(s => s.story_id.toString() === value);
              if (story) {
                const updatedStory = await fetchStoryDetails(story);
                onStorySelect(updatedStory || null);
              } else {
                onStorySelect(null);
              }
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px] h-[45px] sm:h-[56px]">
              <SelectValue placeholder={isLoadingStories ? "Đang tải..." : "Chọn truyện..."} />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              <SelectItem value="0">Không chọn truyện</SelectItem>
              {stories.map((story) => (
                <SelectItem 
                  key={story.story_id} 
                  value={story.story_id.toString()}
                  className="truncate"
                >
                  {story.title} ({story.main_category})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2 sm:gap-3 flex-1">
            <Button 
              type="button" 
              size="icon" 
              variant="ghost" 
              className="h-[45px] w-[45px] sm:h-[56px] sm:w-[56px] shrink-0"
              disabled={isLoading}
              onClick={() => fileInputRef.current?.click()}
            >
              <Plus className="h-5 w-5" />
            </Button>

            <div className="flex-1">
              <Textarea
                ref={textareaRef}
                placeholder="Nhập câu hỏi của bạn..."
                className="min-h-[45px] sm:min-h-[56px] max-h-[200px] resize-none overflow-y-auto px-3 sm:px-4 py-3 sm:py-4 leading-relaxed"
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                disabled={isLoading}
                rows={1}
                onKeyDown={handleKeyDown}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = '56px';
                  target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
                }}
              />
            </div>
            <Button 
              type="submit" 
              size="icon" 
              className="h-[45px] w-[45px] sm:h-[56px] sm:w-[56px] shrink-0"
              disabled={isLoading || (!input.trim() && !selectedImages.length)}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
        
        <div className="text-center mt-2">
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Gửi tin nhắn bằng Ctrl + Enter | Hỗ trợ tải ảnh lên bằng dấu &quot;+&quot;
          </span>
          <span className="text-xs text-muted-foreground sm:hidden">
            Hỗ trợ tải ảnh lên bằng dấu &quot;+&quot;
          </span>
        </div>
      </div>
    </div>
  )
} 