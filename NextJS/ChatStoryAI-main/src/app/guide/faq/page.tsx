"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQPage() {
  const faqs = [
    {
      question: "ChatStoryAI là gì?",
      answer: "ChatStoryAI là nền tảng sáng tạo truyện với sự hỗ trợ của AI, cho phép người dùng tạo và chia sẻ những câu chuyện độc đáo. Nền tảng cung cấp các công cụ để viết, quản lý nhân vật và phát triển cốt truyện."
    },
    {
      question: "Làm thế nào để bắt đầu viết truyện?",
      answer: "Để bắt đầu viết truyện, bạn cần đăng nhập vào tài khoản, sau đó chọn 'Tạo truyện' từ menu. Điền các thông tin cơ bản như tiêu đề, mô tả, thể loại và tải lên ảnh bìa. Sau đó bạn có thể bắt đầu thêm các chương và viết nội dung."
    },
    {
      question: "AI hỗ trợ viết truyện như thế nào?",
      answer: "AI sẽ giúp bạn phát triển cốt truyện, tạo đoạn hội thoại và xây dựng nhân vật thông qua tương tác trò chuyện. Bạn có thể đặt câu hỏi, yêu cầu gợi ý và nhận phản hồi từ AI để cải thiện nội dung truyện."
    },
    {
      question: "Có thể sử dụng ChatStoryAI miễn phí không?",
      answer: "Có, ChatStoryAI cung cấp gói miễn phí với đầy đủ tính năng cơ bản. Ngoài ra còn có gói hỗ trợ tự nguyện để ủng hộ dự án và nhận thêm một số đặc quyền như huy hiệu người ủng hộ."
    },
    {
      question: "Làm sao để xuất bản truyện?",
      answer: "Sau khi hoàn thành nội dung các chương, bạn có thể chọn trạng thái 'Xuất bản' cho từng chương. Truyện đã xuất bản sẽ hiển thị trong thư viện và có thể được đọc bởi các thành viên khác."
    },
    {
      question: "Tôi có thể chỉnh sửa truyện sau khi xuất bản không?",
      answer: "Có, bạn vẫn có thể chỉnh sửa nội dung truyện sau khi xuất bản. Tuy nhiên, nên cân nhắc kỹ trước khi thay đổi nội dung đã xuất bản để đảm bảo trải nghiệm đọc của người dùng."
    },
    {
      question: "Gói hỗ trợ có những đặc quyền gì?",
      answer: "Gói hỗ trợ cung cấp các đặc quyền như: truy cập sớm các tính năng mới, chế độ tạo truyện bằng trò chuyện AI, huy hiệu người ủng hộ đặc biệt, và được ghi nhận trong trang cảm ơn. Ngoài ra còn góp phần duy trì và phát triển dự án."
    },
    {
      question: "Chế độ tạo truyện bằng trò chuyện AI là gì?",
      answer: "Đây là tính năng độc quyền cho gói hỗ trợ, cho phép bạn tạo truyện thông qua trò chuyện tự nhiên với AI. Thay vì sử dụng giao diện form thông thường, bạn có thể mô tả ý tưởng và để AI giúp phát triển cốt truyện, nhân vật và hội thoại một cách tự nhiên hơn."
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold tracking-tight">Câu Hỏi Thường Gặp</h1>
            <p className="text-lg text-muted-foreground">
              Giải đáp những thắc mắc phổ biến về ChatStoryAI
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </main>
    </div>
  )
}