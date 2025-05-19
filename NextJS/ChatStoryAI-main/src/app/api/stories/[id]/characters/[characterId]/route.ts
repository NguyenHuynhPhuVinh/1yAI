/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import pool from "@/lib/db"
import { GoogleDriveService } from "@/services/google-drive.service"

// PUT - Cập nhật nhân vật
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string, characterId: string }> }
) {
  try {
    const resolvedParams = await context.params
    const { id: storyId, characterId } = resolvedParams
    
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
    const avatarImage = formData.get('avatarImage') as File | null
    const role = formData.get('role') as 'main' | 'supporting'
    const gender = formData.get('gender') as string
    const birthday = formData.get('birthday') as string
    const height = formData.get('height') as string
    const weight = formData.get('weight') as string
    const personality = formData.get('personality') as string
    const appearance = formData.get('appearance') as string
    const background = formData.get('background') as string

    const connection = await pool.getConnection()
    
    try {
      await connection.beginTransaction()

      // Kiểm tra nếu đổi thành nhân vật chính
      if (role === 'main') {
        const [existingMain] = await connection.execute(
          `SELECT character_id FROM story_characters 
           WHERE story_id = ? AND role = 'main' AND character_id != ?`,
          [storyId, characterId]
        ) as any[]

        if (existingMain.length > 0) {
          return NextResponse.json(
            { error: "Truyện đã có nhân vật chính" },
            { status: 400 }
          )
        }
      }

      // Lấy thông tin nhân vật cũ
      const [characters] = await connection.execute(
        'SELECT avatar_file_id FROM story_characters WHERE character_id = ?',
        [characterId]
      ) as any[]

      let avatarUrl = null
      let newFileId = null

      if (avatarImage instanceof File && avatarImage.size > 0) {
        // Upload ảnh mới trước
        const buffer = Buffer.from(await avatarImage.arrayBuffer())
        const { directLink, fileId } = await GoogleDriveService.uploadFile(
          buffer,
          avatarImage.type,
          parseInt(storyId),
          'character-avatar',
          parseInt(storyId),
          parseInt(characterId)
        )
        avatarUrl = directLink
        newFileId = fileId

        // Chỉ xóa ảnh cũ sau khi upload thành công
        if (characters[0]?.avatar_file_id && characters[0].avatar_file_id !== newFileId) {
          await GoogleDriveService.deleteFile(characters[0].avatar_file_id)
        }
      }

      // Cập nhật thông tin nhân vật
      const updateQuery = `
        UPDATE story_characters 
        SET name = ?, description = ?, role = ?, gender = ?,
            birthday = ?, height = ?, weight = ?, 
            personality = ?, appearance = ?, background = ?
            ${avatarUrl ? ', avatar_image = ?, avatar_file_id = ?' : ''}
        WHERE character_id = ?`

      const updateParams = avatarUrl 
        ? [name, description, role, gender, birthday, height, weight, personality, appearance, background, avatarUrl, newFileId, characterId]
        : [name, description, role, gender, birthday, height, weight, personality, appearance, background, characterId]

      await connection.execute(updateQuery, updateParams)
      await connection.commit()

      return NextResponse.json({ message: "Cập nhật nhân vật thành công" })
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật nhân vật:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
}

// DELETE - Xóa nhân vật
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string, characterId: string }> }
) {
  try {
    const resolvedParams = await context.params
    const { id: storyId, characterId } = resolvedParams
    
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    // Lấy thông tin nhân vật để xóa ảnh
    const [characters] = await pool.execute(
      'SELECT avatar_file_id FROM story_characters WHERE character_id = ?',
      [characterId]
    ) as any[]

    if (characters.length && characters[0].avatar_file_id) {
      await GoogleDriveService.deleteFile(characters[0].avatar_file_id)
    }

    await pool.execute(
      'DELETE FROM story_characters WHERE character_id = ?',
      [characterId]
    )

    return NextResponse.json({ message: "Xóa nhân vật thành công" })
  } catch (error) {
    console.error("Lỗi khi xóa nhân vật:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
} 