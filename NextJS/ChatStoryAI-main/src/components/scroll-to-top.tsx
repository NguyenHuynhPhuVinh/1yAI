"use client"

import * as React from "react"
import { ArrowUp } from "lucide-react"
import clsx from "clsx"
import { usePathname } from "next/navigation"

interface ScrollToTopProps {
  showBelow?: number // Hiển thị nút khi scroll xuống bao nhiêu pixel
  className?: string
}

export const ScrollToTop: React.FC<ScrollToTopProps> = ({ 
  showBelow = 300,
  className 
}) => {
  const [show, setShow] = React.useState(false)
  const pathname = usePathname()
  
  // Kiểm tra xem có đang ở trang stories hay không
  const isStoriesPage = pathname?.includes("/stories")

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > showBelow) {
        if (!show) setShow(true)
      } else {
        if (show) setShow(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [show, showBelow])

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      className={clsx(
        "fixed right-8 p-3 rounded-full",
        "bg-primary hover:bg-primary/90",
        "text-primary-foreground",
        "shadow-lg",
        "transition-all duration-300 ease-in-out",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        show ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0",
        "z-50",
        // Điều chỉnh vị trí dựa trên trang hiện tại
        isStoriesPage ? "bottom-28" : "bottom-8",
        className
      )}
      onClick={handleClick}
      aria-label="Cuộn lên đầu trang"
    >
      <ArrowUp className="w-6 h-6" />
    </button>
  )
} 