import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import pool from "@/lib/db"

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await context.params
  const { id } = resolvedParams
  
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    // Kiểm tra điều kiện xuất bản
    const [chapters] = await pool.execute(
      `SELECT chapter_id FROM story_chapters 
       WHERE story_id = ? AND status = 'published'`,
      [id]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any[]

    if (!chapters.length) {
      return NextResponse.json(
        { error: "Cần có ít nhất một chương đã xuất bản" },
        { status: 400 }
      )
    }

    // Cập nhật trạng thái truyện
    await pool.execute(
      `UPDATE stories SET status = 'published' WHERE story_id = ?`,
      [id]
    )

    return NextResponse.json({ message: "Xuất bản truyện thành công" })
  } catch (error) {
    console.error("Lỗi khi xuất bản truyện:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
} 