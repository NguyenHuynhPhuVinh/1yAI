/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth";
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

    // Lấy user_id từ email
    const [users] = await pool.execute(
      'SELECT user_id FROM users WHERE email = ?',
      [session.user.email]
    ) as any

    if (!users.length) {
      return NextResponse.json({ history: [] })
    }

    const userId = users[0].user_id

    // Lấy lịch sử xem
    const [history] = await pool.execute(`
      SELECT 
        s.story_id,
        s.title,
        s.cover_image,
        mc.name as main_category,
        vh.view_date
      FROM view_history vh
      JOIN stories s ON vh.story_id = s.story_id
      LEFT JOIN main_categories mc ON s.main_category_id = mc.category_id
      WHERE vh.user_id = ?
      ORDER BY vh.view_date DESC
      LIMIT 20
    `, [userId]) as any

    return NextResponse.json({ history })
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử xem:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
} 