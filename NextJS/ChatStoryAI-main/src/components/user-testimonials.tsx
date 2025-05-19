"use client"
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const avatarColors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-indigo-500',
  'bg-teal-500',
];

const AvatarFallback = ({ name, index }: { name: string, index: number }) => {
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  const colorClass = avatarColors[index % avatarColors.length];
  
  return (
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}>
      <span className="text-lg font-semibold text-white">{initials}</span>
    </div>
  );
};

export default function UserTestimonials() {
  const testimonials = [
    {
      name: "Nguyễn Văn A",
      rating: 5,
      content: "Công cụ tuyệt vời giúp tôi phát triển ý tưởng truyện một cách dễ dàng và chuyên nghiệp.",
      role: "Tác giả truyện ngắn",
    },
    {
      name: "Trần Thị B",
      rating: 5,
      content: "AI thực sự hiểu được cách xây dựng nhân vật và cốt truyện. Tôi rất hài lòng với kết quả.",
      role: "Nhà văn tự do",
    },
    {
      name: "Lê Văn C",
      rating: 5,
      content: "Tính năng tạo đối thoại giúp tôi tiết kiệm rất nhiều thời gian trong quá trình viết.",
      role: "Biên kịch",
    },
    {
      name: "Phạm Thị D",
      rating: 5,
      content: "Giao diện đẹp, dễ sử dụng và các tính năng AI rất thông minh.",
      role: "Content Creator",
    },
    {
      name: "Hoàng Văn E",
      rating: 5,
      content: "Hệ thống gợi ý cốt truyện rất sáng tạo và độc đáo. Giúp tôi vượt qua writer's block.",
      role: "Nhà văn trẻ",
    },
    {
      name: "Mai Thị F",
      rating: 5,
      content: "Tính năng phát triển nhân vật giúp tôi tạo ra các nhân vật đa chiều và sống động.",
      role: "Tác giả webtoon",
    },
    {
      name: "Đỗ Văn G",
      rating: 5,
      content: "Công cụ hỗ trợ viết tuyệt vời, giúp tôi tạo ra những câu chuyện hấp dẫn hơn.",
      role: "Blogger",
    },
    {
      name: "Ngô Thị H",
      rating: 5,
      content: "AI hiểu rõ thể loại và phong cách viết của tôi. Rất hữu ích cho việc sáng tác.",
      role: "Tác giả light novel",
    }
  ]

  return (
    <section className="py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Đánh Giá Từ Cộng Đồng
          </h2>
          <p className="text-xl text-muted-foreground">
            Khám phá trải nghiệm thực tế từ các tác giả đang sử dụng nền tảng
          </p>
        </div>

        <div className="relative w-full overflow-hidden">
          <motion.div 
            className="flex gap-6"
            animate={{
              x: [-2000, 0],
            }}
            transition={{
              x: {
                repeat: Infinity,
                duration: 40,
                ease: "linear",
              },
            }}
          >
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div 
                key={index}
                className="w-[400px] flex-shrink-0 bg-card border rounded-xl p-8
                  hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-lg text-muted-foreground mb-6 line-clamp-3">
                  {testimonial.content}
                </p>

                <div className="flex items-center gap-4">
                  <AvatarFallback 
                    name={testimonial.name} 
                    index={index} 
                  />
                  <div>
                    <h3 className="font-semibold text-lg">
                      {testimonial.name}
                    </h3>
                    <p className="text-primary text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Gradient Overlays */}
          <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-background to-transparent" />
          <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-background to-transparent" />
        </div>
      </div>
    </section>
  );
} 