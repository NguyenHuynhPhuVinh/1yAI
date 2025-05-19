/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { generateOutlineIdea, generateOutlineEdit } from "@/lib/gemini"
import { Loader2, Sparkles } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface OutlineIdeaGeneratorProps {
  storyContext: {
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
  };
  existingOutline?: {
    title: string;
    description: string;
  };
  publishedChapters?: {
    title: string;
    summary?: string;
  }[];
  onApplyIdea: (idea: {
    title: string;
    description: string;
  }) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OutlineIdeaGenerator({
  storyContext,
  existingOutline,
  publishedChapters,
  onApplyIdea,
  open,
  onOpenChange
}: OutlineIdeaGeneratorProps) {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Vui lòng nhập ý tưởng cho đại cương")
      return
    }

    setIsGenerating(true)
    try {
      const idea = existingOutline
        ? await generateOutlineEdit(prompt, storyContext, existingOutline, publishedChapters)
        : await generateOutlineIdea(prompt, storyContext, publishedChapters)

      onApplyIdea(idea)
      onOpenChange(false)
      toast.success("Đã tạo ý tưởng thành công!")
    } catch (error: any) {
      toast.error(error.message || "Đã có lỗi xảy ra")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            {existingOutline ? "Cải thiện đại cương" : "Tạo ý tưởng đại cương mới"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              existingOutline
                ? "Nhập yêu cầu cải thiện đại cương (ví dụ: làm cho đại cương này chi tiết hơn...)"
                : "Nhập ý tưởng cho đại cương (ví dụ: tạo một đại cương về...)"
            }
            className="min-h-[120px] resize-none"
          />

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="min-w-[100px]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Tạo ý tưởng
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 