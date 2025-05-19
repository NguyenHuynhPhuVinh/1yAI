/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Wand2 } from "lucide-react"
import { toast } from "sonner"
import TextareaAutosize from 'react-textarea-autosize'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { generateCharacterIdea } from "@/lib/gemini"

interface GeneratedCharacter {
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

interface IdeaGeneratorProps {
  role: string;
  storyContext: {
    title: string;
    description: string;
    mainCategory: string;
    tags: string[];
  };
  onApplyIdea: (idea: GeneratedCharacter) => void;
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
  };
}

export function IdeaGenerator({ role, storyContext, onApplyIdea, existingCharacter }: IdeaGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedIdea, setGeneratedIdea] = useState<GeneratedCharacter | null>(null)
  const [prompt, setPrompt] = useState("")
  const [open, setOpen] = useState(false)

  const defaultPrompt = existingCharacter 
    ? `Cải thiện nhân vật sau:\nTên: ${existingCharacter.name}\nMô tả: ${existingCharacter.description}\nTính cách: ${existingCharacter.personality}`
    : "Ví dụ: Một nhân vật có tính cách mạnh mẽ...";

  const generateIdea = async () => {
    setIsGenerating(true)
    try {
      const idea = await generateCharacterIdea(prompt, role, storyContext, existingCharacter)
      setGeneratedIdea(idea)
    } catch (error) {
      toast.error("Không thể tạo ý tưởng nhân vật")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Wand2 className="w-4 h-4" />
          {existingCharacter ? 'Gợi ý cải thiện' : 'Gợi ý nhân vật'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {existingCharacter ? 'Gợi ý cải thiện nhân vật' : `Gợi ý nhân vật ${role === 'main' ? 'chính' : 'phụ'}`}
          </DialogTitle>
          <DialogDescription>
            {existingCharacter 
              ? 'Nhập ý tưởng của bạn và để AI đề xuất cách cải thiện nhân vật'
              : 'Nhập ý tưởng của bạn và để AI phát triển thành một nhân vật hoàn chỉnh'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {!generatedIdea && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="prompt">Ý tưởng của bạn</Label>
                <TextareaAutosize
                  id="prompt"
                  placeholder={defaultPrompt}
                  className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  minRows={3}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              <Button 
                onClick={generateIdea}
                disabled={isGenerating || !prompt.trim()}
                className="w-full"
              >
                {isGenerating ? "Đang tạo..." : existingCharacter ? "Đề xuất cải thiện" : "Phát triển ý tưởng"}
              </Button>
            </div>
          )}
          
          {generatedIdea && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">Tên nhân vật:</h4>
                    <p className="text-lg">{generatedIdea.name}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Mô tả tổng quan:</h4>
                    <p className="text-sm text-muted-foreground">{generatedIdea.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-1">Giới tính:</h4>
                      <p>{generatedIdea.gender}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Ngày sinh:</h4>
                      <p>{generatedIdea.birthday}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Chiều cao:</h4>
                      <p>{generatedIdea.height} cm</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Cân nặng:</h4>
                      <p>{generatedIdea.weight} kg</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">Tính cách:</h4>
                    <p className="text-sm text-muted-foreground">{generatedIdea.personality}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Ngoại hình:</h4>
                    <p className="text-sm text-muted-foreground">{generatedIdea.appearance}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Xuất thân & Quá khứ:</h4>
                    <p className="text-sm text-muted-foreground">{generatedIdea.background}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => {
                    onApplyIdea(generatedIdea);
                    setOpen(false);
                  }}
                >
                  {existingCharacter ? 'Áp dụng thay đổi' : 'Áp dụng ý tưởng này'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setGeneratedIdea(null);
                    setPrompt('');
                  }}
                >
                  Thử lại
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 