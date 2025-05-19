import { NextRequest, NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.TOGETHER_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "TOGETHER_API_KEY không được cấu hình trong biến môi trường" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ apiKey });
  } catch (error) {
    console.error("Lỗi khi lấy Together API key:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy API key" },
      { status: 500 }
    );
  }
} 