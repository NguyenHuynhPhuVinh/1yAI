/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import * as React from "react"
import { MessageCircle, X, Send, Trash2, Plus } from "lucide-react"
import clsx from "clsx"
import { usePathname } from "next/navigation"
import { chatWithAssistant, Message } from "@/lib/chat-bot"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import rehypePrism from 'rehype-prism-plus'
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "sonner"
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

// Import CSS cần thiết
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github-dark.css'

interface ChatBotProps {
  className?: string
}

interface Character {
  character_id: number;
  name: string;
  description: string;
  role: string;
  gender: string;
  birthday: string;
  height: string;
  weight: string;
  personality: string;
  appearance: string;
  background: string;
}

interface CharacterContext {
  basic: boolean; // Thông tin cơ bản (tên, vai trò)
  appearance: boolean; // Ngoại hình
  background: boolean; // Tiểu sử
  personality: boolean; // Tính cách
  physical: boolean; // Thông tin vật lý (chiều cao, cân nặng)
}

interface Outline {
  outline_id: number;
  title: string;
  description: string;
  order_number: number;
}

interface OutlineContext {
  title: boolean;
  description: boolean;
}

interface Dialogue {
  dialogue_id: number;
  chapter_id: number;
  character_id: number | null;
  content: string;
  type: 'dialogue' | 'aside';
  created_at: string;
  order_number: number;
}

interface SelectedContext {
  title: boolean;
  description: boolean;
  category: boolean;
  tags: boolean;
  characters: { [key: number]: CharacterContext };
  outlines: { [key: number]: OutlineContext };
  dialogues: boolean;
  [key: string]: any; // Cho phép dynamic keys cho chapters
}

interface Chapter {
  chapter_id: number;
  title: string;
  summary: string;
  status: string;
}

interface ChapterSelection {
  title: boolean;
  summary: boolean;
  dialogues: boolean;
  data: {
    title: string;
    summary: string;
    dialogues?: {
      type: 'dialogue' | 'aside';
      content: string;
      character_name?: string;
    }[];
  };
}

