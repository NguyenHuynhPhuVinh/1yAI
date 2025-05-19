/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';

export async function GET() {
    const apiKey = process.env.GEMINI_API_KEY_AI_1;
    if (!apiKey) {
        return NextResponse.json(
            { success: false, error: 'Không tìm thấy API key' },
            { status: 500 }
        );
    }

    return NextResponse.json({ success: true, apiKey });
}