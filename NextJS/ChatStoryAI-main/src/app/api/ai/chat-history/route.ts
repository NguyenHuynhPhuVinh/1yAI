/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import pool from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    const [users] = await pool.execute(
      'SELECT user_id FROM users WHERE email = ?',
      [session.user.email]
    ) as any[]

    const [history] = await pool.execute(`
      SELECT chat_id, title, updated_at
      FROM ai_chat_history
      WHERE user_id = ?
      ORDER BY updated_at DESC
    `, [users[0].user_id]) as any[]

    return NextResponse.json({ history })
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử chat:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
} 