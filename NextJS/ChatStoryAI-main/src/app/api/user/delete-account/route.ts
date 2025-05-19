/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthService } from "@/services/auth.service";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";;

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Vui lòng nhập mật khẩu" },
        { status: 400 }
      );
    }

    const result = await AuthService.deleteAccount(
      parseInt(session.user.id),
      password
    );

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
} 