/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const [comments] = await pool.execute(`
      SELECT 
        c.*,
        u.username,
        u.avatar,
        u.email as user_email
      FROM story_comments c
      JOIN users u ON c.user_id = u.user_id
      WHERE c.story_id = ?
      ORDER BY c.created_at DESC
    `, [id]) as any[];

    return NextResponse.json({ comments });
  } catch (error) {
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      );
    }

    const { content } = await request.json();

    const [users] = await pool.execute(
      'SELECT user_id FROM users WHERE email = ?',
      [session.user.email]
    ) as any[];

    await pool.execute(
      'INSERT INTO story_comments (user_id, story_id, content) VALUES (?, ?, ?)',
      [users[0].user_id, id, content]
    );

    return NextResponse.json({ message: "Đã thêm bình luận" });
  } catch (error) {
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      );
    }

    const { commentId, content } = await request.json();

    const [comment] = await pool.execute(
      `SELECT c.* FROM story_comments c 
       JOIN users u ON c.user_id = u.user_id 
       WHERE c.comment_id = ? AND u.email = ?`,
      [commentId, session.user.email]
    ) as any[];

    if (!comment.length) {
      return NextResponse.json(
        { error: "Không có quyền sửa bình luận này" },
        { status: 403 }
      );
    }

    await pool.execute(
      'UPDATE story_comments SET content = ? WHERE comment_id = ?',
      [content, commentId]
    );

    return NextResponse.json({ message: "Đã cập nhật bình luận" });
  } catch (error) {
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      );
    }

    const { commentId } = await request.json();

    const [comment] = await pool.execute(
      `SELECT c.* FROM story_comments c 
       JOIN users u ON c.user_id = u.user_id 
       WHERE c.comment_id = ? AND u.email = ?`,
      [commentId, session.user.email]
    ) as any[];

    if (!comment.length) {
      return NextResponse.json(
        { error: "Không có quyền xóa bình luận này" },
        { status: 403 }
      );
    }

    await pool.execute(
      'DELETE FROM story_comments WHERE comment_id = ?',
      [commentId]
    );

    return NextResponse.json({ message: "Đã xóa bình luận" });
  } catch (error) {
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    );
  }
} 