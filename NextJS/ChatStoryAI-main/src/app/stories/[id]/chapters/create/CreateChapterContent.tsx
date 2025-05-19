/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { ChapterIdeaGenerator } from "@/components/ai-generator/ChapterIdeaGenerator"
import { ChevronLeft, Sparkles } from "lucide-react"
import { useLoading } from "@/providers/loading-provider"

export default function CreateChapterContent({ 
  storyId 
}: { 
  storyId: string 
}) {
  const router = useRouter()
  const { startLoading } = useLoading()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [storyTitle, setStoryTitle] = useState("")
  const [showIdeaGenerator, setShowIdeaGenerator] = useState(false)
  const [storyContext, setStoryContext] = useState<{
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
  } | null>(null)
  const [publishedChapters, setPublishedChapters] = useState<{
    title: string;
    summary?: string;
  }[]>([])

  useEffect(() => {
    const fetchStoryTitle = async () => {
      setIsLoadingData(true)
      try {
        const response = await fetch(`/api/stories/${storyId}`)
        const data = await response.json()
        
        if (response.ok) {
          setStoryTitle(data.story.title)
        }
      } catch (error) {
        console.error('Lỗi khi tải thông tin truyện:', error)
      } finally {
        setIsLoadingData(false)
      }
    }

    const fetchStoryContext = async () => {
      try {
        const response = await fetch(`/api/stories/${storyId}`);
        if (response.ok) {
          const data = await response.json();
          setStoryContext({
            title: data.story.title,
            description: data.story.description,
            mainCategory: data.story.main_category,
            tags: data.story.tags,
            characters: data.story.characters
          });
        }
      } catch (error) {
        toast.error('Lỗi khi lấy thông tin truyện');
      }
    };

    const fetchData = async () => {
      try {
        await fetchStoryTitle()
        await fetchStoryContext()

        // Fetch published chapters
        const chaptersResponse = await fetch(`/api/stories/${storyId}/chapters?status=published`);
        if (chaptersResponse.ok) {
          const data = await chaptersResponse.json();
          setPublishedChapters(data.chapters);
        }
      } catch (error) {
        toast.error('Lỗi khi lấy danh sách chương');
      }
    };

    fetchData()
  }, [storyId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const title = formData.get('title')
      const summary = formData.get('summary')
      const status = 'draft'

      const response = await fetch(`/api/stories/${storyId}/chapters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, summary, status })
      })

      if (!response.ok) {
        throw new Error('Lỗi khi tạo chương mới')
      }

      toast.success('Tạo chương mới thành công!')
      // Chuyển hướng về đúng tab dựa vào status
      startLoading(`/stories/${storyId}?tab=chapters&status=${status}`)
      router.push(`/stories/${storyId}?tab=chapters&status=${status}`)
    } catch (error: any) {
      toast.error(error.message || 'Đã có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    // Quay về tab chapters với status mặc định là draft
    startLoading(`/stories/${storyId}?tab=chapters&status=draft`)
    router.push(`/stories/${storyId}?tab=chapters&status=draft`)
  }

  const handleApplyIdea = (idea: { title: string; summary: string }) => {
    const titleInput = document.getElementById('title') as HTMLInputElement;
    const summaryInput = document.getElementById('summary') as HTMLTextAreaElement;
    
    if (titleInput) titleInput.value = idea.title;
    if (summaryInput) summaryInput.value = idea.summary;
  };

  if (isLoadingData) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-6 md:py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton width={200} height={32} />
            <Skeleton width={100} height={36} />
          </div>
          
          <div className="rounded-lg border bg-card p-4 md:p-6">
            <div className="space-y-4 md:space-y-6">
              <div className="space-y-2">
                <Skeleton width={120} height={20} />
                <Skeleton height={40} />
              </div>
              
              <div className="space-y-2">
                <Skeleton width={120} height={20} />
                <Skeleton height={100} />
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <Skeleton width={100} height={40} />
                <Skeleton width={120} height={40} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 md:py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancel}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Quay lại
            </Button>
            <h1 className="text-xl md:text-2xl font-bold">Tạo chương mới</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowIdeaGenerator(true)}
            className="ml-auto"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Gợi ý ý tưởng
          </Button>
        </div>
        
        <div className="rounded-lg border bg-card p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề chương</Label>
              <Input
                id="title"
                name="title"
                placeholder="Nhập tiêu đề chương"
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Tóm tắt chương</Label>
              <textarea
                id="summary"
                name="summary"
                placeholder="Nhập tóm tắt nội dung chương"
                className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={handleCancel}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? "Đang tạo..." : "Tạo chương"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {storyContext && (
        <ChapterIdeaGenerator
          storyContext={storyContext}
          publishedChapters={publishedChapters}
          onApplyIdea={handleApplyIdea}
          open={showIdeaGenerator}
          onOpenChange={setShowIdeaGenerator}
        />
      )}
    </div>
  )
} 