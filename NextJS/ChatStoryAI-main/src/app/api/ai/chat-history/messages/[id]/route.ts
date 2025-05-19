import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import pool from "@/lib/db"

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await context.params
    const { id } = resolvedParams

    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { command_status } = body

    await pool.execute(
      'UPDATE ai_chat_messages SET command_status = ? WHERE message_id = ?',
      [command_status, id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
} 