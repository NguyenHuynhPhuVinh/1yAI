import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import pool from "@/lib/db"

// PUT - Cập nhật dialogue
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ dialogueId: string }> }
) {
  const resolvedParams = await params
  const { dialogueId } = resolvedParams
  
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    const { content } = await request.json()

    await pool.execute(
      'UPDATE chapter_dialogues SET content = ? WHERE dialogue_id = ?',
      [content, dialogueId]
    )

    return NextResponse.json({ message: "Cập nhật dialogue thành công" })
  } catch (error) {
    console.error("Lỗi khi cập nhật dialogue:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
}

// DELETE - Xóa dialogue
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ dialogueId: string }> }
) {
  const resolvedParams = await params
  const { dialogueId } = resolvedParams
  
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    await pool.execute(
      'DELETE FROM chapter_dialogues WHERE dialogue_id = ?',
      [dialogueId]
    )

    return NextResponse.json({ message: "Xóa dialogue thành công" })
  } catch (error) {
    console.error("Lỗi khi xóa dialogue:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
} 