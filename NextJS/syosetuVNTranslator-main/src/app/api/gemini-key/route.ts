import { NextResponse } from 'next/server';

export async function GET() {
  // Lấy API key từ biến môi trường
  const apiKey = process.env.GEMINI_API_KEY;
  
  // Kiểm tra xem API key có tồn tại không
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key không được cấu hình' },
      { status: 500 }
    );
  }
  
  // Trả về API key
  return NextResponse.json({ apiKey });
} 