/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import pool from "@/lib/db"
import { GoogleDriveService } from "@/services/google-drive.service"
import { ResultSetHeader } from "mysql2"

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

    const [characters] = await pool.execute(`
      SELECT 
        character_id,
        name,
        avatar_image,
        description,
        role
      FROM story_characters
      WHERE story_id = ?
      ORDER BY CASE 
        WHEN role = 'main' THEN 0 
        ELSE 1 
      END, 
      character_id DESC
    `, [id]) as any[]

    return NextResponse.json({ characters })
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhân vật:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
}

// POST - Tạo nhân vật mới
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  const { id: storyId } = resolvedParams
  
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const role = formData.get('role') as 'main' | 'supporting'
    const avatarImage = formData.get('avatarImage') as File
    const gender = formData.get('gender') as string
    const birthday = formData.get('birthday') as string
    const height = parseInt(formData.get('height') as string) || null
    const weight = parseInt(formData.get('weight') as string) || null
    const personality = formData.get('personality') as string
    const appearance = formData.get('appearance') as string
    const background = formData.get('background') as string

    // Kiểm tra nhân vật chính
    if (role === 'main') {
      const [existingMain] = await pool.execute(
        `SELECT character_id FROM story_characters WHERE story_id = ? AND role = 'main'`,
        [storyId]
      ) as any[]

      if (existingMain.length > 0) {
        return NextResponse.json(
          { error: "Truyện này đã có nhân vật chính" },
          { status: 400 }
        )
      }
    }

    // Tạo nhân vật với các trường mới
    const [result] = await pool.execute(
      `INSERT INTO story_characters 
       (story_id, name, description, role, gender, birthday, height, weight, 
        personality, appearance, background) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [storyId, name, description, role, gender, birthday, height, weight,
       personality, appearance, background]
    ) as [ResultSetHeader, any]

    // Upload ảnh nếu có
    if (avatarImage && avatarImage.size > 0) {
      const buffer = Buffer.from(await avatarImage.arrayBuffer())
      const { directLink, fileId: newFileId } = await GoogleDriveService.uploadFile(
        buffer,
        avatarImage.type,
        parseInt(storyId),
        'character-avatar',
        parseInt(storyId),
        result.insertId
      )

      await pool.execute(
        `UPDATE story_characters 
         SET avatar_image = ?, avatar_file_id = ? 
         WHERE character_id = ?`,
        [directLink, newFileId, result.insertId]
      )
    }

    return NextResponse.json({ message: "Tạo nhân vật thành công" })
  } catch (error) {
    console.error("Lỗi khi tạo nhân vật:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
} 