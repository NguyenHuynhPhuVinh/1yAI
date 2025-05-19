import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}'),
    scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

export async function GET() {
    try {
        const response = await drive.files.list({
            pageSize: 1000,
            fields: 'files(id, name, mimeType, size, createdTime, parents)',
            q: "trashed = false",
        });

        return NextResponse.json({ files: response.data.files || [] });
    } catch (error) {
        console.error('Lỗi khi lấy tất cả files:', error);
        return NextResponse.json({ error: 'Không thể lấy danh sách files' }, { status: 500 });
    }
} 