/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import pool from "@/lib/db"

// GET - Lấy danh sách đại cương
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  const { id } = resolvedParams
  
  try {
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
        order_number,
        created_at
      FROM story_outlines
      WHERE story_id = ?
      ORDER BY order_number ASC
    `, [id]) as any[]

    return NextResponse.json({ outlines })
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đại cương:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
}

// POST - Tạo đại cương mới
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams
    const { title, description } = await request.json()

    // Bắt đầu transaction
    const connection = await pool.getConnection()
    await connection.beginTransaction()

    try {
      // Lấy order_number lớn nhất hiện tại
      const [maxOrder] = await connection.execute(`
        SELECT MAX(order_number) as max_order
        FROM story_outlines
        WHERE story_id = ?
      `, [id]) as any[]

      const nextOrder = (maxOrder[0].max_order || 0) + 1

      // Tạo đại cương mới
      const [result] = await connection.execute(`
        INSERT INTO story_outlines (
          story_id, 
          title,
          description,
          order_number,
          created_at
        ) VALUES (?, ?, ?, ?, NOW())
      `, [id, title, description, nextOrder]) as any[]

      await connection.commit()

      return NextResponse.json({
        outline_id: result.insertId,
        title,
        description,
        order_number: nextOrder
      })
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error("Lỗi khi tạo đại cương mới:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra khi tạo đại cương mới" },
      { status: 500 }
    )
  }
} 