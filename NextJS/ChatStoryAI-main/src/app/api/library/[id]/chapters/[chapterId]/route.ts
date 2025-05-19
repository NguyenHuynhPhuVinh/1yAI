/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  try {
    const resolvedParams = await params
    const { chapterId } = resolvedParams
    
    const [chapters] = await pool.execute(`
      SELECT 
        sc.chapter_id,
        sc.title,
        sc.publish_order,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'dialogue_id', d.dialogue_id,
            'character_id', d.character_id,
            'content', d.content,
            'order_number', d.order_number,
            'type', d.type,
            'character', IF(d.character_id IS NOT NULL, 
              JSON_OBJECT(
                'character_id', c.character_id,
                'name', c.name,
                'avatar_image', c.avatar_image,
                'role', c.role
              ),
              NULL
            )
          )
        ) as dialogues
      FROM story_chapters sc
      LEFT JOIN chapter_dialogues d ON sc.chapter_id = d.chapter_id
      LEFT JOIN story_characters c ON d.character_id = c.character_id
      WHERE sc.chapter_id = ? AND sc.status = 'published'
      GROUP BY sc.chapter_id
    `, [chapterId]) as any[]

    if (!chapters.length) {
      return NextResponse.json(
        { error: "Không tìm thấy chương" },
        { status: 404 }
      )
    }

    const chapter = chapters[0]
    // Sắp xếp dialogues theo order_number
    if (chapter.dialogues) {
      chapter.dialogues.sort((a: any, b: any) => a.order_number - b.order_number)
    }

    return NextResponse.json({ chapter })
  } catch (error) {
    console.error("Lỗi khi lấy thông tin chương:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
} 