/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      );
    }

    // Lấy user_id từ email
    const [users] = await pool.execute(
      'SELECT user_id FROM users WHERE email = ?',
      [session.user.email]
    ) as any[];

    if (!users.length) {
      return NextResponse.json({ stories: [] });
    }

    const userId = users[0].user_id;

    // Lấy danh sách truyện
    const [stories] = await pool.execute(`
      SELECT 
        s.story_id,
        s.title,
        s.description,
        s.cover_image,
        s.status,
        s.view_count,
        s.updated_at,
        mc.name as main_category,
        GROUP_CONCAT(DISTINCT st.name) as tags,
        COUNT(DISTINCT sf.user_id) as favorite_count
      FROM stories s
      LEFT JOIN main_categories mc ON s.main_category_id = mc.category_id
      LEFT JOIN story_tag_relations str ON s.story_id = str.story_id
      LEFT JOIN story_tags st ON str.tag_id = st.tag_id
      LEFT JOIN story_favorites sf ON s.story_id = sf.story_id
      WHERE s.user_id = ?
      GROUP BY s.story_id
      ORDER BY s.updated_at DESC
    `, [userId]) as any[];

    // Format lại dữ liệu
    const formattedStories = stories.map((story: any) => ({
      ...story,
      tags: story.tags ? story.tags.split(',') : [],
      favorite_count: Number(story.favorite_count)
    }));

    return NextResponse.json({ stories: formattedStories });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách truyện:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra khi lấy danh sách truyện" },
      { status: 500 }
    );
  }
} 