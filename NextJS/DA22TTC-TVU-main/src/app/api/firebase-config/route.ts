// src/app/api/firebase-config/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const firebaseConfig = {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            databaseURL: process.env.FIREBASE_DATABASE_URL,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.FIREBASE_APP_ID,
            measurementId: process.env.FIREBASE_MEASUREMENT_ID
        };

        return NextResponse.json(firebaseConfig);
    } catch (error) {
        return NextResponse.json(
            { error: 'Lỗi khi lấy cấu hình Firebase' },
            { status: 500 }
        );
    }
}