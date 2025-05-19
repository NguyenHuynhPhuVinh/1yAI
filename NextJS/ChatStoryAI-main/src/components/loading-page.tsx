import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { getRandomQuotes } from '@/data/quotes'

export default function LoadingPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const messageRefs = useRef<(HTMLDivElement | null)[]>([])
  const typingRef = useRef<HTMLDivElement>(null)
  const [quotes] = useState(() => getRandomQuotes(3))

  useEffect(() => {
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

    // Animation cho typing indicator
    const dots = typingRef.current?.querySelectorAll('.typing-dot')
    dots?.forEach((dot, index) => {
      gsap.to(dot, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        delay: index * 0.2,
        repeat: -1,
        repeatDelay: 0.5,
        yoyo: true,
        ease: "power2.inOut"
      })
    })

    // Bỏ animation unmount
    return () => {}
  }, [])

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center"
    >
      <div className="w-full max-w-md space-y-4 p-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary mb-2">ChatStoryAI</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">đang viết ra trang kế của bạn...</p>
        </div>
        
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
            <div className={`${index === 2 ? 'bg-primary/10' : 'bg-gray-100 dark:bg-gray-800'} p-3 rounded-2xl ${index === 2 ? 'rounded-tr-none' : 'rounded-tl-none'} max-w-[80%]`}>
              <p className={`text-sm ${index !== 2 ? 'text-gray-700 dark:text-gray-200' : ''}`}>
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

        {/* Typing indicator */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center text-white font-medium">
            BF
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl rounded-tl-none">
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}