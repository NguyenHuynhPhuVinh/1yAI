import { Button } from "@/components/ui/button"
import { MessageSquarePlus, Trash2, Menu, X } from "lucide-react"
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useState } from 'react'

interface ChatHistory {
  chat_id: number
  title: string
  updated_at: string
}

interface ChatSidebarProps {
  chatHistory: ChatHistory[]
  currentChatId: number | null
  onNewChat: () => void
  onSelectChat: (chatId: number) => void
  onDeleteChat: (chatId: number) => Promise<void>
  isOpen: boolean
  onToggle: () => void
  isLoading: boolean
}

export function ChatSidebar({
  chatHistory,
  currentChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  isOpen,
  onToggle,
  isLoading
}: ChatSidebarProps) {
  const [deletingChatId, setDeletingChatId] = useState<number | null>(null);

  return (
    <>
      {/* Nút menu mobile - ẩn khi sidebar mở */}
      <Button
        variant="ghost"
        size="icon"
        className={`md:hidden fixed top-20 left-4 z-50 ${isOpen ? 'hidden' : 'block'}`}
        onClick={onToggle}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar container */}
      <div className={`
        fixed md:relative
        inset-y-0 left-0 
        w-64 h-full
        transform transition-transform duration-200
        md:transform-none
        ${!isOpen ? '-translate-x-full' : 'translate-x-0'}
        bg-background
        flex flex-col
        z-40
      `}>
        {/* Thêm header với nút close */}
        <div className="md:hidden flex items-center justify-between p-4 border-b">
          <span className="font-semibold">Menu</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4">
          <Button 
            className="w-full" 
            onClick={onNewChat}
            disabled={isLoading}
          >
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            Cuộc trò chuyện mới
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chatHistory.map((chat) => (
            <div
              key={chat.chat_id}
              className={`
                group flex items-center justify-between p-4 cursor-pointer hover:bg-accent
                ${currentChatId === chat.chat_id ? 'bg-accent' : ''}
                ${deletingChatId === chat.chat_id ? 'opacity-50 pointer-events-none' : ''}
                ${isLoading ? 'pointer-events-none opacity-50' : ''}
              `}
              onClick={() => !isLoading && onSelectChat(chat.chat_id)}
            >
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">
                  {chat.title || 'Cuộc trò chuyện mới'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(chat.updated_at), {
                    addSuffix: true,
                    locale: vi
                  })}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100"
                onClick={async (e) => {
                  e.stopPropagation()
                  setDeletingChatId(chat.chat_id)
                  await onDeleteChat(chat.chat_id)
                  setDeletingChatId(null)
                }}
                disabled={deletingChatId === chat.chat_id}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay khi mở menu trên mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onToggle}
        />
      )}
    </>
  )
} 