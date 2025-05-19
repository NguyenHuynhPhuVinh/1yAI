"use client"
import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Wand2, MessageSquare, BookOpen, Users2, Image, ExternalLink } from "lucide-react"
import { useRouter } from 'next/navigation'
import { useLoading } from "@/providers/loading-provider"

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
}

export default function GeminiInfo() {
  const router = useRouter()
  const { startLoading } = useLoading()

  const features: Feature[] = [
    {
      icon: Brain,
      title: "Tạo Ý Tưởng Truyện",
      description: "AI giúp bạn phát triển ý tưởng truyện độc đáo với tiêu đề, mô tả và thể loại phù hợp."
    },
    {
      icon: Users2,
      title: "Phát Triển Nhân Vật",
      description: "Tạo và hoàn thiện nhân vật với thông tin chi tiết về ngoại hình, tính cách và tiểu sử."
    },
    {
      icon: MessageSquare,
      title: "Tạo Hội Thoại",
      description: "Tự động tạo các đoạn hội thoại tự nhiên và hấp dẫn giữa các nhân vật."
    },
    {
      icon: BookOpen,
      title: "Quản Lý Chương",
      description: "Hỗ trợ tạo và chỉnh sửa nội dung từng chương với tóm tắt chi tiết."
    },
    {
      icon: Wand2,
      title: "Tạo Đại Cương",
      description: "Phát triển cấu trúc tổng thể cho truyện với các đại cương chi tiết."
    },
    {
      icon: Image,
      title: "Tạo Prompt Hình Ảnh",
      description: "Tự động tạo prompt cho ảnh bìa và avatar nhân vật phù hợp với nội dung."
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
    <div className="relative">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 sm:py-32">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Sức Mạnh của Gemini AI
          </h1>
          <p className="text-xl text-muted-foreground">
            Khám phá những tính năng thông minh giúp sáng tạo nội dung truyện
          </p>
        </div>

        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative bg-card border rounded-xl p-8 hover:shadow-lg
                transition-all duration-300 hover:-translate-y-1"
            >
              <div className="mb-6">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center
                  group-hover:bg-primary/20 transition-colors duration-300">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto text-center">
          <div className="bg-card border rounded-2xl p-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Hãy Bắt Đầu Hành Trình Sáng Tạo
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Với sự hỗ trợ của Gemini AI, việc sáng tác truyện chưa bao giờ dễ dàng đến thế.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium
                  hover:shadow-lg transition-all duration-300"
                onClick={() => {
                  startLoading('/stories')
                  router.push('/stories')
                }}
              >
                Bắt Đầu Viết Ngay
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="https://aistudio.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border border-primary/30 rounded-xl font-medium 
                  inline-flex items-center justify-center gap-2 hover:bg-primary/5
                  transition-all duration-300"
              >
                Khám Phá AI Studio
                <ExternalLink className="w-4 h-4" />
              </motion.a>
            </div>
          </div>
        </section>
      </section>
    </div>
  )
}
