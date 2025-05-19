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

    const [notifications] = await pool.execute(`
      SELECT 
        n.notification_id,
        n.title,
        n.message,
        n.is_read,
        n.created_at,
        n.story_id,
        n.chapter_id
      FROM notifications n
      WHERE n.user_id = ?
      ORDER BY n.created_at DESC
      LIMIT 10
    `, [session.user.id]) as any[]

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error('Lỗi khi lấy thông báo:', error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
} 