import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        if (password !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json(
                { error: 'Mật khẩu không đúng' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { message: 'Xác thực thành công' },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Lỗi xác thực' },
            { status: 500 }
        );
    }
} 