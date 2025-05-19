"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpenText, Clock, Bookmark } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { useLoading } from "@/providers/loading-provider"

interface ViewHistory {
  story_id: number
  title: string
  cover_image: string
  main_category: string
  view_date: string
}

interface BookmarkedStory {
  story_id: number
  title: string
  cover_image: string
  main_category: string
  bookmarked_at: string
}

export default function AccountPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [viewHistory, setViewHistory] = useState<ViewHistory[]>([])
  const [bookmarkedStories, setBookmarkedStories] = useState<BookmarkedStory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { startLoading } = useLoading()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyRes, bookmarksRes] = await Promise.all([
          fetch('/api/account/view-history'),
          fetch('/api/account/bookmarks')
        ])
        
        const [historyData, bookmarksData] = await Promise.all([
          historyRes.json(),
          bookmarksRes.json()
        ])
        
        if (historyRes.ok) setViewHistory(historyData.history)
        if (bookmarksRes.ok) setBookmarkedStories(bookmarksData.bookmarks)
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session?.user) {
      fetchData()
    }
  }, [session])

  // Thêm loading skeleton component
  const BookmarksSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="p-4">
          <div className="flex gap-4">
            <Skeleton width={80} height={107} className="rounded-lg" />
            <div className="flex-1">
              <Skeleton width="80%" height={20} className="mb-2" />
              <Skeleton width={60} height={24} className="mb-2" />
              <Skeleton width="40%" height={16} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Thông tin người dùng */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48">
              {session?.user?.hasBadge && (
                <div className="absolute -inset-[3px] rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-gradient-xy opacity-90" />
              )}
              <div className="relative w-full h-full">
                <Image
                  src={session?.user?.avatar || '/default-user.webp'}
                  alt="Avatar"
                  fill
                  className="rounded-full object-cover"
                  sizes="192px"
                  priority
                />
              </div>
            </div>
            <CardTitle className="mt-6 text-2xl">
              {session?.user?.name}
            </CardTitle>
          </div>
        </CardHeader>
      </Card>

      {/* Truyện đã lưu */}
      <div className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold">Truyện đã lưu</h2>

        {isLoading ? (
          <BookmarksSkeleton />
        ) : bookmarkedStories.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Bookmark className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground">Chưa có truyện nào được lưu</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedStories.map((story) => (
              <Card 
                key={story.story_id}
                className="cursor-pointer hover:border-primary/50 transition-all"
                onClick={() => {
                  startLoading(`/library/${story.story_id}`)
                  router.push(`/library/${story.story_id}`)
                }}
              >
                <div className="flex gap-4 p-4">
                  <div className="relative w-[80px] aspect-[3/4]">
                    {story.cover_image ? (
                      <Image
                        src={story.cover_image}
                        alt={story.title}
                        fill
                        className="object-cover rounded-lg"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                        <BookOpenText className="w-6 h-6 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate mb-1">{story.title}</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {story.main_category}
                    </span>
                    <p className="text-xs text-muted-foreground mt-2">
                      Đã lưu: {new Date(story.bookmarked_at).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Lịch sử xem */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Lịch sử xem truyện</h2>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Đang tải lịch sử xem...</p>
          </div>
        ) : viewHistory.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground">Chưa có lịch sử xem truyện</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {viewHistory.map((item) => (
              <Card 
                key={`${item.story_id}-${item.view_date}`}
                className="cursor-pointer hover:border-primary/50 transition-all"
                onClick={() => {
                  startLoading(`/library/${item.story_id}`)
                  router.push(`/library/${item.story_id}`)
                }}
              >
                <div className="flex gap-4 p-4">
                  <div className="relative w-[80px] aspect-[3/4]">
                    {item.cover_image ? (
                      <Image
                        src={item.cover_image}
                        alt={item.title}
                        fill
                        className="object-cover rounded-lg"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                        <BookOpenText className="w-6 h-6 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate mb-1">{item.title}</h3>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                      {item.main_category}
                    </span>
                    <p className="text-xs text-muted-foreground mt-2">
                      Xem lúc: {new Date(item.view_date).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 