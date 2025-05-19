/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, User, Hand, Menu } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import clsx from "clsx"
import { useLoading } from "@/providers/loading-provider"

interface Character {
  character_id: number
  name: string
  avatar_image: string | null
  role: 'main' | 'supporting'
}

interface Dialogue {
  dialogue_id: number
  character_id: number | null
  content: string
  order_number: number
  character?: Character
  type?: 'dialogue' | 'aside'
}

interface Chapter {
  chapter_id: number
  title: string
  publish_order: number
  dialogues: Dialogue[]
  status: string
}

export default function ChapterContent({ 
  storyId, 
  chapterId 
}: { 
  storyId: string
  chapterId: string 
}) {
  const router = useRouter()
  const { startLoading } = useLoading()
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [nextChapter, setNextChapter] = useState<Chapter | null>(null)
  const [prevChapter, setPrevChapter] = useState<Chapter | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [visibleDialogues, setVisibleDialogues] = useState<number[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollableRef = useRef<HTMLDivElement>(null)
  const [isMarkedAsRead, setIsMarkedAsRead] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [storyTitle, setStoryTitle] = useState("")
  const [allChapters, setAllChapters] = useState<Chapter[]>([])
  const [readingProgress, setReadingProgress] = useState(0)

  useEffect(() => {
    const fetchStoryData = async () => {
      try {
        const [chapterRes, chaptersRes, storyRes] = await Promise.all([
          fetch(`/api/library/${storyId}/chapters/${chapterId}`),
          fetch(`/api/library/${storyId}/chapters`),
          fetch(`/api/library/${storyId}`)
        ])
        
        const [chapterData, chaptersData, storyData] = await Promise.all([
          chapterRes.json(),
          chaptersRes.json(),
          storyRes.json()
        ])

        if (storyRes.ok) {
          setStoryTitle(storyData.story.title)
        }

        if (chapterRes.ok) {
          setChapter(chapterData.chapter)
          setVisibleDialogues([])
          
          const publishedChapters = chaptersData.chapters
            .filter((c: Chapter) => c.status === 'published')
            .sort((a: Chapter, b: Chapter) => a.publish_order - b.publish_order)
          
          setAllChapters(publishedChapters)
          
          const currentIndex = publishedChapters.findIndex(
            (c: Chapter) => c.chapter_id === Number(chapterId)
          )
          
          setPrevChapter(publishedChapters[currentIndex - 1] || null)
          setNextChapter(publishedChapters[currentIndex + 1] || null)
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStoryData()
  }, [storyId, chapterId])

  const isChapterCompleted = chapter?.dialogues && 
    visibleDialogues.length === chapter.dialogues.length

  useEffect(() => {
    if (isChapterCompleted && !isMarkedAsRead) {
      markChapterAsRead()
    }
  }, [isChapterCompleted])

  const markChapterAsRead = async () => {
    try {
      const response = await fetch(`/api/library/${storyId}/chapters/${chapterId}/read`, {
        method: 'POST',
      })
      
      if (response.ok) {
        setIsMarkedAsRead(true)
      }
    } catch (error) {
      console.error('Lỗi khi đánh dấu chương đã đọc:', error)
    }
  }

  const showNextDialogue = () => {
    if (chapter?.dialogues && visibleDialogues.length < chapter.dialogues.length) {
      const nextDialogue = chapter.dialogues[visibleDialogues.length]
      setVisibleDialogues(prev => [...prev, nextDialogue.dialogue_id])
    }
  }

  useEffect(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
    }
  }, [visibleDialogues])

  const calculateProgress = () => {
    if (!chapter?.dialogues) return 0
    return (visibleDialogues.length / chapter.dialogues.length) * 100
  }

  useEffect(() => {
    setReadingProgress(calculateProgress())
  }, [visibleDialogues])

  if (isLoading || !chapter) {
    return (
      <div className="flex">
        {/* Loading Sidebar */}
        <div className="hidden lg:block w-72 h-screen border-r">
          <div className="p-4">
            <Skeleton height={32} width="80%" className="mb-4" />
            <div className="space-y-2">
              {Array(10).fill(0).map((_, i) => (
                <Skeleton key={i} height={36} />
              ))}
            </div>
          </div>
        </div>

        {/* Loading Main Content */}
        <div className="flex-1">
          <div className="container max-w-2xl mx-auto px-4 py-8">
            {/* Skeleton cho nút quay lại */}
            <div className="mb-8">
              <Skeleton width={180} height={40} />
            </div>

            {/* Skeleton cho tiêu đề chương */}
            <div className="mb-8 text-center">
              <Skeleton width="70%" height={36} className="mx-auto" />
            </div>

            {/* Skeleton cho khu vực nội dung hội thoại */}
            <div className="min-h-[50vh] max-h-[70vh] border-2 border-muted rounded-lg p-4">
              <div className="space-y-6">
                {Array(5).fill(0).map((_, index) => (
                  <div key={index} className={`flex items-start gap-3 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <Skeleton circle width={40} height={40} />
                    </div>
                    <div className={`flex-1 ${index % 2 === 0 ? '' : 'text-right'}`}>
                      <Skeleton width={100} height={20} className={index % 2 === 0 ? '' : 'ml-auto'} />
                      <div className={`mt-1 flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                        <Skeleton width={200} height={80} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skeleton cho nút điều hướng chương */}
            <div className="flex justify-between items-center mt-12 gap-4">
              <Skeleton width={120} height={40} />
              <Skeleton width={120} height={40} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex">
      {/* Sidebar cho PC */}
      <div className="hidden lg:block w-72 h-screen border-r sticky top-0 overflow-y-auto">
        <div className="p-4">
          <h2 className="font-bold text-xl mb-4">{storyTitle}</h2>
          <div className="space-y-2">
            {allChapters.map((c) => (
              <button
                key={c.chapter_id}
                onClick={() => {
                  startLoading(`/library/${storyId}/chapters/${c.chapter_id}`)
                  router.push(`/library/${storyId}/chapters/${c.chapter_id}`)
                }}
                className={clsx(
                  "w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors",
                  Number(chapterId) === c.chapter_id && "bg-primary text-primary-foreground"
                )}
              >
                {c.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu cho Mobile */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Mobile Sidebar */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>{storyTitle}</SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-2">
              {allChapters.map((c) => (
                <button
                  key={c.chapter_id}
                  onClick={() => {
                    startLoading(`/library/${storyId}/chapters/${c.chapter_id}`)
                    router.push(`/library/${storyId}/chapters/${c.chapter_id}`)
                    setIsSidebarOpen(false)
                  }}
                  className={clsx(
                    "w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors",
                    Number(chapterId) === c.chapter_id && "bg-primary text-primary-foreground"
                  )}
                >
                  {c.title}
                </button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Nội dung chính */}
      <div className="flex-1">
        {/* Cập nhật style cho thanh progress */}
        <div className="fixed top-0 left-0 w-full h-1.5 bg-muted/30 z-50">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300 ease-out shadow-lg shadow-primary/20"
            style={{ 
              width: `${readingProgress}%`,
            }}
          />
        </div>

        <div className="container max-w-2xl mx-auto px-4 py-8 select-none"
          onCopy={(e) => e.preventDefault()}
          onCut={(e) => e.preventDefault()}
          style={{ 
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            userSelect: 'none'
          }}
        >
          <Button
            variant="outline"
            onClick={() => {
              startLoading(`/library/${storyId}`)
              router.push(`/library/${storyId}`)
            }}
            className="mb-8"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách chương
          </Button>

          <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
            {chapter.title}
          </h1>

          <div 
            ref={scrollableRef}
            className="min-h-[50vh] max-h-[70vh] overflow-y-auto px-4 cursor-pointer select-none
              border-2 border-muted rounded-lg shadow-sm hover:border-primary/50 transition-all"
            onClick={showNextDialogue}
            onContextMenu={(e) => e.preventDefault()}
          >
            <div className="space-y-6 p-4">
              {visibleDialogues.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-20">
                  <Hand className="w-12 h-12 animate-pulse" />
                  <p className="mt-4 text-lg">Nhấn vào màn hình để bắt đầu đọc</p>
                </div>
              ) : (
                <AnimatePresence>
                  {chapter.dialogues.map((dialogue) => (
                    visibleDialogues.includes(dialogue.dialogue_id) && (
                      <motion.div 
                        key={dialogue.dialogue_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {dialogue.type === 'aside' ? (
                          <div className="my-4 px-8">
                            <div className="text-center text-muted-foreground italic">
                              {dialogue.content}
                            </div>
                          </div>
                        ) : (
                          <div className="mb-4">
                            {dialogue.character?.role === 'main' ? (
                              <div className="flex flex-col items-end">
                                <div className="flex items-center mb-1">
                                  <span className="mr-2 font-semibold">{dialogue.character?.name}</span>
                                  <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex-shrink-0">
                                    {dialogue.character?.avatar_image ? (
                                      <Image
                                        src={dialogue.character.avatar_image}
                                        alt={dialogue.character.name}
                                        width={32}
                                        height={32}
                                        className="object-cover"
                                        draggable="false"
                                      />
                                    ) : (
                                      <User className="w-5 h-5 m-1.5" />
                                    )}
                                  </div>
                                </div>
                                <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-[75%] break-words whitespace-pre-wrap">
                                  {dialogue.content}
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-start">
                                <div className="flex items-center mb-1">
                                  <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex-shrink-0 mr-2">
                                    {dialogue.character?.avatar_image ? (
                                      <Image
                                        src={dialogue.character.avatar_image}
                                        alt={dialogue.character.name}
                                        width={32}
                                        height={32}
                                        className="object-cover"
                                        draggable="false"
                                      />
                                    ) : (
                                      <User className="w-5 h-5 m-1.5" />
                                    )}
                                  </div>
                                  <span className="font-semibold">{dialogue.character?.name}</span>
                                </div>
                                <div className="bg-muted p-3 rounded-lg max-w-[75%] break-words whitespace-pre-wrap">
                                  {dialogue.content}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    )
                  ))}
                </AnimatePresence>
              )}
              <div ref={bottomRef} />
              {isChapterCompleted && (
                <div className="text-center py-8 text-muted-foreground">
                  --- Kết thúc chương ---
                </div>
              )}
            </div>
          </div>

          {/* Thay thế phần điều hướng chương cũ */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-background/80 backdrop-blur-sm p-2 rounded-full border shadow-lg">
            {prevChapter && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  startLoading(`/library/${storyId}/chapters/${prevChapter.chapter_id}`)
                  router.push(`/library/${storyId}/chapters/${prevChapter.chapter_id}`)
                }}
                className="rounded-full"
                title={`Chương trước: ${prevChapter.title}`}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}

            <div className="px-4 font-medium">
              {visibleDialogues.length}/{chapter.dialogues.length}
            </div>

            {nextChapter && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  startLoading(`/library/${storyId}/chapters/${nextChapter.chapter_id}`)
                  router.push(`/library/${storyId}/chapters/${nextChapter.chapter_id}`)
                }}
                className="rounded-full"
                title={`Chương sau: ${nextChapter.title}`}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 