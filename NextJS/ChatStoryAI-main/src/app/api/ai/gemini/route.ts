import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Chưa cấu hình API key" },
        { status: 500 }
      );
    }

    return NextResponse.json({ apiKey });
  } catch (error) {
    console.error("Lỗi khi lấy API key:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    );
  }
} 