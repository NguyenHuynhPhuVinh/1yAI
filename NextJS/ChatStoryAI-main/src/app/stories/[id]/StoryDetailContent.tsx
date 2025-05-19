/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Plus, BookOpen, Clock, User, ChevronLeft, Eye, Heart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { useLoading } from "@/providers/loading-provider"

interface Character {
  character_id: number
  name: string
  avatar_image: string
  description: string
  role: 'main' | 'supporting'
}

interface Chapter {
  chapter_id: number
  title: string
  order_number: number
  status: 'draft' | 'published'
  created_at: string
  publish_order?: number
}

interface Story {
  story_id: number
  title: string
  description: string
  cover_image: string | null
  main_category: string
  tags: string[]
  status: 'draft' | 'published' | 'archived'
  view_count: number
  favorite_count: number
}

interface Outline {
  outline_id: number
  title: string
  description: string
  order_number: number
}

export default function StoryDetailContent({ storyId }: { storyId: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { startLoading } = useLoading()
  const { data: session } = useSession()
  const [story, setStory] = useState<Story | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [characters, setCharacters] = useState<Character[]>([])
  const [outlines, setOutlines] = useState<Outline[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Lấy cả tab và status từ URL
  const currentTab = searchParams.get('tab') || 'chapters'
  const currentStatus = searchParams.get('status') || 'published'

  useEffect(() => {
    const fetchStoryData = async () => {
      try {
        // Fetch story details
        const storyResponse = await fetch(`/api/stories/${storyId}`)
        const storyData = await storyResponse.json()
        
        if (storyResponse.ok) {
          setStory(storyData.story)
        } else {
          toast.error('Không thể tải thông tin truyện')
        }

        // Fetch chapters
        const chaptersResponse = await fetch(`/api/stories/${storyId}/chapters`)
        const chaptersData = await chaptersResponse.json()
        
        if (chaptersResponse.ok) {
          setChapters(chaptersData.chapters)
        }

        // Fetch characters
        const charactersResponse = await fetch(`/api/stories/${storyId}/characters`)
        const charactersData = await charactersResponse.json()
        
        if (charactersResponse.ok) {
          setCharacters(charactersData.characters)
        }

        // Fetch outlines
        const outlinesResponse = await fetch(`/api/stories/${storyId}/outlines`)
        const outlinesData = await outlinesResponse.json()
        
        if (outlinesResponse.ok) {
          setOutlines(outlinesData.outlines)
        }
      } catch (error) {
        toast.error('Đã có lỗi xảy ra')
      } finally {
        setIsLoading(false)
      }
    }

    if (session?.user) {
      fetchStoryData()
    }
  }, [session, storyId])

  if (isLoading || !story) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton width={150} height={36} />
        </div>

        <div className="grid md:grid-cols-[300px_1fr] gap-8 mb-8">
          <div className="space-y-4">
            <Skeleton height={400} className="aspect-[3/4]" />
            <Skeleton height={36} />
          </div>
          
          <div className="flex-1 min-w-0">
            <Skeleton height={40} width="80%" className="mb-4" />
            <div className="flex flex-wrap gap-2 mb-4">
              <Skeleton width={100} height={24} />
              <Skeleton width={80} height={24} />
              <Skeleton width={120} height={24} />
            </div>
            <Skeleton count={3} className="mb-1" />
          </div>
        </div>

        <div className="mb-8">
          <Skeleton width={300} height={40} />
        </div>

        <div>
          <div className="mb-4 flex justify-between">
            <Skeleton width={200} height={32} />
            <Skeleton width={150} height={36} />
          </div>
          <Skeleton width={250} height={40} className="mb-4" />
          <div className="grid gap-4">
            <Skeleton height={100} />
            <Skeleton height={100} />
            <Skeleton height={100} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          onClick={() => {
            startLoading('/stories')
            router.push('/stories')
          }}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Danh sách truyện
        </Button>
      </div>

      <div className="grid md:grid-cols-[300px_1fr] gap-8 mb-8">
        <div className="space-y-4">
          <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-muted">
            {story.cover_image ? (
              <Image
                src={story.cover_image}
                alt={story.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 300px"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-muted-foreground/30" />
              </div>
            )}
          </div>
          <Button 
            onClick={() => {
              startLoading(`/stories/${storyId}/edit`)
              router.push(`/stories/${storyId}/edit`)
            }}
            className="w-full"
          >
            Chỉnh sửa truyện
          </Button>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-4 mb-4 min-w-0">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold leading-normal py-0.5 break-words">
                {story.title}
              </h1>
            </div>
            <div className="shrink-0">
              <Badge variant="outline" className="whitespace-nowrap">
                {story.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="default" className="text-sm truncate max-w-[200px] leading-relaxed">
              {story.main_category}
            </Badge>

            {story.tags && story.tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline"
                className="text-sm truncate max-w-[150px] leading-relaxed"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {story.view_count || 0} lượt xem
            </span>
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Heart className="w-4 h-4" />
              {story.favorite_count || 0} lượt thích
            </span>
          </div>

          <p className="text-muted-foreground prose max-w-none line-clamp-3 leading-relaxed">
            {story.description}
          </p>
        </div>
      </div>

      <Tabs defaultValue={currentTab} className="w-full" onValueChange={(value) => {
        // Khi chuyển tab, giữ nguyên status nếu đang ở tab chapters
        if (value === 'chapters') {
          //startLoading(`/stories/${storyId}?tab=${value}&status=${currentStatus}`)
          router.push(`/stories/${storyId}?tab=${value}&status=${currentStatus}`, { scroll: false })
        } else {
          //startLoading(`/stories/${storyId}?tab=${value}`)
          router.push(`/stories/${storyId}?tab=${value}`, { scroll: false })
        }
      }}>
        <TabsList className="mb-8">
          <TabsTrigger value="chapters">Danh sách chương</TabsTrigger>
          <TabsTrigger value="characters">Nhân vật</TabsTrigger>
          <TabsTrigger value="outlines">Đại cương</TabsTrigger>
        </TabsList>

        <TabsContent value="chapters">
          <Tabs defaultValue={currentStatus} className="w-full" onValueChange={(value) => {
            //startLoading(`/stories/${storyId}?tab=chapters&status=${value}`)
            router.push(`/stories/${storyId}?tab=chapters&status=${value}`, { scroll: false })
          }}>
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
              <h2 className="text-xl sm:text-2xl font-semibold">Các chương truyện</h2>
              <Button onClick={() => {
                startLoading(`/stories/${storyId}/chapters/create`)
                router.push(`/stories/${storyId}/chapters/create`)
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm chương mới
              </Button>
            </div>

            <TabsList className="mb-4">
              <TabsTrigger value="published">Đã xuất bản</TabsTrigger>
              <TabsTrigger value="draft">Bản nháp</TabsTrigger>
            </TabsList>

            <TabsContent value="published">
              <div className="grid gap-4">
                {chapters.filter(c => c.status === 'published').length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <BookOpen className="w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-3 sm:mb-4 text-muted-foreground/30" />
                    <p className="text-sm sm:text-base text-muted-foreground">Chưa có chương nào được xuất bản</p>
                  </div>
                ) : (
                  chapters
                    .filter(c => c.status === 'published')
                    .sort((a, b) => (a.publish_order || 0) - (b.publish_order || 0))
                    .map((chapter) => (
                      <Card key={chapter.chapter_id}>
                        <CardHeader className="p-3 sm:p-6">
                          <div className="flex items-center justify-between gap-2">
                            <CardTitle className="text-base sm:text-xl truncate">
                              {chapter.title}
                            </CardTitle>
                            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                              <BookOpen className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-green-500" />
                              <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                                Đã xuất bản
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardFooter className="flex gap-2 p-3 sm:p-6 pt-0 sm:pt-0">
                          <Button 
                            variant="outline" 
                            className="flex-1 text-xs sm:text-sm h-8 sm:h-9"
                            onClick={() => {
                              startLoading(`/stories/${storyId}/chapters/${chapter.chapter_id}/edit`)
                              router.push(`/stories/${storyId}/chapters/${chapter.chapter_id}/edit`)
                            }}
                          >
                            Chỉnh sửa
                          </Button>
                          <Button
                            variant="default"
                            className="flex-1 text-xs sm:text-sm h-8 sm:h-9"
                            onClick={() => {
                              startLoading(`/stories/${storyId}/chapters/${chapter.chapter_id}/write`)
                              router.push(`/stories/${storyId}/chapters/${chapter.chapter_id}/write`)
                            }}
                          >
                            Viết truyện
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="draft">
              <div className="grid gap-4">
                {chapters.filter(c => c.status === 'draft').length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                    <p className="text-muted-foreground">Chưa có bản nháp nào</p>
                  </div>
                ) : (
                  chapters
                    .filter(c => c.status === 'draft')
                    .sort((a, b) => a.order_number - b.order_number)
                    .map((chapter) => (
                      <Card key={chapter.chapter_id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">
                              {chapter.title}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm text-muted-foreground">
                                Bản nháp
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardFooter className="flex gap-2">
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => {
                              startLoading(`/stories/${storyId}/chapters/${chapter.chapter_id}/edit`)
                              router.push(`/stories/${storyId}/chapters/${chapter.chapter_id}/edit`)
                            }}
                          >
                            Chỉnh sửa
                          </Button>
                          <Button
                            variant="default"
                            className="w-full" 
                            onClick={() => {
                              startLoading(`/stories/${storyId}/chapters/${chapter.chapter_id}/write`)
                              router.push(`/stories/${storyId}/chapters/${chapter.chapter_id}/write`)
                            }}
                          >
                            Viết truyện
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="characters">
          <div className="space-y-6 sm:space-y-8">
            <div>
              <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                <h2 className="text-xl sm:text-2xl font-semibold">Nhân vật chính</h2>
                {!characters.some(c => c.role === 'main') && (
                  <Button onClick={() => {
                    startLoading(`/stories/${storyId}/characters/create?role=main`)
                    router.push(`/stories/${storyId}/characters/create?role=main`)
                  }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm nhân vật chính
                  </Button>
                )}
              </div>

              <div className="grid gap-4 sm:gap-6">
                {characters.filter(c => c.role === 'main').length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <User className="w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-3 sm:mb-4 text-muted-foreground/30" />
                    <p className="text-sm sm:text-base text-muted-foreground">Chưa có nhân vật chính nào</p>
                  </div>
                ) : (
                  characters.filter(c => c.role === 'main').map((character) => (
                    <Card key={character.character_id} className="flex flex-col sm:flex-row items-center sm:items-start p-3 sm:p-6">
                      <div className="relative w-16 sm:w-20 h-16 sm:h-20 rounded-full overflow-hidden bg-muted flex-shrink-0">
                        {character.avatar_image ? (
                          <Image 
                            src={character.avatar_image}
                            alt={character.name}
                            fill
                            sizes="(max-width: 640px) 64px, 80px"
                            className="object-cover"
                            priority
                          />
                        ) : (
                          <User className="w-8 sm:w-10 h-8 sm:h-10 m-4 sm:m-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-grow min-w-0 mt-3 sm:mt-0 sm:ml-6 text-center sm:text-left w-full sm:w-auto">
                        <CardTitle className="text-xl sm:text-2xl truncate px-4 sm:px-0">{character.name}</CardTitle>
                        <p className="text-sm sm:text-base text-muted-foreground mt-1 line-clamp-2 px-4 sm:px-0">{character.description}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-4 text-xs sm:text-sm h-8 sm:h-9"
                        onClick={() => {
                          startLoading(`/stories/${storyId}/characters/${character.character_id}/edit`)
                          router.push(`/stories/${storyId}/characters/${character.character_id}/edit`)
                        }}
                      >
                        Chỉnh sửa
                      </Button>
                    </Card>
                  ))
                )}
              </div>
            </div>

            <div>
              <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                <h2 className="text-xl sm:text-2xl font-semibold">Nhân vật phụ</h2>
                <Button onClick={() => {
                  startLoading(`/stories/${storyId}/characters/create?role=supporting`)
                  router.push(`/stories/${storyId}/characters/create?role=supporting`)
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm nhân vật phụ
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {characters.filter(c => c.role === 'supporting').length === 0 ? (
                  <div className="text-center py-8 sm:py-12 col-span-full">
                    <User className="w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-3 sm:mb-4 text-muted-foreground/30" />
                    <p className="text-sm sm:text-base text-muted-foreground">Chưa có nhân vật phụ nào</p>
                  </div>
                ) : (
                  characters.filter(c => c.role === 'supporting').map((character) => (
                    <Card key={character.character_id} className="flex flex-col p-3 sm:p-4">
                      <CardHeader className="flex flex-row items-center space-y-0 p-0 mb-3">
                        <div className="relative w-12 sm:w-16 h-12 sm:h-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
                          {character.avatar_image ? (
                            <Image 
                              src={character.avatar_image}
                              alt={character.name}
                              fill
                              sizes="(max-width: 640px) 48px, 64px"
                              className="object-cover"
                              priority
                            />
                          ) : (
                            <User className="w-6 sm:w-8 h-6 sm:h-8 m-3 sm:m-4 text-muted-foreground" />
                          )}
                        </div>
                        <CardTitle className="text-lg sm:text-xl ml-3 truncate flex-1">{character.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">{character.description}</p>
                      </CardContent>
                      <CardFooter className="p-0 mt-3">
                        <Button 
                          variant="outline" 
                          className="w-full text-xs sm:text-sm h-8 sm:h-9"
                          onClick={() => {
                            startLoading(`/stories/${storyId}/characters/${character.character_id}/edit`)
                            router.push(`/stories/${storyId}/characters/${character.character_id}/edit`)
                          }}
                        >
                          Chỉnh sửa
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="outlines">
          <div className="space-y-6">
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
              <h2 className="text-xl sm:text-2xl font-semibold">Đại cương truyện</h2>
              <Button onClick={() => {
                startLoading(`/stories/${storyId}/outlines/create`)
                router.push(`/stories/${storyId}/outlines/create`)
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm đại cương
              </Button>
            </div>

            {outlines.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <BookOpen className="w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-3 sm:mb-4 text-muted-foreground/30" />
                <p className="text-sm sm:text-base text-muted-foreground">Chưa có đại cương nào</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {outlines.map((outline) => (
                  <Card key={outline.outline_id}>
                    <CardHeader>
                      <CardTitle>{outline.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{outline.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          startLoading(`/stories/${storyId}/outlines/${outline.outline_id}/edit`)
                          router.push(`/stories/${storyId}/outlines/${outline.outline_id}/edit`)
                        }}
                      >
                        Chỉnh sửa
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 