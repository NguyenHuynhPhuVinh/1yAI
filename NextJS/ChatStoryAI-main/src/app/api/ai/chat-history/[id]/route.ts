/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import pool from "@/lib/db"
import { GoogleDriveService } from "@/services/google-drive.service"

export async function GET(
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

    const [users] = await pool.query(
      'SELECT user_id FROM users WHERE email = ?',
      [session.user.email]
    )

    // Lấy tin nhắn và hình ảnh
    const [messages] = await pool.query(`
      SELECT 
        m.message_id as id,
        m.role,
        m.content,
        m.command_status,
        GROUP_CONCAT(
          JSON_OBJECT(
            'fileId', i.file_id,
            'url', i.image_url
          )
        ) as images
      FROM ai_chat_messages m
      LEFT JOIN ai_chat_images i ON m.message_id = i.message_id
      WHERE m.chat_id = ?
      GROUP BY m.message_id
      ORDER BY m.created_at ASC
    `, [id]) as any[]

    // Format messages
    const formattedMessages = messages.map((msg: any) => {
      const messageData: {
        id: number;
        role: string;
        content: string;
        command_status?: 'loading' | 'success' | 'error';
        images?: { fileId: string; url: string; }[];
      } = {
        id: msg.id,
        role: msg.role,
        content: msg.content
      }
      
      if (msg.command_status) {
        messageData.command_status = msg.command_status
      }
      
      if (msg.images && msg.images.length > 2) { // kiểm tra có ảnh thật sự
        const parsedImages = JSON.parse(`[${msg.images}]`).filter(Boolean)
        if (parsedImages.length > 0) {
          messageData.images = parsedImages
        }
      }
      
      return messageData
    })

    return NextResponse.json({ messages: formattedMessages })
  } catch (error) {
    console.error("Lỗi khi lấy tin nhắn:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    // Lấy tất cả file_id của ảnh trong chat
    const [images] = await pool.query(`
      SELECT file_id 
      FROM ai_chat_images i
      JOIN ai_chat_messages m ON i.message_id = m.message_id
      WHERE m.chat_id = ?
    `, [id]) as any[]

    // Xóa từng ảnh trên Google Drive
    for (const image of images) {
      await GoogleDriveService.deleteFile(image.file_id)
    }

    // Xóa chat (cascade sẽ xóa messages và images)
    await pool.execute(
      'DELETE FROM ai_chat_history WHERE chat_id = ?',
      [id]
    )

    return NextResponse.json({ message: "Xóa thành công" })
  } catch (error) {
    console.error("Lỗi khi xóa cuộc trò chuyện:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
} 