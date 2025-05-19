/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import pool from "@/lib/db"
import { GoogleDriveService } from "@/services/google-drive.service"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { chatId, role, content, images } = body

    const [[user]] = await pool.query(
      'SELECT user_id FROM users WHERE email = ?',
      [session.user.email]
    ) as unknown as [[{ user_id: number }]]

    // Nếu không có chatId, tạo chat mới
    let currentChatId = chatId
    if (!currentChatId) {
      const [result] = await pool.execute(
        'INSERT INTO ai_chat_history (user_id, title) VALUES (?, ?)',
        [user.user_id, content.substring(0, 50) + '...']
      ) as any
      currentChatId = result.insertId
    }

    // Lưu tin nhắn
    const [messageResult] = await pool.execute(
      'INSERT INTO ai_chat_messages (chat_id, role, content) VALUES (?, ?, ?)',
      [currentChatId, role, content]
    ) as any

    // Upload và lưu ảnh nếu có
    if (images && images.length > 0) {
      for (const image of images) {
        const buffer = Buffer.from(image.buffer)
        const { fileId, directLink } = await GoogleDriveService.uploadFile(
          buffer,
          image.mimeType,
          user.user_id,
          'chat',
          currentChatId
        )

        await pool.execute(
          'INSERT INTO ai_chat_images (message_id, file_id, image_url) VALUES (?, ?, ?)',
          [messageResult.insertId, fileId, directLink]
        )
      }
    }

    // Cập nhật thời gian chat
    await pool.execute(
      'UPDATE ai_chat_history SET updated_at = CURRENT_TIMESTAMP WHERE chat_id = ?',
      [currentChatId]
    )

    return NextResponse.json({ 
      chatId: currentChatId,
      messageId: messageResult.insertId 
    })
  } catch (error) {
    console.error("Lỗi khi lưu tin nhắn:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
} 