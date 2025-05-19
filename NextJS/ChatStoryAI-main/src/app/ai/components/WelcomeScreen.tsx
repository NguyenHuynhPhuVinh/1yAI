import { MessageCircle, Lock, Sparkles, Wand2, Brain, BookOpen } from "lucide-react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useLoading } from "@/providers/loading-provider"

export function WelcomeScreen() {
  const { data: session } = useSession()
  const isSupporter = session?.user?.hasBadge
  const router = useRouter()
  const { startLoading } = useLoading()

  return (
    <div className="h-full flex flex-col items-center justify-center px-4 py-8 sm:py-12 text-center">
      <div className="relative mb-4 sm:mb-6">
        <MessageCircle className="h-12 w-12 sm:h-16 sm:w-16 text-primary" />
        <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
      </div>

      <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
        Trợ Lý Sáng Tạo Truyện AI
      </h1>
      
      {isSupporter ? (
        <div className="space-y-4 sm:space-y-6 max-w-2xl">
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Trợ lý AI giúp bạn phát triển ý tưởng và sáng tạo nội dung truyện.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto">
            <div className="p-3 sm:p-4 rounded-lg border bg-card text-card-foreground shadow-sm text-center">
              <div className="flex justify-center">
                <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-primary mb-2" />
              </div>
              <h3 className="font-semibold mb-1">Tạo Ý Tưởng</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Phát triển ý tưởng độc đáo</p>
            </div>
            <div className="p-3 sm:p-4 rounded-lg border bg-card text-card-foreground shadow-sm text-center">
              <div className="flex justify-center">
                <Wand2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary mb-2" />
              </div>
              <h3 className="font-semibold mb-1">Phát Triển Nhân Vật</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Tạo nhân vật sống động</p>
            </div>
            <div className="p-3 sm:p-4 rounded-lg border bg-card text-card-foreground shadow-sm text-center">
              <div className="flex justify-center">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary mb-2" />
              </div>
              <h3 className="font-semibold mb-1">Quản Lý Chương</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Tạo và sửa nội dung</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6 max-w-2xl">
          <div className="p-4 sm:p-6 rounded-xl border">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Tính năng cho người ủng hộ
            </h2>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span>Tạo truyện với AI thông minh</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                <span>Truy cập sớm tính năng mới</span>
              </li>
              <li className="flex items-center gap-2">
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                <span>Công cụ AI hỗ trợ sáng tạo</span>
              </li>
            </ul>
            <Button 
              variant="default" 
              size="lg"
              className="w-full"
              onClick={() => {
                startLoading('/products')
                router.push('/products')
              }}
            >
              <Lock className="w-4 h-4 mr-2" />
              Trở thành người ủng hộ
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 