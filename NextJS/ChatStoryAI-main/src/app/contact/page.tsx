/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin } from "lucide-react"
import TextareaAutosize from 'react-textarea-autosize'
import emailjs from '@emailjs/browser'
import { toast } from "sonner"

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await emailjs.send(
        'service_migewp5', // Thay thế bằng Service ID của bạn
        'template_ibjlr5j', // Thay thế bằng Template ID của bạn
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_email: 'chatstoryai@gmail.com'
        },
        'sezXfvR3C4eXA3-Qb' // Thay thế bằng Public Key của bạn
      )

      toast.success('Tin nhắn của bạn đã được gửi thành công.')
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      toast.error('Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-4xl font-bold tracking-tight">Liên Hệ</h1>
              <p className="text-lg text-muted-foreground">
                Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-muted-foreground">chatstoryai@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Điện thoại</h3>
                    <p className="text-muted-foreground">0762605309</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <MapPin className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Địa chỉ</h3>
                    <p className="text-muted-foreground">
                      Trường Đại Học Trà Vinh - DA22TTC - Nhóm Báo Cáo Công Nghệ Phần Mềm
                    </p>
                  </div>
                </div>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input 
                    id="name" 
                    placeholder="Nhập họ và tên của bạn"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Nội dung</Label>
                  <TextareaAutosize
                    id="message"
                    placeholder="Nhập nội dung tin nhắn"
                    minRows={5}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({...prev, message: e.target.value}))}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Đang gửi..." : "Gửi tin nhắn"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}