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
    const origin = request.headers.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL ?? '*';
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
        return NextResponse.json({ error: 'File ID is required' }, {
            status: 400,
            headers: {
                'Access-Control-Allow-Origin': origin,
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Credentials': 'true',
            }
        });
    }

    try {
        const file = await drive.files.get({
            fileId: fileId,
            fields: 'webContentLink, name',
        });

        if (!file.data.webContentLink) {
            return NextResponse.json({ error: 'Download link not available' }, {
                status: 404,
                headers: {
                    'Access-Control-Allow-Origin': origin,
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    'Access-Control-Allow-Credentials': 'true',
                }
            });
        }

        return NextResponse.json({
            downloadUrl: file.data.webContentLink,
            fileName: file.data.name
        }, {
            headers: {
                'Access-Control-Allow-Origin': origin,
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Credentials': 'true',
            }
        });
    } catch (error) {
        console.error('Error getting download link:', error);
        return NextResponse.json({ error: 'Error getting download link' }, {
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': origin,
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Credentials': 'true',
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