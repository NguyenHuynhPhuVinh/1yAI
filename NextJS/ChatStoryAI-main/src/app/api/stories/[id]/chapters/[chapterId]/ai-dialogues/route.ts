/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";

// GET: Lấy danh sách hội thoại AI đã tạo
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id: storyId, chapterId } = resolvedParams;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      );
    }

    // Kiểm tra quyền truy cập
    const [stories] = await pool.execute(
      "SELECT * FROM stories WHERE story_id = ? AND user_id = ?",
      [storyId, session.user.id]
    ) as any[];

    if (!stories.length) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 403 }
      );
    }

    // Lấy danh sách hội thoại AI
    const [dialogues] = await pool.execute(
      "SELECT * FROM ai_generated_dialogues WHERE story_id = ? AND chapter_id = ? ORDER BY created_at DESC",
      [storyId, chapterId]
    ) as any[];

    // Chuyển đổi character_names từ JSON string sang array
    const formattedDialogues = dialogues.map((d: any) => ({
      id: d.dialogue_id,
      content: d.content,
      type: d.type,
      character_names: JSON.parse(d.character_names || '[]'),
      is_added: d.is_added === 1 // Chuyển đổi từ 0/1 sang boolean
    }));

    return NextResponse.json({ dialogues: formattedDialogues });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách hội thoại AI:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    );
  }
}

// POST: Thêm hội thoại AI mới
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id: storyId, chapterId } = resolvedParams;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      );
    }

    const { content, type, character_names } = await request.json();

    // Kiểm tra quyền truy cập
    const [stories] = await pool.execute(
      "SELECT * FROM stories WHERE story_id = ? AND user_id = ?",
      [storyId, session.user.id]
    ) as any[];

    if (!stories.length) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 403 }
      );
    }

    // Thêm hội thoại AI mới
    const [result] = await pool.execute(
      "INSERT INTO ai_generated_dialogues (story_id, chapter_id, content, type, character_names, is_added) VALUES (?, ?, ?, ?, ?, ?)",
      [storyId, chapterId, content, type, JSON.stringify(character_names), 0]
    ) as any[];

    const dialogue = {
      dialogue_id: result.insertId,
      story_id: storyId,
      chapter_id: chapterId,
      content,
      type,
      character_names,
      is_added: false,
      created_at: new Date()
    };

    return NextResponse.json({ dialogue });
  } catch (error) {
    console.error("Lỗi khi thêm hội thoại AI:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    );
  }
}

// PUT: Cập nhật trạng thái đã thêm
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id: storyId, chapterId } = resolvedParams;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      );
    }

    const { dialogue_id, is_added } = await request.json();

    // Kiểm tra quyền truy cập
    const [stories] = await pool.execute(
      "SELECT * FROM stories WHERE story_id = ? AND user_id = ?",
      [storyId, session.user.id]
    ) as any[];

    if (!stories.length) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 403 }
      );
    }

    // Cập nhật trạng thái
    await pool.execute(
      "UPDATE ai_generated_dialogues SET is_added = ? WHERE dialogue_id = ?",
      [is_added ? 1 : 0, dialogue_id]
    );

    return NextResponse.json({ message: "Cập nhật trạng thái thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái hội thoại AI:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    );
  }
}

// DELETE: Xóa tất cả hội thoại AI của chapter
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id: storyId, chapterId } = resolvedParams;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      );
    }

    // Kiểm tra quyền truy cập
    const [stories] = await pool.execute(
      "SELECT * FROM stories WHERE story_id = ? AND user_id = ?",
      [storyId, session.user.id]
    ) as any[];

    if (!stories.length) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 403 }
      );
    }

    const url = new URL(request.url);
    const dialogueId = url.searchParams.get("dialogueId");
    const clearAll = url.searchParams.get("clearAll");

    if (clearAll === "true") {
      // Xóa tất cả hội thoại của chapter
      await pool.execute(
        "DELETE FROM ai_generated_dialogues WHERE story_id = ? AND chapter_id = ?",
        [storyId, chapterId]
      );
      return NextResponse.json({ message: "Xóa tất cả hội thoại thành công" });
    } else if (dialogueId) {
      // Xóa một hội thoại cụ thể
      await pool.execute(
        "DELETE FROM ai_generated_dialogues WHERE dialogue_id = ?",
        [dialogueId]
      );
      return NextResponse.json({ message: "Xóa hội thoại thành công" });
    } else {
      return NextResponse.json(
        { error: "Thiếu thông tin xóa" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Lỗi khi xóa hội thoại AI:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    );
  }
} 