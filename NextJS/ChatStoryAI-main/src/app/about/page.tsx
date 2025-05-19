import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Wand2, Users2, Brain } from "lucide-react"

export default function AboutPage() {
  const features = [
    {
      icon: <Brain className="w-12 h-12 text-primary" />,
      title: "Sứ mệnh",
      description: "Mang đến nền tảng sáng tạo truyện AI hàng đầu, khơi dậy tiềm năng viết lách của mọi người."
    },
    {
      icon: <BookOpen className="w-12 h-12 text-primary" />,
      title: "Tầm nhìn",
      description: "Trở thành cộng đồng sáng tác truyện AI lớn mạnh nhất Việt Nam."
    },
    {
      icon: <Wand2 className="w-12 h-12 text-primary" />,
      title: "Giá trị cốt lõi",
      description: "Sáng tạo, Đổi mới, Cộng đồng, Chất lượng."
    },
    {
      icon: <Users2 className="w-12 h-12 text-primary" />,
      title: "Đội ngũ",
      description: "Đội ngũ đam mê, giàu kinh nghiệm trong lĩnh vực AI và sáng tạo nội dung."
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold tracking-tight">Về Chúng Tôi</h1>
            <p className="text-lg text-muted-foreground">
              Tìm hiểu về ChatStoryAI và những giá trị mà chúng tôi mang lại
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
