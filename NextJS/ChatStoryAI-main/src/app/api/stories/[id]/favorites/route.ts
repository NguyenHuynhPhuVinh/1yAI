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

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      );
    }

    const [users] = await pool.execute(
      'SELECT user_id FROM users WHERE email = ?',
      [session.user.email]
    ) as any[];

    const [favorites] = await pool.execute(
      'SELECT * FROM story_favorites WHERE user_id = ? AND story_id = ?',
      [users[0].user_id, id]
    ) as any[];

    return NextResponse.json({ 
      isFavorited: favorites.length > 0 
    });
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

    const [users] = await pool.execute(
      'SELECT user_id FROM users WHERE email = ?',
      [session.user.email]
    ) as any[];

    const [favorites] = await pool.execute(
      'SELECT * FROM story_favorites WHERE user_id = ? AND story_id = ?',
      [users[0].user_id, id]
    ) as any[];

    if (favorites.length > 0) {
      await pool.execute(
        'DELETE FROM story_favorites WHERE user_id = ? AND story_id = ?',
        [users[0].user_id, id]
      );
      return NextResponse.json({ message: "Đã bỏ thích truyện" });
    }

    await pool.execute(
      'INSERT INTO story_favorites (user_id, story_id) VALUES (?, ?)',
      [users[0].user_id, id]
    );

    return NextResponse.json({ message: "Đã thích truyện" });
  } catch (error) {
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    );
  }
} 