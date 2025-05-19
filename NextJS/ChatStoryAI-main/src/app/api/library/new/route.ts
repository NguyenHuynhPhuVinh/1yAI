/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 20
    const offset = (page - 1) * limit

    const [stories] = await pool.query(`
      SELECT 
        s.story_id,
        s.title,
        s.description,
        s.cover_image,
        s.view_count,
        s.updated_at,
        mc.name as main_category
      FROM stories s
      LEFT JOIN main_categories mc ON s.main_category_id = mc.category_id
      WHERE s.status = 'published'
      ORDER BY s.updated_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]) as any[]

    return NextResponse.json({ stories })
  } catch (error) {
    console.error("Lỗi khi lấy danh sách truyện mới:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
} 