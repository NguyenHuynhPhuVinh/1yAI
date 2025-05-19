/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { Bell, Check, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useLoading } from "@/providers/loading-provider"

export function NotificationBell() {
  const { data: session } = useSession()
  const router = useRouter()
  const { startLoading } = useLoading()
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (session?.user) {
      fetchNotifications()
    }
  }, [session])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      const data = await response.json()
      if (response.ok) {
        setNotifications(data.notifications)
        setUnreadCount(data.notifications.filter((n: any) => !n.is_read).length)
      }
    } catch (error) {
      console.error('Lỗi khi tải thông báo:', error)
    }
  }

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT'
      })
      if (response.ok) {
        setNotifications(notifications.map(n => 
          n.notification_id === notificationId ? {...n, is_read: true} : n
        ))
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Lỗi khi đánh dấu đã đọc:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PUT'
      })
      if (response.ok) {
        setNotifications(notifications.map(n => ({ ...n, is_read: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Lỗi khi đánh dấu đọc tất cả:', error)
    }
  }

  const handleClick = (notification: any) => {
    handleMarkAsRead(notification.notification_id)
    startLoading(`/library/${notification.story_id}/chapters/${notification.chapter_id}`)
    router.push(`/library/${notification.story_id}/chapters/${notification.chapter_id}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {notifications.length > 0 && (
          <div className="flex justify-end p-2 border-b">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              title="Đánh dấu đã đọc tất cả"
              className="flex items-center gap-2"
            >
              <span className="text-sm">Đánh dấu đọc tất cả</span>
              <CheckCheck className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              Không có thông báo mới
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.notification_id}
                className={`py-2 px-4 cursor-pointer ${!notification.is_read ? 'bg-muted/50' : ''}`}
              >
                <div 
                  className="flex flex-col gap-1 flex-grow"
                  onClick={() => handleClick(notification)}
                >
                  <span className="font-medium">{notification.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {notification.message}
                  </span>
                </div>
                {!notification.is_read && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    title="Đánh dấu đã đọc"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleMarkAsRead(notification.notification_id)
                    }}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 