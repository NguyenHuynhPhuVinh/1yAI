/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    // Lấy danh sách thể loại chính
    const [mainCategories] = await pool.execute(`
      SELECT 
        category_id as id,
        name,
        description 
      FROM main_categories 
      ORDER BY name ASC
    `) as any[];

    // Lấy danh sách tag
    const [tags] = await pool.execute(`
      SELECT 
        tag_id as id,
        name,
        description
      FROM story_tags 
      ORDER BY name ASC
    `) as any[];

    return NextResponse.json({ 
      mainCategories, 
      tags 
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thể loại:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    );
  }
} 