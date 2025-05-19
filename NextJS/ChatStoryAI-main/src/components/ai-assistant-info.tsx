"use client"
import { Bot, BookOpen, MessagesSquare, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export default function AIAssistantInfo() {
  const features = [
    {
      icon: Bot,
      title: "Tương Tác Thông Minh",
      description: "Trò chuyện tự nhiên với AI để phát triển ý tưởng, nhận gợi ý và chỉnh sửa nội dung"
    },
    {
      icon: BookOpen,
      title: "Quản Lý Truyện",
      description: "Tạo, sửa, xuất bản truyện dễ dàng thông qua các lệnh đơn giản với AI"
    },
    {
      icon: MessagesSquare,
      title: "Hỗ Trợ Hội Thoại",
      description: "Tạo và chỉnh sửa các đoạn hội thoại sống động giữa các nhân vật"
    },
    {
      icon: Sparkles,
      title: "Sáng Tạo Không Giới Hạn",
      description: "Khám phá vô vàn khả năng với sự hỗ trợ của AI trong việc phát triển cốt truyện"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <section className="w-full py-16 sm:py-24 overflow-hidden bg-gradient-to-b from-background to-background/80">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-bold mb-6">
            Trợ Lý Sáng Tạo Truyện AI
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Trợ lý AI thông minh giúp bạn phát triển ý tưởng và quản lý truyện một cách hiệu quả
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 relative"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative flex flex-col rounded-xl border-2 border-primary/20
                bg-gradient-to-br from-white/80 to-white/40 dark:from-background/80 dark:to-background/40
                backdrop-blur-sm p-6 sm:p-8 hover:shadow-lg hover:border-primary/40 
                transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center
                  group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                  <feature.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="font-bold text-2xl text-center sm:text-left group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
              </div>
              <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}

          {/* Decorative elements */}
          <div className="absolute -z-10 w-[200px] h-[200px] bg-primary/5 rounded-full 
            blur-3xl top-0 -left-20 animate-pulse" />
          <div className="absolute -z-10 w-[300px] h-[300px] bg-primary/5 rounded-full 
            blur-3xl bottom-0 -right-20 animate-pulse delay-1000" />
        </motion.div>
      </div>
    </section>
  )
} 