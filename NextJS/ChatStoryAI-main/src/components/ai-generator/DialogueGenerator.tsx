/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { generateDialogueSuggestion } from "@/lib/gemini"
import { Loader2, Check, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

interface DialogueGeneratorProps {
  storyContext: {
    title: string;
    description: string;
    mainCategory: string;
    tags: string[];
    characters: {
      character_id: number;
      name: string;
      description: string;
      gender: string;
      personality: string;
      appearance: string;
      role: string;
    }[];
  };
  chapterTitle?: string;
  chapterSummary?: string;
  existingDialogues?: {
    character_id: number | null;
    content: string;
    type: 'dialogue' | 'aside';
  }[];
  onGenerateDialogues: (dialogues: {
    content: string;
    type: string;
    characters: string[];
    added: boolean;
  }[]) => Promise<void>;
  generatedDialogues: {
    content: string;
    type: string;
    characters: string[];
    added: boolean;
    id?: number;
  }[];
  onAddDialogue: (dialogue: { 
    character_id: number | null, 
    content: string, 
    type: 'dialogue' | 'aside' 
  }) => Promise<void>;
  onRemoveDialogue: (index: number) => Promise<void>;
  onClearAll: () => void;
  storyId?: number;
  chapterId?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  publishedChapters?: {
    title: string;
    summary?: string;
  }[];
  outlines?: {
    title: string;
    description: string;
  }[];
}

export function DialogueGenerator({ 
  storyContext, 
  chapterTitle,
  chapterSummary,
  existingDialogues = [],
  onGenerateDialogues,
  generatedDialogues,
  onAddDialogue,
  onRemoveDialogue,
  onClearAll,
  storyId,
  chapterId,
  open,
  onOpenChange,
  publishedChapters = [],
  outlines = []
}: DialogueGeneratorProps) {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoadingDialogues, setIsLoadingDialogues] = useState(false)
  const [numDialogues, setNumDialogues] = useState(3)
  const [activeTab, setActiveTab] = useState<string>("generate")
  const hasFetchedRef = useRef(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // Sử dụng useRef để đảm bảo chỉ fetch một lần
    if (!hasFetchedRef.current && storyId && chapterId && open) {
      const fetchAIDialogues = async () => {
        setIsLoadingDialogues(true);
        try {
          const response = await fetch(`/api/stories/${storyId}/chapters/${chapterId}/ai-dialogues`);
          if (response.ok) {
            const data = await response.json();
            const dialogues = data.dialogues.map((d: any) => ({
              id: d.id,
              content: d.content,
              type: d.type,
              characters: Array.isArray(d.character_names) ? d.character_names : [],
              added: d.is_added
            }));
            
            if (dialogues.length > 0) {
              // Thay thế hoàn toàn danh sách hiện tại
              onGenerateDialogues(dialogues);
              setActiveTab("results");
            }
          }
        } catch (error) {
          console.error("Lỗi khi lấy danh sách AI dialogues:", error);
        } finally {
          setIsLoadingDialogues(false);
          // Đánh dấu đã fetch xong
          hasFetchedRef.current = true;
        }
      };
      
      fetchAIDialogues();
    }
  }, [storyId, chapterId, open, onGenerateDialogues]);

  // Reset hasFetchedRef khi dialog đóng
  useEffect(() => {
    if (!open) {
      hasFetchedRef.current = false;
    }
  }, [open]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Vui lòng nhập ý tưởng cho đoạn hội thoại")
      return
    }

    if (numDialogues < 1 || numDialogues > 10) {
      toast.error("Số lượng hội thoại phải từ 1 đến 10")
      return
    }

    setIsGenerating(true)
    try {
      const formattedExistingDialogues = existingDialogues.map(d => {
        let character_name: string | undefined = undefined;
        
        if (d.character_id) {
          const character = storyContext.characters.find(c => c.character_id === d.character_id);
          if (character) {
            character_name = character.name;
          }
        }
        
        return {
          character_name,
          content: d.content,
          type: d.type
        };
      });
      
      const dialogues = await generateDialogueSuggestion(
        prompt, 
        storyContext, 
        numDialogues,
        chapterTitle,
        chapterSummary,
        formattedExistingDialogues,
        publishedChapters,
        outlines
      );
      
      const newDialogues = dialogues.map(d => ({...d, added: false}));
      
      // Lưu các dialogue mới vào database
      const savedDialogues = [];
      for (const dialogue of newDialogues) {
        try {
          const response = await fetch(`/api/stories/${storyId}/chapters/${chapterId}/ai-dialogues`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              content: dialogue.content,
              type: dialogue.type,
              character_names: dialogue.characters
            })
          });

          if (response.ok) {
            const data = await response.json();
            savedDialogues.push({
              ...dialogue,
              id: data.dialogue.dialogue_id,
              added: false
            });
          }
        } catch (error) {
          console.error("Lỗi khi lưu dialogue:", error);
        }
      }
      
      // Thêm các dialogue mới vào danh sách hiện tại
      if (savedDialogues.length > 0) {
        onGenerateDialogues([...generatedDialogues, ...savedDialogues]);
      }
      
      setPrompt("");
      toast.success(`Đã tạo ${savedDialogues.length} đoạn hội thoại thành công`);
      
      setActiveTab("results");
    } catch (error) {
      toast.error("Không thể tạo đoạn hội thoại. Vui lòng thử lại");
    } finally {
      setIsGenerating(false);
    }
  }

  const handleAddDialogue = async (index: number) => {
    const dialogue = generatedDialogues[index]
    if (dialogue.added) return

    try {
      let character_id: number | null = null
      if (dialogue.type === 'dialogue' && dialogue.characters && Array.isArray(dialogue.characters) && dialogue.characters.length > 0) {
        const character = storyContext.characters.find(
          c => c.name === dialogue.characters[0]
        )
        if (character) {
          character_id = character.character_id
        }
      }

      // Thêm hội thoại vào truyện
      await onAddDialogue({
        character_id,
        content: dialogue.content,
        type: dialogue.type as 'dialogue' | 'aside'
      })
      
      // Cập nhật trạng thái trong CSDL
      if (dialogue.id) {
        await fetch(`/api/stories/${storyId}/chapters/${chapterId}/ai-dialogues`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            dialogue_id: dialogue.id,
            is_added: true
          })
        });
      }
      
      // Cập nhật state local
      const updatedDialogues = [...generatedDialogues];
      updatedDialogues[index] = {
        ...dialogue,
        added: true
      };
      onGenerateDialogues(updatedDialogues);
      
      toast.success("Đã thêm đoạn hội thoại vào truyện");
    } catch (error) {
      toast.error("Không thể thêm đoạn hội thoại");
    }
  }

  // Thêm hàm xử lý xóa từng hội thoại
  const handleRemoveDialogue = async (index: number) => {
    const dialogue = generatedDialogues[index];
    
    try {
      // Xóa trong CSDL nếu có dialogue_id
      if (dialogue.id) {
        const response = await fetch(`/api/stories/${storyId}/chapters/${chapterId}/ai-dialogues?dialogueId=${dialogue.id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error('Không thể xóa hội thoại');
        }
      }
      
      // Xóa trong state
      const updatedDialogues = [...generatedDialogues];
      updatedDialogues.splice(index, 1);
      onGenerateDialogues(updatedDialogues);
      
      toast.success("Đã xóa hội thoại");
    } catch (error) {
      console.error("Lỗi khi xóa hội thoại:", error);
      toast.error("Không thể xóa hội thoại");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>Tạo hội thoại bằng AI</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="generate">Tạo hội thoại</TabsTrigger>
            <TabsTrigger value="results">
              Kết quả {isLoadingDialogues ? (
                <span className="ml-1">
                  <Loader2 className="h-3 w-3 animate-spin inline-block" />
                </span>
              ) : (
                `(${generatedDialogues.length})`
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="mt-0">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Nhập ý tưởng cho đoạn hội thoại (ví dụ: tạo một đoạn hội thoại về...)"
              className="min-h-[120px] mb-4"
            />
            
            <div className="flex gap-2 items-center">
              <div className="flex items-center space-x-2">
                <label className="text-sm whitespace-nowrap">Số lượng:</label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={numDialogues}
                  onChange={(e) => setNumDialogues(Number(e.target.value))}
                  className="w-16 h-8"
                />
              </div>
              
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="flex-1"
              >
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {isGenerating ? "Đang tạo..." : "Tạo đoạn hội thoại"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="results" className="mt-0">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm font-medium">
                  Danh sách hội thoại AI ({generatedDialogues.length})
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onClearAll}
                  className="h-7 text-xs"
                >
                  Xóa tất cả
                </Button>
              </div>

              <div className="border rounded-md">
                <div 
                  ref={scrollContainerRef}
                  className="max-h-[400px] overflow-y-auto"
                >
                  {isLoadingDialogues ? (
                    <div className="p-4 space-y-4">
                      {Array(3).fill(0).map((_, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Skeleton width={80} height={24} />
                            <Skeleton width={120} height={16} />
                          </div>
                          <Skeleton count={2} />
                          <div className="flex justify-end gap-2">
                            <Skeleton width={100} height={28} />
                            <Skeleton width={40} height={28} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : generatedDialogues.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                      Chưa có hội thoại AI nào được tạo
                    </div>
                  ) : (
                    <div>
                      {generatedDialogues.map((dialogue, index) => (
                        <div 
                          key={index}
                          className={cn(
                            "p-3 border-b last:border-b-0",
                            dialogue.added ? "bg-muted/20" : "hover:bg-muted/5"
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex flex-col gap-1 flex-1">
                              <div className="flex items-center gap-2">
                                <span className={cn(
                                  "text-xs font-medium px-2 py-1 rounded-md",
                                  dialogue.type === 'dialogue' ? "bg-primary/10" : "bg-muted"
                                )}>
                                  {dialogue.type === 'dialogue' ? 'Hội thoại' : 'Aside'}
                                </span>
                                {dialogue.type === 'dialogue' && dialogue.characters && Array.isArray(dialogue.characters) && dialogue.characters.length > 0 && (
                                  <span className="text-xs text-muted-foreground">
                                    {dialogue.characters.join(', ')}
                                  </span>
                                )}
                              </div>
                              <div className="text-sm whitespace-pre-wrap mt-1">
                                {dialogue.content}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1 shrink-0">
                              <Button
                                size="sm"
                                variant={dialogue.added ? "ghost" : "default"}
                                onClick={() => handleAddDialogue(index)}
                                disabled={dialogue.added}
                                className="h-7 text-xs whitespace-nowrap"
                              >
                                {dialogue.added ? (
                                  <>
                                    <Check className="h-3 w-3 mr-1" />
                                    Đã thêm
                                  </>
                                ) : "Thêm vào truyện"}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRemoveDialogue(index)}
                                className="h-7 w-7 p-0"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 