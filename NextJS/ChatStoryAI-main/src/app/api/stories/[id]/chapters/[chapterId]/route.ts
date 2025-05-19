/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import pool from "@/lib/db"

// GET - Lấy thông tin chương
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  try {
    const resolvedParams = await params
    const { chapterId } = resolvedParams
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    const [chapters] = await pool.execute(`
      SELECT 
        sc.chapter_id,
        sc.title,
        sc.status,
        sc.summary,
        (SELECT COUNT(*) FROM chapter_dialogues WHERE chapter_id = sc.chapter_id) as dialogue_count
      FROM story_chapters sc
      WHERE sc.chapter_id = ?
    `, [chapterId]) as any[]

    if (!chapters.length) {
      return NextResponse.json(
        { error: "Không tìm thấy chương" },
        { status: 404 }
      )
    }

    return NextResponse.json({ chapter: chapters[0] })
  } catch (error) {
    console.error("Lỗi khi lấy thông tin chương:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
}

// PUT - Cập nhật chương
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  const resolvedParams = await params
  const { id: storyId, chapterId } = resolvedParams
  
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    const { title, summary, status: newStatus } = await request.json()

    // Kiểm tra nội dung chương nếu muốn xuất bản
    if (newStatus === 'published') {
      const [dialogues] = await pool.execute(
        `SELECT COUNT(*) as count FROM chapter_dialogues WHERE chapter_id = ?`,
        [chapterId]
      ) as any[]

      if (dialogues[0].count === 0) {
        return NextResponse.json(
          { error: "Cần có ít nhất một tin nhắn trong chương để xuất bản" },
          { status: 400 }
        )
      }
    }

    // Lấy thông tin chương hiện tại
    const [currentChapter] = await pool.execute(
      `SELECT status, publish_order FROM story_chapters WHERE chapter_id = ?`,
      [chapterId]
    ) as any[]

    if (!currentChapter.length) {
      return NextResponse.json(
        { error: "Không tìm thấy chương" },
        { status: 404 }
      )
    }

    // Sử dụng status mới nếu được cung cấp, ngược lại giữ nguyên status cũ
    const status = newStatus || currentChapter[0].status

    let publishOrder = currentChapter[0].publish_order

    if (status === 'published' && !publishOrder) {
      const [result] = await pool.execute(
        `SELECT MAX(publish_order) as max_order 
         FROM story_chapters 
         WHERE story_id = ? AND status = 'published'`,
        [storyId]
      ) as any[]

      publishOrder = (result[0].max_order || 0) + 1

      await pool.execute(
        `UPDATE story_chapters 
         SET title = ?, 
             summary = ?,
             status = ?,
             publish_order = ?
         WHERE chapter_id = ?`,
        [title, summary, status, publishOrder, chapterId]
      )

      // Chỉ tạo thông báo khi chương được xuất bản lần đầu
      const [followers] = await pool.execute(
        "SELECT user_id FROM story_bookmarks WHERE story_id = ?",
        [storyId]
      ) as any[]

      if (followers.length > 0) {
        const [storyInfo] = await pool.execute(
          "SELECT title FROM stories WHERE story_id = ?",
          [storyId]
        ) as any[]

        const notifications = followers.map((follower: any) => [
          follower.user_id,
          storyId,
          chapterId,
          `Chương mới: ${title}`,
          `Truyện "${storyInfo[0].title}" vừa cập nhật chương mới`
        ])

        await pool.query(`
          INSERT INTO notifications 
          (user_id, story_id, chapter_id, title, message)
          VALUES ?
        `, [notifications])
      }
    } else {
      await pool.execute(
        `UPDATE story_chapters 
         SET title = ?, 
             summary = ?,
             status = ?
         WHERE chapter_id = ?`,
        [title, summary, status, chapterId]
      )
    }

    // Trả về chapter đã cập nhật
    return NextResponse.json({ 
      message: "Cập nhật chương thành công",
      chapter: {
        chapter_id: parseInt(chapterId),
        title,
        summary,
        status
      }
    })
  } catch (error) {
    console.error("Lỗi khi cập nhật chương:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
}

// DELETE - Xóa chương
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  const resolvedParams = await params
  const { chapterId } = resolvedParams
  
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    await pool.execute(
      'DELETE FROM story_chapters WHERE chapter_id = ?',
      [chapterId]
    )

    return NextResponse.json({ message: "Xóa chương thành công" })
  } catch (error) {
    console.error("Lỗi khi xóa chương:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
} 