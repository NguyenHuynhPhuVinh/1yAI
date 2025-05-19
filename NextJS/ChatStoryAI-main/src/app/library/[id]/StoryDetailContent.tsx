"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { BookOpenText, Clock, Eye, Heart, Check, MoreVertical, BookOpen, BookOpenCheck } from "lucide-react"
import { Card, CardHeader } from "@/components/ui/card"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { StoryFavoriteButton } from '@/components/story/story-favorite-button';
import { StoryComments } from '@/components/story/story-comments';
import { StoryBookmarkButton } from '@/components/story/story-bookmark-button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import clsx from "clsx"
import { useSession } from "next-auth/react"
import { useLoading } from "@/providers/loading-provider"

interface Story {
  story_id: number
  title: string
  description: string
  cover_image: string | null
  main_category: string
  view_count: number
  updated_at: string
  tags: string[]
  favorite_count: number
  author: {
    id: string
    name: string
    avatar: string
  }
  author_avatar: string | null
  author_name: string
  has_badge: boolean
}

interface Chapter {
  chapter_id: number
  title: string
  status: string
  publish_order: number
  is_read?: boolean
}

export default function StoryDetailContent({ storyId }: { storyId: string }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [story, setStory] = useState<Story | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { startLoading } = useLoading()

  useEffect(() => {
    const fetchStoryData = async () => {
      try {
        const [storyRes, chaptersRes] = await Promise.all([
          fetch(`/api/library/${storyId}`),
          fetch(`/api/library/${storyId}/chapters`)
        ])
        
        const [storyData, chaptersData] = await Promise.all([
          storyRes.json(),
          chaptersRes.json()
        ])

        if (storyRes.ok) setStory(storyData.story)
        if (chaptersRes.ok) {
          const processedChapters = chaptersData.chapters.map((chapter: Chapter) => ({
            ...chapter,
            is_read: session ? chapter.is_read : false
          }))
          setChapters(processedChapters)
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStoryData()
  }, [storyId, session])

  const handleMarkAsRead = async (chapterId: number) => {
    try {
      const response = await fetch(`/api/library/${storyId}/chapters/${chapterId}/read`, {
        method: 'POST',
      })
      if (response.ok) {
        setChapters(chapters.map(ch => 
          ch.chapter_id === chapterId ? {...ch, is_read: true} : ch
        ))
      }
    } catch (error) {
      console.error('Lỗi khi đánh dấu chương đã đọc:', error)
    }
  }

  const handleMarkAsUnread = async (chapterId: number) => {
    try {
      const response = await fetch(`/api/library/${storyId}/chapters/${chapterId}/read`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setChapters(chapters.map(ch => 
          ch.chapter_id === chapterId ? {...ch, is_read: false} : ch
        ))
      }
    } catch (error) {
      console.error('Lỗi khi bỏ đánh dấu chương đã đọc:', error)
    }
  }

  const handleContinueReading = () => {
    const firstUnreadChapter = chapters.find(chapter => !chapter.is_read)
    if (firstUnreadChapter) {
      startLoading(`/library/${storyId}/chapters/${firstUnreadChapter.chapter_id}`)
      router.push(`/library/${storyId}/chapters/${firstUnreadChapter.chapter_id}`)
    }
  }

  const handleStartReading = () => {
    const firstChapter = chapters[0]
    if (firstChapter) {
      startLoading(`/library/${storyId}/chapters/${firstChapter.chapter_id}`)
      router.push(`/library/${storyId}/chapters/${firstChapter.chapter_id}`)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      // Đánh dấu từng chương chưa đọc
      const unreadChapters = chapters.filter(ch => !ch.is_read)
      await Promise.all(
        unreadChapters.map(chapter => 
          fetch(`/api/library/${storyId}/chapters/${chapter.chapter_id}/read`, {
            method: 'POST',
          })
        )
      )
      
      // Cập nhật state local
      setChapters(chapters.map(ch => ({...ch, is_read: true})))
      
      toast.success("Đã đánh dấu tất cả chương là đã đọc")
    } catch (error) {
      console.error('Lỗi khi đánh dấu đã đọc hết:', error)
      toast.error("Có lỗi xảy ra khi đánh dấu đã đọc")
    }
  }

  const handleCategoryClick = (category: string) => {
    startLoading(`/library/search?category=${encodeURIComponent(category)}`)
    router.push(`/library/search?category=${encodeURIComponent(category)}`)
  }

  const handleTagClick = (tag: string) => {
    startLoading(`/library/search?tags=${encodeURIComponent(tag)}`)
    router.push(`/library/search?tags=${encodeURIComponent(tag)}`)
  }

  if (isLoading || !story) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          {/* Skeleton cho cột trái - ảnh bìa */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden">
              <Skeleton height="100%" />
            </div>
          </div>

          {/* Skeleton cho cột phải - thông tin truyện */}
          <div className="space-y-6">
            <div>
              <Skeleton height={32} width="80%" className="mb-2" />
              <Skeleton count={3} className="mb-1" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton width={100} height={28} />
                <Skeleton width={120} height={24} />
              </div>

              <div className="flex flex-wrap gap-2">
                {Array(5).fill(0).map((_, index) => (
                  <Skeleton key={index} width={80} height={28} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Skeleton cho danh sách chương */}
        <div className="mt-8">
          <Skeleton height={32} width={200} className="mb-4" />
          <div className="space-y-3">
            {Array(5).fill(0).map((_, index) => (
              <Skeleton key={index} height={60} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-[300px_1fr] gap-8">
        {/* Thông tin truyện - cột trái */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden">
            {story.cover_image ? (
              <Image
                src={story.cover_image}
                alt={story.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 300px"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <BookOpenText className="w-12 h-12 text-muted-foreground/30" />
              </div>
            )}
          </div>
        </div>

        {/* Thông tin truyện - cột phải */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{story.title}</h1>
              {session && (
                <div className="flex items-center gap-2">
                  <StoryBookmarkButton storyId={storyId} />
                  <StoryFavoriteButton storyId={storyId} favoriteCount={story.favorite_count} />
                </div>
              )}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="relative">
                {story.has_badge && (
                  <div className={clsx(
                    "absolute -inset-[3px] rounded-full",
                    "bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500",
                    "animate-gradient-xy",
                    "opacity-90"
                  )} />
                )}
                <div className="relative w-8 h-8">
                  <Image 
                    src={story.author_avatar || '/default-user.webp'} 
                    alt="Author avatar"
                    fill
                    sizes="32px"
                    className="rounded-full object-cover"
                    priority
                  />
                </div>
              </div>
              <span className="text-sm text-muted-foreground">{story.author_name}</span>
            </div>
          </div>
          
          <div>
            <p className="text-muted-foreground">{story.description}</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span 
                className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium hover:bg-primary/20 cursor-pointer transition-colors"
                onClick={() => handleCategoryClick(story.main_category)}
              >
                {story.main_category}
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                {story.view_count} lượt xem
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Heart className="w-4 h-4" />
                {story.favorite_count} lượt thích
              </span>
            </div>

            {story.tags && story.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {story.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-muted/50 text-muted-foreground hover:bg-muted transition-colors px-3 py-1.5 rounded-full text-sm cursor-pointer"
                    onClick={() => handleTagClick(tag)}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Thêm nút đọc từ đầu/đọc tiếp */}
          {session && (
            <div className="flex gap-3">
              <Button 
                onClick={handleStartReading}
                disabled={chapters.length === 0}
                className="flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Đọc từ đầu
              </Button>
              <Button 
                onClick={handleContinueReading}
                disabled={!chapters.some(chapter => !chapter.is_read)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <BookOpenCheck className="w-4 h-4" />
                Đọc tiếp
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Danh sách chương */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Danh sách chương</h2>
          {session && (
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleMarkAllAsRead}
              disabled={chapters.length === 0 || chapters.every(ch => ch.is_read)}
            >
              <BookOpenCheck className="w-4 h-4" />
              Đánh dấu đã đọc hết
            </Button>
          )}
        </div>
        
        <div className="space-y-3">
          {chapters.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground">Chưa có chương nào được xuất bản</p>
            </div>
          ) : (
            chapters.map((chapter) => (
              <Card 
                key={chapter.chapter_id}
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => {
                  startLoading(`/library/${storyId}/chapters/${chapter.chapter_id}`)
                  router.push(`/library/${storyId}/chapters/${chapter.chapter_id}`)
                }}
              >
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium hover:text-primary">
                      {chapter.title}
                    </h3>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {session && chapter.is_read ? (
                        <Check className="w-4 h-4 text-primary" />
                      ) : null}
                      {session && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {!chapter.is_read ? (
                              <DropdownMenuItem onClick={() => handleMarkAsRead(chapter.chapter_id)}>
                                Đánh dấu đã đọc
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleMarkAsUnread(chapter.chapter_id)}>
                                Bỏ đánh dấu đã đọc
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Phần bình luận */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Bình luận</h2>
        <StoryComments storyId={storyId} />
      </div>
    </div>
  )
} 