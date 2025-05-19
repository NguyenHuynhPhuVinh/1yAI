/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { ChapterIdeaGenerator } from "@/components/ai-generator/ChapterIdeaGenerator"
import { ChevronLeft, Sparkles } from "lucide-react"
import { useLoading } from "@/providers/loading-provider"

interface Chapter {
  chapter_id: number
  title: string
  summary?: string
  status: 'draft' | 'published'
  dialogue_count: number
}

export default function EditChapterContent({ 
  storyId,
  chapterId 
}: { 
  storyId: string
  chapterId: string 
}) {
  const router = useRouter()
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const { startLoading } = useLoading()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
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
  } | null>(null);
  const [publishedChapters, setPublishedChapters] = useState<{
    title: string;
    summary?: string;
  }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const response = await fetch(
          `/api/stories/${storyId}/chapters/${chapterId}`
        )
        const data = await response.json()
        
        if (response.ok) {
          setChapter(data.chapter)
        } else {
          toast.error(data.error || 'Không thể tải thông tin chương')
        }

        // Fetch story context
        const storyResponse = await fetch(`/api/stories/${storyId}`);
        if (storyResponse.ok) {
          const storyData = await storyResponse.json();
          setStoryContext({
            title: storyData.story.title,
            description: storyData.story.description,
            mainCategory: storyData.story.main_category,
            tags: storyData.story.tags,
            characters: storyData.story.characters
          });
        }

        // Fetch published chapters
        const chaptersResponse = await fetch(`/api/stories/${storyId}/chapters?status=published`);
        if (chaptersResponse.ok) {
          const data = await chaptersResponse.json();
          setPublishedChapters(data.chapters);
        }
      } catch (error) {
        toast.error('Đã có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setIsLoadingData(false);
      }
    }

    fetchData()
  }, [storyId, chapterId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const title = formData.get('title')
      const summary = formData.get('summary')
      const status = formData.get('status')

      const response = await fetch(
        `/api/stories/${storyId}/chapters/${chapterId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title, summary, status })
        }
      )

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Lỗi khi cập nhật chương')
      }

      toast.success('Cập nhật chương thành công!')
      startLoading(`/stories/${storyId}?tab=chapters&status=${data.chapter.status}`)
      router.push(`/stories/${storyId}?tab=chapters&status=${data.chapter.status}`)
    } catch (error: any) {
      toast.error(error.message || 'Đã có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (chapter) {
      startLoading(`/stories/${storyId}?tab=chapters&status=${chapter.status}`)
      router.push(`/stories/${storyId}?tab=chapters&status=${chapter.status}`)
    } else {
      startLoading(`/stories/${storyId}?tab=chapters`)
      router.push(`/stories/${storyId}?tab=chapters`)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `/api/stories/${storyId}/chapters/${chapterId}`,
        { method: 'DELETE' }
      )

      if (!response.ok) {
        throw new Error('Lỗi khi xóa chương')
      }

      toast.success('Xóa chương thành công!')
      startLoading(`/stories/${storyId}?tab=chapters&status=${chapter?.status}`)
      router.push(`/stories/${storyId}?tab=chapters&status=${chapter?.status}`)
    } catch (error: any) {
      toast.error(error.message || 'Đã có lỗi xảy ra')
    }
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

              <div className="space-y-2">
                <Skeleton width={100} height={20} />
                <Skeleton height={40} />
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <Skeleton width={120} height={40} />
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

  if (!chapter && !isLoadingData) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Đang tải...</p>
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
            <h1 className="text-xl md:text-2xl font-bold">Chỉnh sửa chương</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowIdeaGenerator(true)}
            className="ml-auto"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Gợi ý cải thiện
          </Button>
        </div>
        
        <div className="rounded-lg border bg-card p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề chương</Label>
              <Input
                id="title"
                name="title"
                defaultValue={chapter?.title}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Tóm tắt chương</Label>
              <textarea
                id="summary"
                name="summary"
                defaultValue={chapter?.summary || ""}
                placeholder="Nhập tóm tắt nội dung chương"
                className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select 
                name="status" 
                defaultValue={chapter?.status}
                disabled={chapter?.dialogue_count === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Bản nháp</SelectItem>
                  <SelectItem 
                    value="published"
                    disabled={chapter?.dialogue_count === 0}
                  >
                    Xuất bản
                  </SelectItem>
                </SelectContent>
              </Select>
              {chapter?.dialogue_count === 0 && (
                <p className="text-sm text-destructive mt-1">
                  Cần có ít nhất một tin nhắn trong chương để xuất bản
                </p>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="destructive"
                className="w-full sm:w-auto"
                onClick={() => setShowDeleteDialog(true)}
              >
                Xóa chương
              </Button>
              <div className="flex flex-col-reverse sm:flex-row gap-3 w-full sm:w-auto sm:ml-auto">
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
                  {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Chương này sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {storyContext && chapter && (
        <ChapterIdeaGenerator
          storyContext={storyContext}
          existingChapter={chapter}
          publishedChapters={publishedChapters}
          onApplyIdea={handleApplyIdea}
          open={showIdeaGenerator}
          onOpenChange={setShowIdeaGenerator}
        />
      )}
    </div>
  )
} 