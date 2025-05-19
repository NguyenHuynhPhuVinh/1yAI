/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import pool from "@/lib/db"

// GET - Lấy danh sách dialogue
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  const resolvedParams = await params
  const { chapterId } = resolvedParams
  
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    const [dialogues] = await pool.execute(`
      SELECT dialogue_id, character_id, content, order_number, type
      FROM chapter_dialogues
      WHERE chapter_id = ?
      ORDER BY order_number
    `, [chapterId]) as any[]

    return NextResponse.json({ dialogues })
  } catch (error) {
    console.error("Lỗi khi lấy danh sách dialogue:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
}

// POST - Thêm dialogue mới
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  const resolvedParams = await params
  const { chapterId } = resolvedParams
  
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { character_id, content, order_number, type = 'dialogue' } = data

    const [result] = await pool.execute(`
      INSERT INTO chapter_dialogues (chapter_id, character_id, content, order_number, type)
      VALUES (?, ?, ?, ?, ?)
    `, [chapterId, character_id, content, order_number, type]) as any[]

    const [dialogue] = await pool.execute(`
      SELECT * FROM chapter_dialogues WHERE dialogue_id = ?
    `, [result.insertId]) as any[]

    return NextResponse.json({ 
      message: "Thêm dialogue thành công",
      dialogue: dialogue[0]
    })
  } catch (error) {
    console.error("Lỗi khi thêm dialogue:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
} 