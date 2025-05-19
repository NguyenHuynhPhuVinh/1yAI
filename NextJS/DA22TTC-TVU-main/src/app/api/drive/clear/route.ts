import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}'),
    scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

export async function DELETE() {
    try {
        // Chỉ lấy các file trong thùng rác
        const trashedResponse = await drive.files.list({
            q: "trashed = true",
            fields: 'files(id, name)',
            pageSize: 1000
        });

        const trashedFiles = trashedResponse.data.files || [];
        const errors: any[] = [];

        if (trashedFiles.length > 0) {
            // Xử lý song song, mỗi lần 10 file
            const batchSize = 10;
            for (let i = 0; i < trashedFiles.length; i += batchSize) {
                const batch = trashedFiles.slice(i, i + batchSize);
                await Promise.all(
                    batch.map(async (file) => {
                        if (file.id) {
                            try {
                                await drive.files.delete({
                                    fileId: file.id
                                }, {
                                    timeout: 30000
                                });
                            } catch (err: any) {
                                console.error(`Lỗi khi xóa file ${file.name}:`, err.message);
                                errors.push({
                                    fileId: file.id,
                                    fileName: file.name,
                                    error: err.message
                                });
                            }
                        }
                    })
                );

                // Log tiến trình
                console.log(`Đã xử lý ${i + batch.length}/${trashedFiles.length} files`);
            }
        }

        // Xóa tất cả cache Redis
        await redis.flushall();

        return NextResponse.json({
            message: errors.length > 0 ? 'Xóa dữ liệu một phần thành công' : 'Đã xóa thành công tất cả file trong thùng rác',
            deletedCount: trashedFiles.length - errors.length,
            trashedDeletedCount: trashedFiles.length,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error: any) {
        console.error('Lỗi khi xóa dữ liệu:', error);
        return NextResponse.json(
            {
                error: 'Lỗi khi xóa dữ liệu',
                details: error.message
            },
            { status: 500 }
        );
    }
} 