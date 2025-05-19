/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import pool from "@/lib/db" // Import cấu hình database của bạn

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Kiểm tra email có tồn tại không
    const [existingEmails] = await pool.execute(
      "SELECT email FROM subscribers WHERE email = ?",
      [email]
    )

    if (Array.isArray(existingEmails) && existingEmails.length > 0) {
      return NextResponse.json(
        { error: "Email này đã được đăng ký." },
        { status: 400 }
      )
    }

    // Thêm email vào database (thay đổi query cho phù hợp với database của bạn)
    await pool.execute("INSERT INTO subscribers (email) VALUES (?)", [email])

    return NextResponse.json(
      { message: "Đăng ký nhận thông tin thành công!" },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Lỗi khi đăng ký:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra. Vui lòng thử lại sau." },
      { status: 500 }
    )
  }
} 