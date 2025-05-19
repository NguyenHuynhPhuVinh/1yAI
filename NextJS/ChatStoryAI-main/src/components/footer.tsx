"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Facebook, Instagram, Linkedin, Twitter, Github } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useLoading } from "@/providers/loading-provider"

function Footer() {
  const router = useRouter()
  const currentYear = new Date().getFullYear()
  const { startLoading } = useLoading()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("Vui lòng nhập đúng định dạng email")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message || "Đăng ký nhận thông tin thành công!")
        setEmail("")
      } else {
        toast.error(data.error || "Đã có lỗi xảy ra. Vui lòng thử lại sau.")
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error)
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <footer className="bg-background py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center">
          <nav className="mb-8 flex flex-wrap justify-center gap-6">
            <button onClick={() => {
              startLoading("/")
              router.push("/")
            }} className="hover:text-primary">Trang chủ</button>
            <button onClick={() => {
              startLoading("/about")
              router.push("/about")
            }} className="hover:text-primary">Giới thiệu</button>
            <button onClick={() => {
              startLoading("/services")
              router.push("/services")
            }} className="hover:text-primary">Dịch vụ</button>
            <button onClick={() => {
              startLoading("/products")
              router.push("/products")
            }} className="hover:text-primary">Sản phẩm</button>
            <button onClick={() => {
              startLoading("/contact")
              router.push("/contact")
            }} className="hover:text-primary">Liên hệ</button>
          </nav>
          <div className="mb-8 flex space-x-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full"
              onClick={() => window.open("https://www.facebook.com/", "_blank")}
            >
              <Facebook className="h-4 w-4" />
              <span className="sr-only">Facebook</span>
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full"
              onClick={() => window.open("https://github.com/NguyenHuynhPhuVinh-TomiSakae/ChatStoryAI", "_blank")}
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full"
              onClick={() => window.open("https://twitter.com/", "_blank")}
            >
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full"
              onClick={() => window.open("https://www.instagram.com/", "_blank")}
            >
              <Instagram className="h-4 w-4" />
              <span className="sr-only">Instagram</span>
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full"
              onClick={() => window.open("https://www.linkedin.com/", "_blank")}
            >
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </Button>
          </div>
          <div className="mb-8 w-full max-w-md">
            <form className="flex space-x-2" onSubmit={handleSubmit}>
              <div className="flex-grow">
                <Label htmlFor="email" className="sr-only">Email</Label>
                <Input 
                  id="email" 
                  placeholder="Nhập email để nhận thông tin mới nhất" 
                  type="email" 
                  className="rounded-full" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button 
                type="submit" 
                className="rounded-full"
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đăng ký"}
              </Button>
            </form>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © {currentYear} ChatStoryAI. Tạo câu chuyện trong mơ.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
