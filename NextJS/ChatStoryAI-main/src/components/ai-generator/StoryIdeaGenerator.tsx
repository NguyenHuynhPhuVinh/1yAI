/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import { generateStoryIdea, generateStoryEdit } from "@/lib/gemini"

interface MainCategory {
  id: number
  name: string
}

interface Tag {
  id: number
  name: string
}

interface GeneratedIdea {
  title: string;
  description: string;
  mainCategory: string;
  suggestedTags: string[];
}

interface IdeaGeneratorProps {
  mainCategories: any[];
  tags: any[];
  onApplyIdea: (idea: any) => void;
  existingStory?: {
    title: string;
    description: string;
    mainCategory: string;
    currentTags: string[];
  };
}

export function IdeaGenerator({ 
  mainCategories, 
  tags, 
  onApplyIdea,
  existingStory 
}: IdeaGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedIdea, setGeneratedIdea] = useState<GeneratedIdea | null>(null)
  const [prompt, setPrompt] = useState("")
  const [open, setOpen] = useState(false)

  const generateIdea = async () => {
    setIsGenerating(true);
    try {
      const categoryNames = mainCategories.map(c => c.name);
      const tagNames = tags.map(t => t.name);
      
      let idea;
      if (existingStory) {
        idea = await generateStoryEdit(
          prompt,
          categoryNames,
          tagNames,
          existingStory
        );
      } else {
        idea = await generateStoryIdea(
          prompt,
          categoryNames,
          tagNames
        );
      }
      
      setGeneratedIdea(idea);
    } catch (error) {
      toast.error("Không thể tạo ý tưởng");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Wand2 className="w-4 h-4" />
          Gợi ý ý tưởng
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gợi ý ý tưởng truyện</DialogTitle>
          <DialogDescription>
            Nhập ý tưởng của bạn và để AI phát triển thành một truyện hoàn chỉnh
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {!generatedIdea && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="prompt">Ý tưởng của bạn</Label>
                <TextareaAutosize
                  id="prompt"
                  placeholder="Ví dụ: Một câu chuyện về robot có cảm xúc..."
                  className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  minRows={3}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              <Button 
                onClick={() => generateIdea()}
                disabled={isGenerating || !prompt.trim()}
                className="w-full"
              >
                {isGenerating ? "Đang tạo..." : "Phát triển ý tưởng"}
              </Button>
            </div>
          )}
          
          {generatedIdea && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">Tiêu đề gợi ý:</h4>
                <p>{generatedIdea.title}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Mô tả:</h4>
                <p className="text-sm text-muted-foreground">{generatedIdea.description}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Thể loại đề xuất:</h4>
                <p>{generatedIdea.mainCategory}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Các tag phù hợp:</h4>
                <div className="flex flex-wrap gap-2">
                  {generatedIdea.suggestedTags.map((tag, index) => (
                    <Badge key={index} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    onApplyIdea(generatedIdea);
                    setOpen(false);
                  }}
                >
                  Áp dụng ý tưởng này
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