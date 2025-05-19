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
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const parentId = formData.get('parentId') as string;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const fileMetadata = {
            name: file.name,
            parents: [parentId || '1YAMjIdiDdhc5cjR7etXIpNoPW26TV1Yf'],
        };

        const media = {
            mimeType: file.type,
            body: require('stream').Readable.from(buffer)
        };

        const response = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id',
        });

        // Xóa cache của thư mục cha
        const parentKey = parentId
            ? `drive_files:${parentId}_`
            : 'drive_files:root_';

        const deleteResult = await redis.del(parentKey);

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Lỗi khi tải file lên' }, { status: 500 });
    }
} 