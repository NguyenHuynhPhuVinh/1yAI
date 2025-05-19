/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import pool from "@/lib/db"

// GET - Lấy thông tin đại cương
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; outlineId: string }> }
) {
  try {
    const resolvedParams = await params
    const { outlineId } = resolvedParams
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    const [outlines] = await pool.execute(`
      SELECT 
        outline_id,
        title,
        description,
        order_number
      FROM story_outlines
      WHERE outline_id = ?
    `, [outlineId]) as any[]

    if (!outlines.length) {
      return NextResponse.json(
        { error: "Không tìm thấy đại cương" },
        { status: 404 }
      )
    }

    return NextResponse.json({ outline: outlines[0] })
  } catch (error) {
    console.error("Lỗi khi lấy thông tin đại cương:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
}

// PUT - Cập nhật đại cương
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; outlineId: string }> }
) {
  const resolvedParams = await params
  const { outlineId } = resolvedParams
  
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    const { title, description } = await request.json()

    await pool.execute(
      `UPDATE story_outlines 
       SET title = ?, 
           description = ?
       WHERE outline_id = ?`,
      [title, description, outlineId]
    )

    return NextResponse.json({ 
      message: "Cập nhật đại cương thành công",
      outline: {
        outline_id: parseInt(outlineId),
        title,
        description
      }
    })
  } catch (error) {
    console.error("Lỗi khi cập nhật đại cương:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
}

// DELETE - Xóa đại cương
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; outlineId: string }> }
) {
  const resolvedParams = await params
  const { outlineId } = resolvedParams
  
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    await pool.execute(
      'DELETE FROM story_outlines WHERE outline_id = ?',
      [outlineId]
    )

    return NextResponse.json({ message: "Xóa đại cương thành công" })
  } catch (error) {
    console.error("Lỗi khi xóa đại cương:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
} 