// src/app/api/drive/download-folder/route.ts
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}'),
    scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/drive.file'
    ],
});

const drive = google.drive({ version: 'v3', auth });

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get('folderId');
    const fileId = searchParams.get('fileId');
    const origin = request.headers.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL ?? '*';

    if (!folderId && !fileId) {
        return NextResponse.json({ error: 'Folder ID or File ID is required' }, {
            status: 400,
            headers: {
                'Access-Control-Allow-Origin': origin,
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
    }

    try {
        if (folderId) {
            // Lấy danh sách files
            const response = await drive.files.list({
                q: `'${folderId}' in parents and trashed = false`,
                fields: 'files(id, name, mimeType)',
            });

            return NextResponse.json({ files: response.data.files }, {
                headers: {
                    'Access-Control-Allow-Origin': origin,
                    'Access-Control-Allow-Methods': 'GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            });
        } else if (fileId) {
            // Lấy từng file
            const response = await drive.files.get(
                { fileId: fileId, alt: 'media' },
                { responseType: 'arraybuffer' }
            );

            return new NextResponse(Buffer.from(response.data as unknown as ArrayBuffer), {
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'Access-Control-Allow-Origin': origin,
                    'Access-Control-Allow-Methods': 'GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            });
        }
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Error processing request' }, {
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': origin,
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
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