/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { ChevronLeft, Sparkles } from "lucide-react"
import TextareaAutosize from 'react-textarea-autosize'
import { OutlineIdeaGenerator } from "@/components/ai-generator/OutlineIdeaGenerator"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { useLoading } from "@/providers/loading-provider"

interface Story {
  title: string
  description: string
  main_category: string
  tags: string[]
  characters?: {
    name: string
    description: string
    gender: string
    personality: string
    appearance: string
    role: string
  }[]
}

export default function CreateOutlineContent({ 
  storyId 
}: { 
  storyId: string 
}) {
  const router = useRouter()
  const { startLoading } = useLoading()
  const [isLoading, setIsLoading] = useState(false)
  const [showIdeaGenerator, setShowIdeaGenerator] = useState(false)
  const [storyData, setStoryData] = useState<Story | null>(null)
  const [publishedChapters, setPublishedChapters] = useState<{
    title: string
    summary?: string
  }[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  })

  useEffect(() => {
    const fetchStoryData = async () => {
      try {
        // Fetch story data
        const storyResponse = await fetch(`/api/stories/${storyId}`)
        const storyJson = await storyResponse.json()
        if (storyResponse.ok) {
          setStoryData(storyJson.story)
        }

        // Fetch published chapters
        const chaptersResponse = await fetch(`/api/stories/${storyId}/chapters/published`)
        const chaptersJson = await chaptersResponse.json()
        if (chaptersResponse.ok) {
          setPublishedChapters(chaptersJson.chapters)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Không thể tải thông tin truyện')
      }
    }

    fetchStoryData()
  }, [storyId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/stories/${storyId}/outlines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Lỗi khi tạo đại cương mới')
      }

      toast.success('Tạo đại cương mới thành công!')
      startLoading(`/stories/${storyId}?tab=outlines`)
      router.push(`/stories/${storyId}?tab=outlines`)
    } catch (error: any) {
      toast.error(error.message || 'Đã có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    startLoading(`/stories/${storyId}?tab=outlines`)
    router.push(`/stories/${storyId}?tab=outlines`)
  }

  const handleApplyIdea = (idea: { title: string; description: string }) => {
    setFormData({
      title: idea.title,
      description: idea.description
    })
  }

  if (!storyData) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-6 md:py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton width={200} height={32} />
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
                <div className="flex flex-col-reverse sm:flex-row gap-3 w-full sm:w-auto sm:ml-auto">
                  <Skeleton width={100} height={40} />
                  <Skeleton width={120} height={40} />
                </div>
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
            <h1 className="text-xl md:text-2xl font-bold">Tạo đại cương mới</h1>
          </div>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={() => setShowIdeaGenerator(true)}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Đề xuất ý tưởng
          </Button>
        </div>
        
        <div className="rounded-lg border bg-card p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề đại cương</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Nhập tiêu đề đại cương"
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <TextareaAutosize
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Nhập mô tả chi tiết"
                minRows={3}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background resize-none"
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
                {isLoading ? "Đang tạo..." : "Tạo đại cương"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <OutlineIdeaGenerator
        storyContext={{
          title: storyData.title,
          description: storyData.description,
          mainCategory: storyData.main_category,
          tags: storyData.tags,
          characters: storyData.characters
        }}
        publishedChapters={publishedChapters}
        onApplyIdea={handleApplyIdea}
        open={showIdeaGenerator}
        onOpenChange={setShowIdeaGenerator}
      />
    </div>
  )
} 