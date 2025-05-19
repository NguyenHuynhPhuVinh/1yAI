import { google, drive_v3 } from 'googleapis';
import { NextResponse } from 'next/server';
import Redis from 'ioredis';

// Khởi tạo Redis client
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}'),
    scopes: ['https://www.googleapis.com/auth/drive'], // Sử dụng phạm vi rộng hơn
});

const drive = google.drive({ version: 'v3', auth });

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const folderId = searchParams.get('folderId');
        const searchTerm = searchParams.get('q');

        // Tạo cache key dựa trên tham số
        const cacheKey = `drive_files:${folderId || 'root'}_${searchTerm || ''}`;

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

        let query = '';

        if (searchTerm) {
            // Tìm kiếm trong toàn bộ Drive với điều kiện không phải là file trong thùng rác
            query = `name contains '${searchTerm}' and trashed = false`;
        } else if (folderId) {
            // Nếu không có từ khóa tìm kiếm, hiển thị nội dung thư mục hiện tại
            query = `'${folderId}' in parents and trashed = false`;
        } else {
            // Hiển thị thư mục gốc
            query = `'1YAMjIdiDdhc5cjR7etXIpNoPW26TV1Yf' in parents and trashed = false`;
        }

        const response = await drive.files.list({
            q: query,
            fields: 'files(id, name, mimeType, size, createdTime, modifiedTime, parents)',
            orderBy: 'modifiedTime desc',
            pageSize: 1000
        } as drive_v3.Params$Resource$Files$List);

        const result = {
            files: response.data.files,
            totalFiles: response.data.files?.length || 0
        };

        // Lưu vào cache
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
            { error: 'Lỗi khi lấy danh sách thư mục hoặc tệp' },
            { status: 500 }
        );
    }
}