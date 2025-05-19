/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import TextareaAutosize from 'react-textarea-autosize'
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import Image from "next/image"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Suspense } from "react"
import { ChevronLeft } from "lucide-react"
import { IdeaGenerator } from "@/components/ai-generator/StoryIdeaGenerator"
import { CoverImagePrompt } from "@/components/ai-generator/CoverImagePrompt"
import { useLoading } from "@/providers/loading-provider"

interface MainCategory {
  id: number
  name: string
  description?: string
}

interface Tag {
  id: number
  name: string
  description?: string
}

interface Story {
  story_id: number
  title: string
  description: string
  cover_image: string | null
  main_category_id: number
  tag_ids: number[]
  status: 'draft' | 'published' | 'archived'
}

interface GeneratedIdea {
  title: string;
  description: string;
  mainCategory: string;
  suggestedTags: string[];
}

function EditStoryContent({ storyId }: { storyId: string }) {
  const router = useRouter()
  const { data: session } = useSession()
  const { startLoading } = useLoading()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedMainCategory, setSelectedMainCategory] = useState<number | null>(null)
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [story, setStory] = useState<Story | null>(null)
  const [previewImage, setPreviewImage] = useState<string>("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true)
      try {
        // Fetch categories và tags
        const categoriesResponse = await fetch('/api/categories')
        const categoriesData = await categoriesResponse.json()
        setMainCategories(categoriesData.mainCategories)
        setTags(categoriesData.tags)

        // Fetch story details
        const storyResponse = await fetch(`/api/stories/${storyId}`)
        const { story } = await storyResponse.json()
        
        if (storyResponse.ok && story) {
          setStory(story)
          setSelectedMainCategory(story.main_category_id)
          // Đảm bảo tag_ids là mảng số
          const tagIds = Array.isArray(story.tag_ids) 
            ? story.tag_ids 
            : story.tag_ids?.split(',').map(Number) || []
          setSelectedTags(tagIds)
          setPreviewImage(story.cover_image || "")
        } else {
          toast.error('Không thể tải thông tin truyện')
        }
      } catch (error) {
        toast.error('Đã có lỗi xảy ra')
      } finally {
        setIsLoadingData(false)
      }
    }

    if (session?.user) {
      fetchData()
    }
  }, [session, storyId])

  const toggleTag = (tagId: number) => {
    setSelectedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedMainCategory) {
      toast.error('Vui lòng chọn thể loại chính')
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      
      if (imageFile) {
        formData.delete('coverImage')
        formData.append('coverImage', imageFile)
      }
      
      formData.set('mainCategoryId', selectedMainCategory.toString())
      formData.set('tagIds', JSON.stringify(selectedTags))

      const response = await fetch(`/api/stories/${storyId}`, {
        method: 'PUT',
        body: formData,
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error('Lỗi khi cập nhật truyện')
      }

      await fetch(`/api/revalidate?path=/stories/${storyId}`)
      
      toast.success('Cập nhật truyện thành công!')
      
      router.refresh()
      
      startLoading('/stories')
      router.push('/stories')
    } catch (error: any) {
      toast.error(error.message || 'Đã có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      // Thêm tham số để yêu cầu xóa tất cả dữ liệu liên quan
      const response = await fetch(`/api/stories/${storyId}?cascade=true`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Lỗi khi xóa truyện')
      }

      toast.success('Xóa truyện thành công')
      startLoading('/stories')
      router.push('/stories')
    } catch (error: any) {
      toast.error(error.message || 'Đã có lỗi xảy ra')
    }
  }

  const checkPublishConditions = async (storyId: string) => {
    try {
      const response = await fetch(`/api/stories/${storyId}/chapters`)
      const data = await response.json()
      
      if (response.ok) {
        return data.chapters.some((chapter: any) => chapter.status === 'published')
      }
      return false
    } catch (error) {
      return false
    }
  }

  const handlePublish = async () => {
    try {
      setIsPublishing(true)
      const canPublish = await checkPublishConditions(storyId)
      if (!canPublish) {
        toast.error('Cần có ít nhất một chương đã xuất bản để xuất bản truyện')
        setIsPublishing(false)
        return
      }

      const response = await fetch(`/api/stories/${storyId}/publish`, {
        method: 'PUT'
      })

      if (!response.ok) {
        throw new Error('Lỗi khi xuất bản truyện')
      }

      toast.success('Xuất bản truyện thành công!')
      // Cập nhật trạng thái truyện thành 'published'
      setStory(prev => prev ? {...prev, status: 'published'} : null)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Đã có lỗi xảy ra')
    } finally {
      setIsPublishing(false)
    }
  }

  const handleApplyIdea = (idea: GeneratedIdea) => {
    const titleInput = document.getElementById('title') as HTMLInputElement;
    const descriptionInput = document.getElementById('description') as HTMLTextAreaElement;
    
    if (titleInput) titleInput.value = idea.title;
    if (descriptionInput) descriptionInput.value = idea.description;
    
    const matchedCategory = mainCategories.find(
      cat => cat.name.toLowerCase() === idea.mainCategory.toLowerCase()
    );
    if (matchedCategory) setSelectedMainCategory(matchedCategory.id);
    
    const matchedTags = tags.filter(tag =>
      idea.suggestedTags.some(suggestedTag => tag.name.toLowerCase() === suggestedTag.toLowerCase())
    );
    setSelectedTags(matchedTags.map(tag => tag.id));
  };

  const mainCategoryName = mainCategories.find(c => c.id === selectedMainCategory)?.name || '';
  const selectedTagNames = tags
    .filter(t => selectedTags.includes(t.id))
    .map(t => t.name);

  const handleImageGenerated = (imageData: string) => {
    const byteString = atob(imageData);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: 'image/jpeg' });
    const file = new File([blob], 'cover.jpg', { type: 'image/jpeg' });
    
    setImageFile(file);
    setPreviewImage(`data:image/jpeg;base64,${imageData}`);
  };

  if (isLoadingData) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center gap-2 mb-8">
          <Skeleton width={100} height={36} />
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
            <Skeleton width={200} height={36} />
            <div className="flex flex-col sm:flex-row gap-2">
              <Skeleton width={120} height={36} />
              <Skeleton width={120} height={36} />
              <Skeleton width={120} height={36} />
            </div>
          </div>
          
          <div className="grid md:grid-cols-[300px,1fr] gap-6 md:gap-8">
            {/* Cột trái - Ảnh bìa */}
            <div className="space-y-4">
              <Skeleton width={100} height={20} />
              <Skeleton height={400} className="aspect-[3/4]" />
            </div>

            {/* Cột phải - Form thông tin */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton width={80} height={20} />
                <Skeleton height={40} />
              </div>

              <div className="space-y-2">
                <Skeleton width={80} height={20} />
                <Skeleton height={120} />
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton width={120} height={20} />
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} width={80} height={28} />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Skeleton width={100} height={20} />
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <Skeleton key={i} width={70} height={28} />
                    ))}
                  </div>
                  <Skeleton width={150} height={16} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 mt-6">
            <Skeleton width={150} height={40} />
            <Skeleton width={150} height={40} />
          </div>
        </div>
      </div>
    )
  }

  if (!story) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-8"
      >
        <ChevronLeft className="w-4 h-4" />
        Quay lại
      </Button>

      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Chỉnh sửa truyện</h1>
          <div className="flex flex-col sm:flex-row gap-2">
            <IdeaGenerator 
              mainCategories={mainCategories}
              tags={tags}
              onApplyIdea={handleApplyIdea}
              existingStory={{
                title: story.title,
                description: story.description,
                mainCategory: mainCategoryName,
                currentTags: selectedTagNames
              }}
            />
            <CoverImagePrompt
              storyInfo={{
                title: (document.getElementById('title') as HTMLInputElement)?.value || '',
                description: (document.getElementById('description') as HTMLTextAreaElement)?.value || '',
                mainCategory: mainCategories.find(c => c.id === selectedMainCategory)?.name || '',
                tags: tags.filter(t => selectedTags.includes(t.id)).map(t => t.name)
              }}
              onImageGenerated={handleImageGenerated}
            />
            {story.status === 'draft' ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="default" 
                    className="w-full sm:w-auto"
                    disabled={isPublishing}
                  >
                    {isPublishing ? "Đang xuất bản..." : "Xuất bản truyện"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận xuất bản truyện</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc chắn muốn xuất bản truyện này?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction onClick={handlePublish} disabled={isPublishing}>
                      {isPublishing ? "Đang xuất bản..." : "Xuất bản"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Button 
                variant="default" 
                className="w-full sm:w-auto" 
                disabled={true}
              >
                Đã xuất bản
              </Button>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full sm:w-auto">Xóa truyện</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận xóa truyện</AlertDialogTitle>
                  <AlertDialogDescription>
                    Hành động này không thể hoàn tác.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Xóa
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
          <div className="grid md:grid-cols-[300px,1fr] gap-6 md:gap-8">
            {/* Cột trái - Ảnh bìa */}
            <div className="space-y-4">
              <Label htmlFor="coverImage">Ảnh bìa</Label>
              <Input
                id="coverImage"
                name="coverImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <div 
                className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => document.getElementById('coverImage')?.click()}
              >
                {previewImage ? (
                  <div className="relative aspect-[3/4] w-full">
                    <Image
                      src={previewImage}
                      alt="Preview"
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                ) : (
                  <div className="py-12">
                    <p className="text-muted-foreground">
                      Nhấn để chọn ảnh bìa
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Định dạng: JPG, PNG (Tỷ lệ 3:4)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Cột phải - Form thông tin */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={story.title}
                  placeholder="Nhập tiêu đề truyện"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <div className="relative">
                  <TextareaAutosize
                    id="description"
                    name="description"
                    defaultValue={story.description}
                    placeholder="Nhập mô tả ngắn về truyện"
                    required
                    minRows={3}
                    className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Thể loại chính</Label>
                  <div className="flex flex-wrap gap-2">
                    {mainCategories.map((category) => (
                      <Badge
                        key={category.id}
                        variant={selectedMainCategory === category.id ? "default" : "outline"}
                        className={`cursor-pointer text-sm px-3 py-1 transition-colors ${
                          selectedMainCategory === category.id 
                            ? "hover:bg-primary/90" 
                            : "hover:bg-primary/10 hover:text-primary"
                        }`}
                        onClick={() => setSelectedMainCategory(category.id)}
                      >
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                  {!selectedMainCategory && (
                    <p className="text-sm text-destructive">Vui lòng chọn một thể loại chính</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Thẻ phụ</Label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                        className={`cursor-pointer text-sm px-3 py-1 transition-colors ${
                          selectedTags.includes(tag.id)
                            ? "hover:bg-primary/90"
                            : "hover:bg-primary/10 hover:text-primary"
                        }`}
                        onClick={() => toggleTag(tag.id)}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Đã chọn {selectedTags.length} thẻ
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="w-full md:w-auto md:min-w-[150px]"
            >
              Hủy
            </Button>
            <Button 
              type="submit" 
              className="w-full md:w-auto md:min-w-[150px]"
              disabled={isLoading || !selectedMainCategory}
            >
              {isLoading ? "Đang cập nhật..." : "Cập nhật truyện"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default async function EditStoryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditStoryContent storyId={resolvedParams.id} />
    </Suspense>
  )
} 