/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { AuthService } from '@/services/auth.service';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = await AuthService.register(data);

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Email đã được sử dụng') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi đăng ký' },
      { status: 500 }
    );
  }
} 