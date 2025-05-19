/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";;
import { NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Không tìm thấy người dùng" },
        { status: 401 }
      );
    }

    const result = await AuthService.updateBadgeStatus(parseInt(session.user.id));

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Lỗi khi cập nhật huy hiệu:", error);
    return NextResponse.json(
      { error: error.message || "Đã có lỗi xảy ra khi cập nhật huy hiệu" },
      { status: 500 }
    );
  }
} 