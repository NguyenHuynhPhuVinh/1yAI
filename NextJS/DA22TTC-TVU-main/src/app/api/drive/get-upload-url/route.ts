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
        const origin = request.headers.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL ?? '*';

        const { fileName, mimeType, parentId } = await request.json();

        // Xóa cache của thư mục cha
        const parentKey = parentId
            ? `drive_files:${parentId}_`
            : 'drive_files:root_';
        await redis.del(parentKey);

        const fileMetadata = {
            name: fileName,
            parents: [parentId || '1YAMjIdiDdhc5cjR7etXIpNoPW26TV1Yf'],
        };

        // Tạo resumable upload session
        const accessToken = await auth.getAccessToken();
        if (!accessToken) {
            throw new Error('Không lấy được access token');
        }

        const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Origin': origin
            },
            body: JSON.stringify(fileMetadata)
        });

        const uploadUrl = response.headers.get('Location');
        if (!uploadUrl) {
            throw new Error('Không nhận được upload URL');
        }

        return new NextResponse(JSON.stringify({ uploadUrl }), {
            headers: {
                'Access-Control-Allow-Origin': origin,
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Credentials': 'true',
            }
        });
    } catch (error) {
        console.error('Error getting upload URL:', error);
        return NextResponse.json({ error: 'Lỗi khi tạo URL upload' }, { status: 500 });
    }
}

export async function OPTIONS(request: Request) {
    const origin = request.headers.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL ?? '*';

    return new NextResponse(null, {
        headers: {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true',
        },
    });
}
