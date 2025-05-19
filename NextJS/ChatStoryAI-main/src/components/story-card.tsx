/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpenText, Eye, Heart } from "lucide-react"
import { useState, useEffect } from "react"
import { useLoading } from "@/providers/loading-provider"

interface StoryCardProps {
  story: {
    story_id: number
    title: string
    description: string
    cover_image: string | null
    main_category: string
    view_count: number
    favorite_count: number
    updated_at: string
    relevance_score?: number
    match_reason?: string
    tags?: string[]
  }
  onClick?: () => void
  variant?: 'default' | 'search'
  showRelevance?: boolean
}

export function StoryCard({ story, onClick, variant = 'default', showRelevance = false }: StoryCardProps) {
  const router = useRouter()
  const { startLoading } = useLoading()
  const [favoriteCount, setFavoriteCount] = useState(story.favorite_count)

  useEffect(() => {
    fetchFavoriteCount()
  }, [story.story_id])

  const fetchFavoriteCount = async () => {
    try {
      const res = await fetch(`/api/stories/${story.story_id}/favorites/count`)
      const data = await res.json()
      setFavoriteCount(data.count)
    } catch (error) {
      console.error('Lỗi khi lấy số lượt thích:', error)
    }
  }

  const handleClick = async () => {
    if (onClick) {
      onClick()
      return
    }
    try {
      // Gọi API để tăng lượt xem
      await fetch(`/api/library/${story.story_id}/view`, {
        method: 'POST',
      })
      startLoading(`/library/${story.story_id}`)
      // Chuyển hướng đến trang chi tiết
      router.push(`/library/${story.story_id}`)
    } catch (error) {
      console.error('Lỗi khi cập nhật lượt xem:', error)
      // Vẫn chuyển hướng ngay cả khi không cập nhật được lượt xem
      startLoading(`/library/${story.story_id}`)
      router.push(`/library/${story.story_id}`)
    }
  }

  if (variant === 'search') {
    return (
      <div 
        onClick={handleClick}
        className="flex gap-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer"
      >
        <div className="relative aspect-[3/4] w-[80px] rounded-md overflow-hidden">
          {story.cover_image ? (
            <Image
              src={story.cover_image}
              alt={story.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <BookOpenText className="w-6 h-6 text-muted-foreground/30" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{story.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{story.description}</p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{story.view_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{story.favorite_count}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card 
      className="flex flex-col overflow-hidden cursor-pointer transition-all hover:border-primary/50"
      onClick={handleClick}
    >
      <div className="relative w-full aspect-[3/4]">
        {story.cover_image ? (
          <Image
            src={story.cover_image}
            alt={story.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <BookOpenText className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}
      </div>

      <CardHeader className="p-4 space-y-2">
        <CardTitle className="line-clamp-2 text-lg">{story.title}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {story.description}
        </p>
      </CardHeader>

      <CardFooter className="p-4 pt-0 mt-auto">
        <div className="flex items-center justify-between w-full">
          <span className="bg-primary/20 text-primary px-2.5 py-1 rounded-full text-sm">
            {story.main_category}
          </span>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{story.view_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{favoriteCount}</span>
            </div>
          </div>
        </div>
      </CardFooter>

      {showRelevance && story.relevance_score !== undefined && (
        <div className="p-4 pt-0 mt-auto">
          <div className="flex items-center justify-between w-full">
            <span className="text-sm text-gray-600">
              Độ phù hợp:
            </span>
            <span className="font-medium">{story.relevance_score}%</span>
          </div>
          {story.match_reason && (
            <p className="text-sm text-gray-600 italic">
              &quot;{story.match_reason}&quot;
            </p>
          )}
        </div>
      )}

      {story.tags && story.tags.length > 0 && (
        <div className="p-4 pt-0 mt-auto">
          <div className="flex flex-wrap gap-1 max-h-[32px] overflow-hidden">
            {story.tags?.map((tag: string, index: number) => (
              index < 3 ? (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-gray-100 rounded-full whitespace-nowrap"
                >
                  {tag}
                </span>
              ) : index === 3 ? (
                <span
                  key="more"
                  className="px-2 py-1 text-xs bg-gray-100 rounded-full whitespace-nowrap"
                >
                  +{(story.tags?.length ?? 0) - 3}
                </span>
              ) : null
            ))}
          </div>
        </div>
      )}
    </Card>
  )
} 