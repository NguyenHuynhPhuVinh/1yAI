import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import pool from "@/lib/db"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams
    
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    await pool.execute(
      "UPDATE notifications SET is_read = 1 WHERE notification_id = ? AND user_id = ?",
      [id, session.user.id]
    )

    return NextResponse.json({ message: "Đã đánh dấu đã đọc" })
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái thông báo:', error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
} 