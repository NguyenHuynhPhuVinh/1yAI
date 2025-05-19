import { Brain, BookOpen, Wand2, Users2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ServicesPage() {
  const services = [
    {
      icon: <Brain className="w-12 h-12 text-primary" />,
      title: "AI Story Generation",
      description: "Tạo ra những câu chuyện độc đáo với sự hỗ trợ của AI thông minh."
    },
    {
      icon: <BookOpen className="w-12 h-12 text-primary" />,
      title: "Thư Viện Truyện",
      description: "Truy cập vào kho tàng truyện đa dạng với nhiều thể loại khác nhau."
    },
    {
      icon: <Wand2 className="w-12 h-12 text-primary" />,
      title: "Công Cụ Sáng Tạo",
      description: "Các công cụ hỗ trợ phát triển cốt truyện và nhân vật."
    },
    {
      icon: <Users2 className="w-12 h-12 text-primary" />,
      title: "Cộng Đồng Sáng Tác",
      description: "Tham gia cộng đồng, chia sẻ và nhận phản hồi về tác phẩm."
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold tracking-tight">Dịch Vụ Của Chúng Tôi</h1>
            <p className="text-lg text-muted-foreground">
              Khám phá các dịch vụ độc đáo giúp bạn sáng tạo nội dung
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="mb-4">{service.icon}</div>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
} 