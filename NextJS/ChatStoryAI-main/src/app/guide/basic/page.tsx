"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Wand2, Users2, Brain, MessageSquare, Settings2 } from "lucide-react"

export default function BasicGuidePage() {
  const guides = [
    {
      icon: <BookOpen className="w-12 h-12 text-primary" />,
      title: "Đọc Truyện",
      description: "Khám phá thư viện truyện đa dạng, chọn truyện yêu thích và bắt đầu đọc. Bạn có thể theo dõi tiến độ đọc và đánh dấu truyện yêu thích."
    },
    {
      icon: <Wand2 className="w-12 h-12 text-primary" />,
      title: "Tạo Truyện",
      description: "Tạo truyện mới, thêm ảnh bìa, mô tả và chọn thể loại. Sau đó thêm các chương và bắt đầu viết nội dung với sự hỗ trợ của AI."
    },
    {
      icon: <MessageSquare className="w-12 h-12 text-primary" />,
      title: "Tương Tác AI",
      description: "Trò chuyện với AI để phát triển cốt truyện, nhân vật và tạo ra những đoạn hội thoại thú vị. AI sẽ giúp bạn sáng tạo nội dung độc đáo."
    },
    {
      icon: <Users2 className="w-12 h-12 text-primary" />,
      title: "Quản Lý Nhân Vật",
      description: "Tạo và quản lý các nhân vật trong truyện của bạn. Thiết lập tính cách, ngoại hình và vai trò của từng nhân vật."
    },
    {
      icon: <Settings2 className="w-12 h-12 text-primary" />,
      title: "Xuất Bản",
      description: "Khi hoàn thành nội dung, bạn có thể xuất bản truyện để chia sẻ với cộng đồng. Theo dõi lượt xem và tương tác của độc giả."
    },
    {
      icon: <Brain className="w-12 h-12 text-primary" />,
      title: "Mẹo Sử Dụng",
      description: "Tận dụng các tính năng như lưu bản nháp, xem trước nội dung và tùy chỉnh giao diện để có trải nghiệm tốt nhất."
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold tracking-tight">Hướng Dẫn Cơ Bản</h1>
            <p className="text-lg text-muted-foreground">
              Tìm hiểu cách sử dụng các tính năng chính của ChatStoryAI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="mb-4">{guide.icon}</div>
                  <CardTitle>{guide.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{guide.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}