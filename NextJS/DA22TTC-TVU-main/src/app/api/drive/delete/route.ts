import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}'),
    scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const fileId = searchParams.get('fileId');

        if (!fileId) {
            return NextResponse.json(
                { error: 'File ID is required' },
                { status: 400 }
            );
        }

        // Xóa file vĩnh viễn
        await drive.files.delete({
            fileId: fileId,
        });

        // Xóa cache liên quan
        const keys = await redis.keys('drive_files:*');
        if (keys.length > 0) {
            await redis.del(keys);
        }

        return NextResponse.json(
            { message: 'File deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting file:', error);
        return NextResponse.json(
            { error: 'Error deleting file' },
            { status: 500 }
        );
    }
} 