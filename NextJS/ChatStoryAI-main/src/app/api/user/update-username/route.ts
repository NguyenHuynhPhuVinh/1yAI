/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthService } from "@/services/auth.service";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";;

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: "Tên không được để trống" },
        { status: 400 }
      );
    }

    const result = await AuthService.updateUsername(
      parseInt(session.user.id as string),
      username
    );

    // Update session data
    session.user.name = username;

    return NextResponse.json({
      ...result,
      user: {
        ...session.user,
        name: username
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 