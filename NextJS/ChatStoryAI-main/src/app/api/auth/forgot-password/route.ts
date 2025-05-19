/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";
import { MailService } from "@/services/mail.service";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Vui lòng nhập email" },
        { status: 400 }
      );
    }

    const resetCode = await AuthService.generateResetCode(email);
    await MailService.sendResetCode(email, resetCode);

    return NextResponse.json({
      message: "Mã xác thực đã được gửi đến email của bạn"
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
} 