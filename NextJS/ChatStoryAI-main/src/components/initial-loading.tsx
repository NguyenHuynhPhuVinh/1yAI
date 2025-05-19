/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import gsap from 'gsap'
import { getRandomQuotes } from '@/data/quotes'

export function InitialLoading() {
  const router = useRouter()
  const { data: session } = useSession()
  const messageRefs = useRef<(HTMLDivElement | null)[]>([])
  const [isFirstVisit, setIsFirstVisit] = useState(() => {
    // Kiểm tra sessionStorage ngay khi khởi tạo state
    return !sessionStorage.getItem('hasVisited')
  })
  const [progress, setProgress] = useState(0)
  const [quotes] = useState(() => getRandomQuotes(3))

  useEffect(() => {
    if (!isFirstVisit) return

    // Lưu vị trí cuộn hiện tại
    const scrollPosition = window.scrollY
    
    // Khóa cuộn và giữ nguyên vị trí
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollPosition}px`
    document.body.style.width = '100%'

    // Animation cho các tin nhắn
    messageRefs.current.forEach((msg, index) => {
      gsap.fromTo(msg,
        {
          x: index % 2 === 0 ? -50 : 50,
          opacity: 0
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          delay: index * 0.3,
          ease: "power2.out"
        }
      )
    })

    const preloadAPIs = async () => {
      try {
        // Danh sách các API cần preload
        const apis = [
          '/api/auth/login',
          '/api/auth/register', 
          '/api/auth/forgot-password',
          '/api/auth/reset-password',
          '/api/auth/verify-reset-code',
          '/api/stories',
          '/api/stories/create',
          '/api/library',
          '/api/library/new',
          '/api/library/popular',
          '/api/library/search',
          '/api/user/update-avatar',
          '/api/user/update-username',
          '/api/user/update-password',
          '/api/user/update-badge',
          '/api/account/bookmarks',
          '/api/account/view-history',
          '/api/ai/gemini',
          '/api/together/key',
          '/api/notifications',
          '/api/vnpay',
          '/api/categories',
          '/api/subscribe',
          '/api/revalidate',
          '/api/stories/featured'
        ]

        // Tính progress cho mỗi API
        const progressPerAPI = 100 / apis.length

        // Load từng API
        for (const api of apis) {
          await fetch(api)
          setProgress(prev => prev + progressPerAPI)
        }

        // Đánh dấu đã visit
        sessionStorage.setItem('hasVisited', 'true')
        
        // Animation fade out
        gsap.to('.initial-loading', {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            setIsFirstVisit(false)
            // Khôi phục cuộn
            document.body.style.position = ''
            document.body.style.top = ''
            document.body.style.width = ''
            window.scrollTo(0, scrollPosition)
          }
        })

      } catch (error) {
        console.error('Lỗi khi preload:', error)
        setIsFirstVisit(false)
      }
    }

    preloadAPIs()

    // Cleanup function
    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      window.scrollTo(0, scrollPosition)
    }
  }, [])

  if (!isFirstVisit) return null

  return (
    <div className="fixed inset-0 bg-background z-[10001] initial-loading overflow-hidden min-h-screen w-full">
      <div className="h-full flex flex-col items-center justify-center overflow-hidden">
        <div className="w-full max-w-md space-y-8 p-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">ChatStoryAI</h1>
            <p className="text-sm text-muted-foreground">
              Đang tải dữ liệu ban đầu...
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-muted rounded-full h-2 mb-8">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Quotes với animation */}
          <div className="space-y-4">
            {quotes.map((quote, index) => (
              <div 
                key={quote.id}
                ref={(el) => { messageRefs.current[index] = el }}
                className={`flex items-start ${index === 2 ? 'justify-end' : ''} gap-2 opacity-0`}
              >
                {index !== 2 && (
                  <div className={`w-8 h-8 rounded-full ${quote.bgColor} flex items-center justify-center text-white font-medium`}>
                    {quote.initial}
                  </div>
                )}
                <div className={`${index === 2 ? 'bg-primary/10' : 'bg-muted'} p-3 rounded-2xl ${index === 2 ? 'rounded-tr-none' : 'rounded-tl-none'} max-w-[80%]`}>
                  <p className="text-sm">
                    &quot;{quote.text}&quot;
                  </p>
                </div>
                {index === 2 && (
                  <div className={`w-8 h-8 rounded-full ${quote.bgColor} flex items-center justify-center text-white font-medium`}>
                    {quote.initial}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 