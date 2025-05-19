import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}'),
    scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

export async function POST(request: Request) {
    const { name, parentId } = await request.json();
    try {
        const fileMetadata = {
            name,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [parentId || '1YAMjIdiDdhc5cjR7etXIpNoPW26TV1Yf'],
        };

        const response = await drive.files.create({
            requestBody: fileMetadata,
            fields: 'id',
        });

        // Xác định key chính xác của thư mục cha
        const parentKey = parentId
            ? `drive_files:${parentId}_`
            : 'drive_files:root_';

        // Xóa cache
        const deleteResult = await redis.del(parentKey);

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Create folder error:', error);
        return NextResponse.json({ error: 'Lỗi khi tạo thư mục' }, { status: 500 });
    }
} 