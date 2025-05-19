/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    const [stories] = await pool.execute(`
      SELECT 
        story_id,
        title,
        cover_image
      FROM stories
      WHERE status = 'published' AND cover_image IS NOT NULL
      ORDER BY RAND()
      LIMIT 6
    `) as any[]

    return NextResponse.json({ stories })
  } catch (error) {
    console.error("Lỗi khi lấy danh sách truyện cho slider:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
} 