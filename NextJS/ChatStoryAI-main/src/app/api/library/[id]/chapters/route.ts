/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import pool from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const resolvedParams = await params
    const { id } = resolvedParams

    // Query khác nhau tùy theo trạng thái đăng nhập
    const query = session ? `
      SELECT 
        c.chapter_id,
        c.title,
        c.status,
        c.publish_order,
        CASE WHEN r.read_id IS NOT NULL THEN TRUE ELSE FALSE END as is_read
      FROM story_chapters c
      LEFT JOIN chapter_reads r ON c.chapter_id = r.chapter_id 
        AND r.user_id = ?
      WHERE c.story_id = ? AND c.status = 'published'
      ORDER BY c.publish_order ASC
    ` : `
      SELECT 
        c.chapter_id,
        c.title,
        c.status,
        c.publish_order,
        FALSE as is_read
      FROM story_chapters c
      WHERE c.story_id = ? AND c.status = 'published'
      ORDER BY c.publish_order ASC
    `
    
    // Thực thi query với params phù hợp
    const [chapters] = session 
      ? await pool.execute(query, [session.user?.id, id]) as any[]
      : await pool.execute(query, [id]) as any[]

    return NextResponse.json({ chapters })
  } catch (error) {
    console.error('Lỗi khi lấy danh sách chương:', error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
} 