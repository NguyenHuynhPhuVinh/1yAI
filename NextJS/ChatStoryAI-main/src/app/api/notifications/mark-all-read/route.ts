import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import pool from "@/lib/db"

export async function PUT() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    await pool.execute(
      "UPDATE notifications SET is_read = 1 WHERE user_id = ?",
      [session.user.id]
    )

    return NextResponse.json({ message: "Đã đánh dấu tất cả là đã đọc" })
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái thông báo:', error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
} 