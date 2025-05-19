"use client"

import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Message } from "@/lib/gemini-chat-config"
import { chat } from "@/lib/gemini-chat"
import { WelcomeScreen } from "./components/WelcomeScreen"
import { ChatMessages } from "./components/ChatMessages"
import { ChatInput } from "./components/ChatInput"
import { ChatSidebar } from "./components/ChatSidebar"
import { toast } from "sonner"
import { 
  fetchChatHistory as fetchChatHistoryApi, 
  fetchChatMessages, 
  deleteChat, 
  saveMessage, 
  fetchCategories,
  updateMessageStatus
} from './api/chatApi'
import { useCommandHandler } from "./components/CommandHandler"
import { ChatHistory, Category, Tag, Story } from './types'

export default function AIPage() {
  const { data: session } = useSession()
  const isSupporter = session?.user?.hasBadge

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentChatId, setCurrentChatId] = useState<number | null>(null)
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [commandStatus, setCommandStatus] = useState<'loading' | 'success' | 'error' | null>(null)
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)

  const {
    handleCreateStory,
    handleCreateCharacter,
    handleCreateChapter,
    handleCreateOutline,
    handleEditStory,
    handleEditCharacter,
    handleEditChapter,
    handleEditOutline,
    handleDeleteCharacter,
    handleDeleteChapter,
    handleDeleteOutline,
    handleCreateDialogue,
    handleEditDialogue,
    handleDeleteDialogue,
    handlePublishStory,
    handleDeleteStory
  } = useCommandHandler({
    selectedStory,
    setCommandStatus,
    messages,
    setMessages,
    updateMessageStatus
  })

  useEffect(() => {
    if (!isSupporter && messages.length > 0) {
      redirect('/')
    }
  }, [isSupporter, messages])

  useEffect(() => {
    if (isSupporter) {
      fetchChatHistory()
      // Lấy danh sách thể loại và tag
      const fetchData = async () => {
        try {
          const data = await fetchCategories()
          setCategories(data.mainCategories)
          setTags(data.tags)
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu:", error)
          toast.error("Có lỗi xảy ra khi tải dữ liệu")
        }
      }
      fetchData()
    }
  }, [isSupporter])

  const fetchChatHistory = async () => {
    try {
      const history = await fetchChatHistoryApi()
      setChatHistory(history)
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử chat:", error)
    }
  }

  const handleSelectChat = async (chatId: number) => {
    try {
      const messages = await fetchChatMessages(chatId)
      setMessages(messages)
      setCurrentChatId(chatId)
    } catch (error) {
      console.error("Lỗi khi lấy tin nhắn:", error)
    }
  }

  const handleNewChat = () => {
    setMessages([])
    setCurrentChatId(null)
  }

  const handleDeleteChat = async (chatId: number) => {
    try {
      await deleteChat(chatId)
      await fetchChatHistory()
      if (currentChatId === chatId) {
        handleNewChat()
      }
      toast.success('Đã xóa cuộc trò chuyện thành công')
    } catch (error) {
      console.error("Lỗi khi xóa cuộc trò chuyện:", error)
      toast.error('Không thể xóa cuộc trò chuyện. Vui lòng thử lại sau.')
    }
  }

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleImageUpload = (file: File) => {
    const imageUrl = URL.createObjectURL(file)
    setImageFiles(prev => [...prev, file])
    setSelectedImages(prev => [...prev, imageUrl])
  }

  const handleClearImage = (index: number) => {
    URL.revokeObjectURL(selectedImages[index])
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
    setImageFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleClearAllImages = () => {
    selectedImages.forEach(url => URL.revokeObjectURL(url))
    setSelectedImages([])
    setImageFiles([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    if (!isSupporter) return
    e.preventDefault()
    if ((!input.trim() && !imageFiles.length) || isLoading) return
    const formData = new FormData()
    imageFiles.forEach(file => {
      formData.append('images', file)
    })
    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      images: selectedImages.map((url, index) => ({
        fileId: `temp-${index}`,
        url
      }))
    }

    // Hiển thị tin nhắn người dùng ngay lập tức
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    
    try {
      // Lưu tin nhắn người dùng và lấy chatId
      const imageBuffers = imageFiles.length > 0 
        ? await Promise.all(imageFiles.map(async (file) => ({
            buffer: Array.from(new Uint8Array(await file.arrayBuffer())),
            mimeType: file.type
          })))
        : undefined

      // Lưu tin nhắn người dùng và đợi kết quả
      const userMessageResponse = await saveMessage(
        currentChatId, 
        "user", 
        input.trim(), 
        imageBuffers,
        selectedStory?.story_id
      )
      const newChatId = userMessageResponse.chatId
      setCurrentChatId(newChatId)

      // Thu thập toàn bộ phản hồi trước khi lưu
      let fullResponse = ""
      const result = await chat(
        input,
        messages,
        imageFiles,
        handleCreateStory,
        handleCreateCharacter,
        handleCreateChapter,
        handleCreateOutline,
        handleEditStory,
        categories,
        tags,
        selectedStory,
        handleEditCharacter,
        handleEditChapter,
        handleEditOutline,
        handleDeleteCharacter,
        handleDeleteChapter,
        handleDeleteOutline,
        handleCreateDialogue,
        handleEditDialogue,
        handleDeleteDialogue,
        handlePublishStory,
        handleDeleteStory
      )
      const reader = result.getReader()
      const assistantMessage: Message = {
        role: "assistant",
        content: ""
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        fullResponse += value
        
        if (assistantMessage.content === "") {
          assistantMessage.content = fullResponse
          setMessages(prev => [...prev, assistantMessage])
        } else {
          setMessages(prev => {
            const newMessages = [...prev]
            newMessages[newMessages.length - 1].content = fullResponse
            return newMessages
          })
        }
      }

      // Lưu toàn bộ phản hồi sau khi đã thu thập xong
      if (fullResponse !== "") {
        const savedMessage = await saveMessage(newChatId, "assistant", fullResponse)
        setMessages(prev => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1].id = savedMessage.messageId
          return newMessages
        })
      }

      await fetchChatHistory()
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error)
      toast.error("Có lỗi xảy ra khi gửi tin nhắn")
      // Xóa tin nhắn người dùng nếu có lỗi
      setMessages(prev => prev.filter(msg => msg !== userMessage))
    } finally {
      setIsLoading(false)
      handleClearAllImages()
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
        <ChatSidebar
          chatHistory={chatHistory}
          currentChatId={currentChatId}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          isLoading={isLoading}
        />
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-hidden">
            {messages.length === 0 ? (
              <WelcomeScreen />
            ) : isSupporter ? (
              <ChatMessages
                messages={messages}
                isLoading={isLoading}
                chatContainerRef={chatContainerRef}
                messagesEndRef={messagesEndRef}
                commandStatus={commandStatus}
                categories={categories}
                tags={tags}
              />
            ) : null}
          </div>
          {isSupporter && (
            <ChatInput
              input={input}
              isLoading={isLoading}
              onInputChange={setInput}
              onSubmit={handleSubmit}
              selectedImages={selectedImages}
              onImageUpload={handleImageUpload}
              onClearImage={handleClearImage}
              onClearAllImages={handleClearAllImages}
              onStorySelect={setSelectedStory}
            />
          )}
        </div>
      </div>
  )
}
