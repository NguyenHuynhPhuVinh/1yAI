/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { MoveRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"
import { useLoading } from "@/providers/loading-provider"
import React from "react";
import Image from "next/image"

// Đơn giản hóa Slider component
const InfiniteSlider = ({ direction = 1 }: { direction?: number }) => {
  const [images, setImages] = React.useState<string[]>([])

  React.useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/stories/featured')
        const data = await response.json()
        if (data.stories) {
          setImages(data.stories.map((story: any) => story.cover_image))
        }
      } catch (error) {
        console.error("Lỗi khi lấy ảnh cho slider:", error)
      }
    }
    fetchImages()
  }, [])

  if (images.length === 0) {
    return null
  }

  // Tính toán tổng chiều rộng của một group ảnh
  const groupWidth = images.length * 208 // 200px width + 8px gap

  return (
    <div className="relative w-full h-[200px] sm:h-[320px] overflow-hidden">
      <motion.div 
        className="flex gap-2 sm:gap-4 absolute left-0 top-0"
        animate={{
          x: direction === 1 ? [-groupWidth, 0] : [0, -groupWidth]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop"
        }}
      >
        {/* Lặp lại ảnh 3 lần để tạo hiệu ứng vô hạn mượt mà */}
        {[...images, ...images, ...images].map((src, index) => (
          <div 
            key={index} 
            className="w-[140px] sm:w-[200px] inline-block flex-shrink-0"
          >
            <Image 
              src={src}
              alt={`Story ${index + 1}`}
              width={200}
              height={300}
              className="w-full h-[180px] sm:h-[300px] object-cover rounded-md shadow-lg"
              priority={index < 6}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

function Hero() {
  const router = useRouter()
  const { startLoading } = useLoading()
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Top Slider */}
      <div className="w-full py-4 sm:py-8 bg-muted">
        <InfiniteSlider direction={1} />
      </div>

      {/* Center Content */}
      <motion.div 
        className="container mx-auto px-4 py-8 sm:py-16 min-h-[50vh] sm:min-h-[60vh] relative"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants}>
            <Badge variant="outline" className="text-xs sm:text-sm font-medium uppercase tracking-wider">
              Beta
            </Badge>
          </motion.div>
          
          {/* Title Section */}
          <motion.div variants={itemVariants} className="mt-4 sm:mt-8">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tight leading-[1.1]">
              Sáng Tạo Truyện 
            </h1>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] md:text-right">
              Cùng AI <Sparkles className="inline w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
            </h1>
          </motion.div>

          {/* Description */}
          <motion.div variants={itemVariants} className="mt-6 sm:mt-12 md:text-right">
            <p className="text-xl sm:text-2xl text-muted-foreground">
              Biến ý tưởng thành câu chuyện trong tích tắc
            </p>
          </motion.div>
          
          {/* Buttons */}
          <motion.div variants={itemVariants} className="mt-8 sm:mt-12 md:text-right">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-end">
              <Button 
                size="lg" 
                variant="default" 
                className="gap-2 text-base sm:text-lg"
                onClick={() => {
                  startLoading('/stories')
                  router.push('/stories')
                }}
              >
                Viết Ngay <MoveRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="gap-2 text-base sm:text-lg"
                onClick={() => {
                  startLoading('/library/new')
                  router.push('/library/new')
                }}
              >
                Khám Phá <MoveRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
            </div>
          </motion.div>

          {/* Team Members */}
          <motion.div 
            variants={itemVariants}
            className="absolute bottom-2 sm:bottom-4 left-4 text-xs sm:text-sm text-muted-foreground space-y-0.5 sm:space-y-1"
          >
            <p>Nguyễn Huỳnh Phú Vinh</p>
            <p>Nguyễn Phú Vinh</p>
            <p>Huỳnh Phước Thọ</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Slider */}
      <div className="w-full py-4 sm:py-8 bg-muted">
        <InfiniteSlider direction={-1} />
      </div>
    </div>
  );
}

export { Hero };