export const ChatBot: React.FC<ChatBotProps> = ({ className }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<Message[]>([])
  const [inputMessage, setInputMessage] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [showContextMenu, setShowContextMenu] = React.useState(false)
  const [contextData, setContextData] = React.useState<{
    chapterTitle?: string;
    description?: string;
    category?: string;
    tags?: string[];
    title?: string;
    characters?: Character[];
    outlines?: Outline[];
    dialogues?: Dialogue[];
    chapterSummary?: string;
  }>({})
  
  const [selectedContext, setSelectedContext] = React.useState<SelectedContext>({
    title: false,
    description: false,
    category: false,
    tags: false,
    characters: {},
    outlines: {},
    dialogues: false
  })
  
  const pathname = usePathname()
  const storyId = pathname?.split('/stories/')[1]?.split('/')[0]
  const chapterId = pathname?.split('/chapters/')[1]?.split('/')[0]
  const chatRef = React.useRef<HTMLDivElement>(null)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const [characters, setCharacters] = React.useState<Character[]>([])
  const [outlines, setOutlines] = React.useState<Outline[]>([])
  const [dialogues, setDialogues] = React.useState<Dialogue[]>([])
  const [chapters, setChapters] = React.useState<Chapter[]>([])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Kiểm tra xem click có phải từ popover hay không
      const target = event.target as HTMLElement;
      if (target.closest('[role="dialog"]')) {
        return; // Nếu click từ popover, không đóng chat
      }
      
      if (chatRef.current && !chatRef.current.contains(target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  React.useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory')
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    }
  }, [])

  React.useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages))
    }
  }, [messages])

  React.useEffect(() => {
    const fetchAllData = async () => {
      if (!storyId) return

      try {
        // Fetch chapters first
        const chaptersRes = await fetch(`/api/stories/${storyId}/chapters`)
        if (!chaptersRes.ok) throw new Error('Không thể tải danh sách chương')
        const chaptersData = await chaptersRes.json()
        const publishedChapters = chaptersData.chapters.filter(
          (chapter: Chapter) => chapter.status === 'published'
        )
        setChapters(publishedChapters)

        // Fetch story data
        const storyRes = await fetch(`/api/stories/${storyId}`)
        if (!storyRes.ok) throw new Error('Không thể tải dữ liệu truyện')
        const storyData = await storyRes.json()
        
        // Fetch characters list first
        const charactersListRes = await fetch(`/api/stories/${storyId}/characters`)
        if (!charactersListRes.ok) throw new Error('Không thể tải danh sách nhân vật')
        const charactersListData = await charactersListRes.json()
        
        // Then fetch detailed info for each character
        const charactersDetailPromises = charactersListData.characters.map(async (char: any) => {
          const detailRes = await fetch(`/api/stories/${storyId}/characters/${char.character_id}/get`)
          if (!detailRes.ok) throw new Error(`Không thể tải thông tin chi tiết nhân vật ${char.name}`)
          const detailData = await detailRes.json()
          return detailData.character
        })
        
        const charactersData = await Promise.all(charactersDetailPromises)
        
        // Fetch outlines
        const outlinesRes = await fetch(`/api/stories/${storyId}/outlines`)
        if (!outlinesRes.ok) throw new Error('Không thể tải dữ liệu đại cương')
        const outlinesData = await outlinesRes.json()

        // Fetch dialogues nếu có chapterId
        if (chapterId) {
          const dialoguesRes = await fetch(`/api/stories/${storyId}/chapters/${chapterId}/dialogues`)
          if (!dialoguesRes.ok) throw new Error('Không thể tải dữ liệu hội thoại')
          const dialoguesData = await dialoguesRes.json()
          // Thêm chapter_id vào mỗi dialogue
          const dialoguesWithChapter = dialoguesData.dialogues.map((d: any) => ({
            ...d,
            chapter_id: Number(chapterId)
          }))
          setDialogues(dialoguesWithChapter)
        }

        // Cập nhật contextData
        const newContextData: any = {
          title: storyData.story.title,
          description: storyData.story.description,
          category: storyData.story.main_category,
          tags: storyData.story.tags,
          characters: charactersData,
          outlines: outlinesData.outlines,
          dialogues: dialogues.map(d => ({
            ...d,
            chapter_id: Number(chapterId)
          }))
        }

        if (chapterId) {
          const chapterRes = await fetch(`/api/stories/${storyId}/chapters/${chapterId}`)
          if (chapterRes.ok) {
            const chapterData = await chapterRes.json()
            newContextData.chapterTitle = chapterData.chapter.title
            newContextData.chapterSummary = chapterData.chapter.summary
          }
        }

        setContextData(newContextData)
        setCharacters(charactersData)
        setOutlines(outlinesData.outlines)
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error)
        toast.error('Không thể tải dữ liệu ngữ cảnh')
      }
    }

    fetchAllData()
  }, [storyId, chapterId])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const newMessage: Message = {
      role: "user",
      content: inputMessage.trim()
    }

    setMessages(prev => [...prev, newMessage])
    setInputMessage("")
    setIsLoading(true)

    const selectedChapters: { [key: number]: ChapterSelection } = {}
    chapters.forEach(chapter => {
      const chapterId = chapter.chapter_id
      if (selectedContext[`chapter_${chapterId}_title`]) {
        
        // Lọc dialogues cho chapter hiện tại
        const chapterDialogues = dialogues.filter(dialogue => {
          // Chuyển đổi string sang number nếu cần
          const dialogueChapterId = Number(dialogue.chapter_id);
          return dialogueChapterId === chapterId;
        });

        selectedChapters[chapterId] = {
          title: true,
          summary: selectedContext[`chapter_${chapterId}_summary`] || false,
          dialogues: selectedContext[`chapter_${chapterId}_dialogues`] || false,
          data: {
            title: chapter.title,
            summary: chapter.summary,
            dialogues: chapterDialogues // Bỏ điều kiện check selectedContext
          }
        }
      }
    })

    const selectedContextData = {
      title: selectedContext.title ? contextData.title : undefined,
      description: selectedContext.description ? contextData.description : undefined,
      category: selectedContext.category ? contextData.category : undefined,
      tags: selectedContext.tags ? contextData.tags : undefined,
      characters: selectedContext.characters,
      outlines: selectedContext.outlines,
      chapters: selectedChapters,
      characterData: characters,
      outlineData: outlines,
      // Debug logs
      debug: {
        dialoguesLength: dialogues.length,
        selectedChapters: JSON.stringify(selectedChapters, null, 2)
      }
    }

    try {
      const streamResponse = await chatWithAssistant(
        inputMessage,
        messages.map(m => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }]
        })),
        true,
        selectedContextData
      ) as ReadableStream;

      // Tạo message trống cho assistant
      setMessages(prev => [...prev, {
        role: "assistant",
        content: ""
      }]);

      const reader = streamResponse.getReader();
      let accumulatedResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunkText = value.text();
        accumulatedResponse += chunkText;
        
        // Cập nhật tin nhắn cuối cùng với nội dung mới
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = accumulatedResponse;
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
    localStorage.removeItem('chatHistory')
  }

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  if (!pathname?.includes("/stories")) {
    return null
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 md:bottom-8 md:right-8 bottom-0 right-0" ref={chatRef}>
      <div
        className={clsx(
          "bg-background rounded-lg shadow-lg",
          "w-full h-[100dvh] md:w-[500px] md:h-[600px]",
          "transition-all duration-300 ease-in-out",
          "fixed md:absolute bottom-0 right-0",
          "flex flex-col",
          isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none",
          "md:rounded-lg rounded-none",
          isOpen ? "overflow-hidden" : "",
        )}
      >
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-primary text-primary-foreground md:rounded-t-lg rounded-none sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <h3 className="font-semibold text-lg">Trợ lý Truyện</h3>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={clearChat}
              className="hover:bg-primary-foreground/10 p-1 rounded-full transition-colors"
              aria-label="Xóa lịch sử chat"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:bg-primary-foreground/10 p-1 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto overscroll-contain">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Chào mừng bạn đến với Trợ lý Truyện! Hãy đặt câu hỏi để bắt đầu.
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={clsx(
                  "mb-4 max-w-[80%] rounded-lg p-3",
                  message.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted/50 prose prose-stone dark:prose-invert max-w-none"
                )}
              >
                {message.role === "user" ? (
                  message.content
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex, rehypeHighlight, rehypePrism]}
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-4 mb-2" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-3 mb-2" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-md font-bold mt-2 mb-1" {...props} />,
                      p: ({node, ...props}) => <p className="mb-2" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                      li: ({node, ...props}) => <li className="mb-1" {...props} />,
                      pre: ({node, ...props}) => <pre className="bg-transparent p-0" {...props} />,
                      blockquote: ({node, ...props}) => (
                        <blockquote className="border-l-4 border-gray-300 pl-4 my-2 italic" {...props} />
                      ),
                      table: ({node, ...props}) => (
                        <div className="overflow-x-auto my-2">
                          <table className="min-w-full border-collapse border border-gray-300" {...props} />
                        </div>
                      ),
                      th: ({node, ...props}) => (
                        <th className="border border-gray-300 px-4 py-2 bg-gray-100" {...props} />
                      ),
                      td: ({node, ...props}) => (
                        <td className="border border-gray-300 px-4 py-2" {...props} />
                      ),
                      a: ({node, ...props}) => (
                        <a className="text-blue-500 hover:text-blue-600 underline" {...props} />
                      ),
                      img: ({node, ...props}) => (
                        <img className="max-w-full h-auto rounded my-2" {...props} />
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="bg-muted/50 rounded-lg p-3 max-w-[80%] animate-pulse">
              Đang trả lời...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-background/50 sticky bottom-0 z-10">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <textarea
                rows={1}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="w-full px-4 py-3 border border-border rounded-2xl bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none min-h-[50px] max-h-[150px]"
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 h-[50px] w-[50px]"
                  onClick={(e) => {
                    e.stopPropagation(); // Ngăn sự kiện lan truyền
                  }}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-[300px] max-h-[400px] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-4 p-2">
                  <h3 className="font-semibold text-center border-b pb-2">Ngữ cảnh cho AI</h3>
                  
                  {/* Loading state */}
                  {!contextData.title && !characters.length && !outlines.length ? (
                    <div className="space-y-2">
                      <Skeleton height={24} />
                      <Skeleton count={3} height={32} />
                      <Skeleton height={24} />
                      <Skeleton count={2} height={32} />
                    </div>
                  ) : (
                    <>
                      {/* Existing content */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Thông tin truyện</h4>
                        {contextData.title && (
                          <Button
                            variant="ghost"
                            className="w-full justify-start font-normal"
                            onClick={() => setSelectedContext(prev => ({ ...prev, title: !prev.title }))}
                          >
                            <input
                              type="checkbox"
                              checked={selectedContext.title}
                              className="mr-2"
                              onChange={() => {}}
                            />
                            Tên truyện
                          </Button>
                        )}
                        {contextData.description && (
                          <Button
                            variant="ghost"
                            className="w-full justify-start font-normal"
                            onClick={() => setSelectedContext(prev => ({ ...prev, description: !prev.description }))}
                          >
                            <input
                              type="checkbox"
                              checked={selectedContext.description}
                              className="mr-2"
                              onChange={() => {}}
                            />
                            Mô tả truyện
                          </Button>
                        )}
                        {contextData.category && (
                          <Button
                            variant="ghost"
                            className="w-full justify-start font-normal"
                            onClick={() => setSelectedContext(prev => ({ ...prev, category: !prev.category }))}
                          >
                            <input
                              type="checkbox"
                              checked={selectedContext.category}
                              className="mr-2"
                              onChange={() => {}}
                            />
                            Thể loại
                          </Button>
                        )}
                        {contextData.tags && (
                          <Button
                            variant="ghost"
                            className="w-full justify-start font-normal"
                            onClick={() => setSelectedContext(prev => ({ ...prev, tags: !prev.tags }))}
                          >
                            <input
                              type="checkbox"
                              checked={selectedContext.tags}
                              className="mr-2"
                              onChange={() => {}}
                            />
                            Tags
                          </Button>
                        )}
                      </div>

                      {chapters.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium">Danh sách chương</h4>
                          {chapters.map((chapter) => (
                            <div key={chapter.chapter_id} className="pl-2 space-y-1">
                              <Button
                                variant="ghost"
                                className="w-full justify-start font-normal text-sm"
                                onClick={() => {
                                  setSelectedContext(prev => ({
                                    ...prev,
                                    [`chapter_${chapter.chapter_id}_title`]: !prev[`chapter_${chapter.chapter_id}_title`]
                                  }))
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedContext[`chapter_${chapter.chapter_id}_title`] || false}
                                  className="mr-2"
                                  onChange={() => {}}
                                />
                                {chapter.title}
                              </Button>

                              {selectedContext[`chapter_${chapter.chapter_id}_title`] && (
                                <div className="pl-4 space-y-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-xs"
                                    onClick={() => {
                                      setSelectedContext(prev => ({
                                        ...prev,
                                        [`chapter_${chapter.chapter_id}_summary`]: !prev[`chapter_${chapter.chapter_id}_summary`]
                                      }))
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedContext[`chapter_${chapter.chapter_id}_summary`] || false}
                                      className="mr-2"
                                      onChange={() => {}}
                                    />
                                    Tóm tắt chương
                                  </Button>

                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-xs"
                                    onClick={() => {
                                      setSelectedContext(prev => ({
                                        ...prev,
                                        [`chapter_${chapter.chapter_id}_dialogues`]: !prev[`chapter_${chapter.chapter_id}_dialogues`]
                                      }))
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedContext[`chapter_${chapter.chapter_id}_dialogues`] || false}
                                      className="mr-2"
                                      onChange={() => {}}
                                    />
                                    Hội thoại trong chương
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {characters.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium">Nhân vật</h4>
                          {characters.map((char) => (
                            <div key={char.character_id} className="pl-2 space-y-1">
                              <Button
                                variant="ghost"
                                className="w-full justify-start font-normal text-sm"
                                onClick={() => {
                                  const currentCharContext = selectedContext.characters[char.character_id];
                                  const newValue = !currentCharContext?.basic;
                                  setSelectedContext(prev => ({
                                    ...prev,
                                    characters: {
                                      ...prev.characters,
                                      [char.character_id]: {
                                        basic: newValue,
                                        appearance: newValue,
                                        background: newValue,
                                        personality: newValue,
                                        physical: newValue
                                      }
                                    }
                                  }))
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedContext.characters[char.character_id]?.basic || false}
                                  className="mr-2"
                                  onChange={() => {}}
                                />
                                {char.name}
                              </Button>
                              
                              {selectedContext.characters[char.character_id]?.basic && (
                                <div className="pl-4 space-y-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-xs"
                                    onClick={() => {
                                      setSelectedContext(prev => ({
                                        ...prev,
                                        characters: {
                                          ...prev.characters,
                                          [char.character_id]: {
                                            ...prev.characters[char.character_id],
                                            basic: !prev.characters[char.character_id].basic
                                          }
                                        }
                                      }))
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedContext.characters[char.character_id]?.basic || false}
                                      className="mr-2"
                                      onChange={() => {}}
                                    />
                                    Thông tin cơ bản
                                  </Button>

                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-xs"
                                    onClick={() => {
                                      setSelectedContext(prev => ({
                                        ...prev,
                                        characters: {
                                          ...prev.characters,
                                          [char.character_id]: {
                                            ...prev.characters[char.character_id],
                                            physical: !prev.characters[char.character_id].physical
                                          }
                                        }
                                      }))
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedContext.characters[char.character_id]?.physical || false}
                                      className="mr-2"
                                      onChange={() => {}}
                                    />
                                    Thông tin vật lý
                                  </Button>

                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-xs"
                                    onClick={() => {
                                      setSelectedContext(prev => ({
                                        ...prev,
                                        characters: {
                                          ...prev.characters,
                                          [char.character_id]: {
                                            ...prev.characters[char.character_id],
                                            appearance: !prev.characters[char.character_id].appearance
                                          }
                                        }
                                      }))
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedContext.characters[char.character_id]?.appearance || false}
                                      className="mr-2"
                                      onChange={() => {}}
                                    />
                                    Ngoại hình
                                  </Button>

                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-xs"
                                    onClick={() => {
                                      setSelectedContext(prev => ({
                                        ...prev,
                                        characters: {
                                          ...prev.characters,
                                          [char.character_id]: {
                                            ...prev.characters[char.character_id],
                                            personality: !prev.characters[char.character_id].personality
                                          }
                                        }
                                      }))
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedContext.characters[char.character_id]?.personality || false}
                                      className="mr-2"
                                      onChange={() => {}}
                                    />
                                    Tính cách
                                  </Button>

                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-xs"
                                    onClick={() => {
                                      setSelectedContext(prev => ({
                                        ...prev,
                                        characters: {
                                          ...prev.characters,
                                          [char.character_id]: {
                                            ...prev.characters[char.character_id],
                                            background: !prev.characters[char.character_id].background
                                          }
                                        }
                                      }))
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedContext.characters[char.character_id]?.background || false}
                                      className="mr-2"
                                      onChange={() => {}}
                                    />
                                    Tiểu sử
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {outlines.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium">Đại cương</h4>
                          {outlines.map((outline) => (
                            <div key={outline.outline_id} className="pl-2 space-y-1">
                              <Button
                                variant="ghost"
                                className="w-full justify-start font-normal text-sm"
                                onClick={() => {
                                  setSelectedContext(prev => ({
                                    ...prev,
                                    outlines: {
                                      ...prev.outlines,
                                      [outline.outline_id]: {
                                        title: !prev.outlines[outline.outline_id]?.title,
                                        description: !prev.outlines[outline.outline_id]?.description
                                      }
                                    }
                                  }))
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedContext.outlines[outline.outline_id]?.title || false}
                                  className="mr-2"
                                  onChange={() => {}}
                                />
                                {outline.title}
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </PopoverContent>
            </Popover>
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className={clsx(
                "p-3 rounded-xl flex-shrink-0 h-[50px] w-[50px] flex items-center justify-center",
                "bg-primary text-primary-foreground",
                "hover:bg-primary/90 transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              aria-label="Gửi tin nhắn"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={clsx(
          "p-4 rounded-full",
          "bg-primary text-primary-foreground",
          "shadow-lg",
          "hover:bg-primary/90",
          "transition-all duration-300 ease-in-out",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          "flex items-center gap-2",
          "md:static fixed bottom-4 right-4",
          isOpen ? "hidden" : "",
          className
        )}
        aria-label="Mở trợ lý truyện"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="font-medium">Trợ lý</span>
      </button>
    </div>
  )
} 