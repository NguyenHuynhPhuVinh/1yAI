/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { AuthService } from '@/services/auth.service';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const result = await AuthService.login(email, password);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }
} 