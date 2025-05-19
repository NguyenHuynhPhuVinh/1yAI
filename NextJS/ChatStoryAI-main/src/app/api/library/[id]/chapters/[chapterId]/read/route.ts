/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import pool from "@/lib/db"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const resolvedParams = await params
    const { id, chapterId } = resolvedParams
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Bạn cần đăng nhập để thực hiện hành động này" },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Kiểm tra xem đã đánh dấu chưa
    const [existingRead] = await pool.execute(
      'SELECT * FROM chapter_reads WHERE user_id = ? AND chapter_id = ?',
      [userId, chapterId]
    ) as any[]

    if (existingRead.length === 0) {
      // Nếu chưa đánh dấu, thêm mới
      await pool.execute(
        'INSERT INTO chapter_reads (user_id, chapter_id) VALUES (?, ?)',
        [userId, chapterId]
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Lỗi khi đánh dấu chương đã đọc:', error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const resolvedParams = await params
    const { id, chapterId } = resolvedParams
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Bạn cần đăng nhập để thực hiện hành động này" },
        { status: 401 }
      )
    }

    await pool.execute(
      'DELETE FROM chapter_reads WHERE user_id = ? AND chapter_id = ?',
      [session.user.id, chapterId]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Lỗi khi bỏ đánh dấu chương đã đọc:', error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
} 