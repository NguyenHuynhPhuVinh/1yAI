import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import Redis from 'ioredis';

// Khởi tạo Redis client
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}'),
    scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

export async function GET() {
    try {
        // Tạo cache key cho thông tin drive
        const cacheKey = 'drive_info';

        // Kiểm tra cache
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
            return NextResponse.json(JSON.parse(cachedData), {
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                    'Pragma': 'no-cache',
                    'X-Cache': 'HIT'
                }
            });
        }

        const about = await drive.about.get({
            fields: 'storageQuota'
        });

        const { storageQuota } = about.data;

        const result = {
            total: storageQuota?.limit,
            used: storageQuota?.usage,
            remaining: Number(storageQuota?.limit) - Number(storageQuota?.usage)
        };

        // Lưu vào cache trong 5 phút
        await redis.setex(cacheKey, 300, JSON.stringify(result));

        return NextResponse.json(result, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'Pragma': 'no-cache',
                'X-Cache': 'MISS'
            }
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Lỗi khi lấy thông tin drive' },
            { status: 500 }
        );
    }
} 