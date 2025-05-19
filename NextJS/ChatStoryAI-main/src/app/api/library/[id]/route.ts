/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams
    
    const [stories] = await pool.execute(`
      SELECT 
        s.*,
        mc.name as main_category,
        GROUP_CONCAT(DISTINCT t.name) as tags,
        (SELECT COUNT(*) FROM story_favorites sf WHERE sf.story_id = s.story_id) as favorite_count,
        u.username as author_name,
        u.avatar as author_avatar,
        u.has_badge as author_has_badge
      FROM stories s
      LEFT JOIN main_categories mc ON s.main_category_id = mc.category_id
      LEFT JOIN story_tag_relations str ON s.story_id = str.story_id
      LEFT JOIN story_tags t ON str.tag_id = t.tag_id
      LEFT JOIN users u ON s.user_id = u.user_id
      WHERE s.story_id = ?
      GROUP BY s.story_id
    `, [id]) as any[]

    if (!stories.length) {
      return NextResponse.json(
        { error: "Không tìm thấy truyện" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      story: {
        ...stories[0],
        tags: stories[0].tags ? stories[0].tags.split(',') : []
      }
    })
  } catch (error) {
    console.error("Lỗi khi lấy thông tin truyện:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
} 