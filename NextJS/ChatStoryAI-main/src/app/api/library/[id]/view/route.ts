/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams

    await pool.execute(
      `UPDATE stories SET view_count = view_count + 1 WHERE story_id = ?`,
      [id]
    )

    // Lấy user_id từ session nếu đã đăng nhập
    const session = await getServerSession(authOptions)
    if (session?.user?.email) {
      const [users] = await pool.execute(
        'SELECT user_id FROM users WHERE email = ?',
        [session.user.email]
      ) as any

      if (users.length) {
        const userId = users[0].user_id
        await pool.execute(
          'INSERT INTO view_history (user_id, story_id) VALUES (?, ?)',
          [userId, id]
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Lỗi khi cập nhật lượt xem:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
} 