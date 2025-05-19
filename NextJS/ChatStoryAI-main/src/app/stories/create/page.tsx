/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import TextareaAutosize from 'react-textarea-autosize'
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { IdeaGenerator } from "@/components/ai-generator/StoryIdeaGenerator"
import { CoverImagePrompt } from "@/components/ai-generator/CoverImagePrompt"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
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

interface GeneratedIdea {
  title: string;
  description: string;
  mainCategory: string;
  suggestedTags: string[];
}

export default function CreateStoryPage() {
  const router = useRouter()
  const { startLoading } = useLoading()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedMainCategory, setSelectedMainCategory] = useState<number | null>(null)
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [previewImage, setPreviewImage] = useState<string>("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    setIsLoadingData(true)
    
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        if (response.ok) {
          setMainCategories(data.mainCategories)
          setTags(data.tags)
        }
      } catch (error) {
        toast.error('Không thể tải danh sách thể loại')
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchCategories()
  }, [])

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

  const toggleTag = (tagId: number) => {
    setSelectedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedMainCategory) {
      toast.error('Vui lòng chọn thể loại chính')
      return
    }

    // Kiểm tra xem có ảnh bìa không (hoặc từ upload hoặc từ AI)
    const fileInput = e.currentTarget.querySelector('input[name="coverImage"]') as HTMLInputElement
    if (!imageFile && (!fileInput.files || fileInput.files.length === 0)) {
      toast.error('Vui lòng chọn ảnh bìa')
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      
      // Nếu có ảnh từ AI, ưu tiên sử dụng ảnh đó
      if (imageFile) {
        formData.delete('coverImage') // Xóa file upload nếu có
        formData.append('coverImage', imageFile)
      }
      
      formData.set('mainCategoryId', selectedMainCategory.toString())
      formData.set('tagIds', JSON.stringify(selectedTags))
      
      const response = await fetch('/api/stories/create', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Lỗi khi tạo truyện')
      }

      toast.success('Tạo truyện mới thành công!')
      startLoading('/stories')
      router.push('/stories')
    } catch (error: any) {
      toast.error(error.message || 'Đã có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplyIdea = (idea: GeneratedIdea) => {
    if (!isMounted) return;
    
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

  if (isLoadingData) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
            <Skeleton width={200} height={36} />
            <div className="flex flex-col sm:flex-row gap-2">
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

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Tạo truyện mới</h1>
          <div className="flex flex-col sm:flex-row gap-2">
            <IdeaGenerator 
              mainCategories={mainCategories}
              tags={tags}
              onApplyIdea={handleApplyIdea}
            />
            {isMounted && (
              <CoverImagePrompt
                storyInfo={{
                  title: (document.getElementById('title') as HTMLInputElement)?.value || '',
                  description: (document.getElementById('description') as HTMLTextAreaElement)?.value || '',
                  mainCategory: mainCategories.find(c => c.id === selectedMainCategory)?.name || '',
                  tags: tags.filter(t => selectedTags.includes(t.id)).map(t => t.name)
                }}
                onImageGenerated={handleImageGenerated}
              />
            )}
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
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="rounded-lg object-cover w-full h-full"
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
              {isLoading ? 'Đang tạo...' : 'Tạo truyện'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 