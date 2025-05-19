/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, BookOpen, Clock, Archive, BookOpenText, Eye, Heart } from "lucide-react"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import Image from "next/image"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { useLoading } from "@/providers/loading-provider"

interface Story {
  story_id: number
  title: string
  cover_image: string | null
  main_category: string
  status: 'draft' | 'published' | 'archived'
  view_count: number
  favorite_count: number
  updated_at: string
}

export default function StoriesPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { startLoading } = useLoading()
  const [stories, setStories] = useState<Story[]>([])
  const [isLoadingStories, setIsLoadingStories] = useState(true)

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/stories')
      const data = await response.json()
      
      if (response.ok) {
        setStories(data.stories)
      } else {
        toast.error(data.error || 'Không thể tải danh sách truyện')
      }
    } catch (error) {
      toast.error('Đã có lỗi xảy ra khi tải danh sách truyện')
    } finally {
      setIsLoadingStories(false)
    }
  }

  useEffect(() => {
    if (session?.user) {
      fetchStories()
    } else if (status === 'unauthenticated') {
      setIsLoadingStories(false)
    }
  }, [session, status])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'published':
        return <BookOpen className="w-4 h-4 text-green-500" />
      case 'archived':
        return <Archive className="w-4 h-4 text-gray-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Bản nháp'
      case 'published':
        return 'Đã xuất bản'
      case 'archived':
        return 'Đã lưu trữ'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl font-bold">Truyện của tôi</h1>
            {session?.user && (
              <Button onClick={() => {
                startLoading('/stories/create')
                router.push('/stories/create')
              }} className="px-6">
                <Plus className="w-4 h-4 mr-3" />
                Tạo truyện mới
              </Button>
            )}
          </div>

          {isLoadingStories ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Card key={item} className="flex flex-row h-[140px] sm:h-[160px] overflow-hidden">
                  <div className="relative w-[105px] sm:w-[120px] h-full flex-shrink-0">
                    <Skeleton height="100%" style={{ aspectRatio: '3/4' }} />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0 p-2 sm:p-4">
                    <CardHeader className="p-0 space-y-1.5 sm:space-y-3">
                      <div className="flex items-start gap-1.5 sm:gap-2">
                        <div className="min-w-0 flex-1">
                          <Skeleton width="80%" height={20} />
                        </div>
                        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 mt-0.5">
                          <Skeleton width={60} height={16} />
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                        <Skeleton width={80} height={20} />
                        <div className="ml-auto">
                          <Skeleton width={60} height={16} />
                        </div>
                      </div>
                    </CardHeader>
                    <CardFooter className="flex flex-row justify-between gap-1.5 sm:gap-2 p-0 mt-auto pt-1.5 sm:pt-3">
                      <Skeleton width="48%" height={32} />
                      <Skeleton width="48%" height={32} />
                    </CardFooter>
                  </div>
                </Card>
              ))}
            </div>
          ) : !session?.user ? (
            <div className="text-center py-8 sm:py-12">
              <BookOpenText className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-6 sm:mb-8 text-muted-foreground/30" />
              <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                Vui lòng đăng nhập để bắt đầu
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground px-4 mb-6">
                Bạn cần đăng nhập để xem và tạo truyện của mình
              </p>
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <BookOpenText className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-6 sm:mb-8 text-muted-foreground/30" />
              <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                Bạn chưa có truyện nào
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground px-4">
                Hãy bắt đầu hành trình sáng tạo bằng việc tạo truyện đầu tiên của bạn
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {stories.map((story) => (
                <Card key={story.story_id} className="flex flex-row h-[140px] sm:h-[160px] overflow-hidden">
                  <div className="relative w-[105px] sm:w-[120px] h-full flex-shrink-0">
                    {story.cover_image ? (
                      <Image
                        src={story.cover_image}
                        alt={story.title}
                        fill
                        sizes="(max-width: 640px) 105px, 120px"
                        className="object-cover"
                        style={{ aspectRatio: '3/4' }}
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center" style={{ aspectRatio: '3/4' }}>
                        <BookOpenText className="w-5 sm:w-6 h-5 sm:h-6 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0 p-2 sm:p-4">
                    <CardHeader className="p-0 space-y-1.5 sm:space-y-3">
                      <div className="flex items-start gap-1.5 sm:gap-2">
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-xs sm:text-base truncate">
                            {story.title}
                          </CardTitle>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 mt-0.5">
                          {getStatusIcon(story.status)}
                          <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
                            {getStatusText(story.status)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                        <span className="text-[10px] sm:text-xs bg-primary/20 text-primary px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-medium truncate max-w-[100px] sm:max-w-[130px]">
                          {story.main_category}
                        </span>
                        <div className="flex items-center gap-2 ml-auto shrink-0">
                          <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
                            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            {story.view_count}
                          </span>
                          <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
                            <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            {story.favorite_count || 0}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardFooter className="flex flex-row justify-between gap-1.5 sm:gap-2 p-0 mt-auto pt-1.5 sm:pt-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1 text-[10px] sm:text-xs h-6 sm:h-8 px-1.5 sm:px-3"
                        onClick={() => {
                          startLoading(`/stories/${story.story_id}/edit`)
                          router.push(`/stories/${story.story_id}/edit`)
                        }}
                      >
                        Chỉnh sửa
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="flex-1 text-[10px] sm:text-xs h-6 sm:h-8 px-1.5 sm:px-3"
                        onClick={() => {
                          startLoading(`/stories/${story.story_id}`)
                          router.push(`/stories/${story.story_id}`)
                        }}
                      >
                        Xem truyện
                      </Button>
                    </CardFooter>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}