import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      apiKey: process.env.GEMINI_API_KEY,
    });
  } catch (error) {
    console.error("Lỗi khi lấy API key:", error);
    return NextResponse.json(
      { error: "Không thể lấy API key" },
      { status: 500 }
    );
  }
}
