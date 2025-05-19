/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const [result] = await pool.execute(
      'SELECT COUNT(*) as count FROM story_favorites WHERE story_id = ?',
      [id]
    ) as any[];

    return NextResponse.json({ count: result[0].count });
  } catch (error) {
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    );
  }
} 