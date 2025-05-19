/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import pool from "@/lib/db"

export async function GET(
  request: Request,
  context: { params: Promise<{ characterId: string }> }
) {
  try {
    const resolvedParams = await context.params
    const { characterId } = resolvedParams
    
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    const [characters] = await pool.execute(
      `SELECT 
        character_id,
        name,
        description,
        avatar_image,
        role,
        gender,
        birthday,
        height,
        weight,
        personality,
        appearance,
        background
       FROM story_characters 
       WHERE character_id = ?`,
      [characterId]
    ) as any[]

    if (!characters.length) {
      return NextResponse.json(
        { error: "Không tìm thấy nhân vật" },
        { status: 404 }
      )
    }

    return NextResponse.json({ character: characters[0] })
  } catch (error) {
    console.error("Lỗi khi lấy thông tin nhân vật:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
} 