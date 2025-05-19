/* eslint-disable @typescript-eslint/no-explicit-any */
import { google } from 'googleapis';
import { Readable } from 'stream';

export class GoogleDriveService {
  private static driveClient = google.drive({
    version: 'v3',
    auth: new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    }),
  });

  private static bufferToStream(buffer: Buffer) {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
  }

  static async uploadFile(
    file: Buffer, 
    mimeType: string, 
    userId: number, 
    type: 'avatar' | 'cover' | 'character-avatar' | 'chat',
    storyId: number | null,
    characterId?: number
  ) {
    try {
      // Đảm bảo mimeType luôn đúng định dạng
      const normalizedMimeType = mimeType.startsWith('data:') 
        ? 'image/jpeg'  // Ảnh từ AI luôn là JPEG
        : mimeType;
      
      const extension = normalizedMimeType === 'image/jpeg' ? '.jpg' : 
                       normalizedMimeType === 'image/png' ? '.png' : '.gif';
      
      // Tạo tên file dựa trên loại
      const fileName = type === 'avatar' ? `avatar_${userId}${extension}` :
                      type === 'cover' ? `cover_story_${storyId}${extension}` :
                      type === 'chat' ? `chat_${userId}_${storyId}_${Date.now()}${extension}` :
                      `character_${characterId}_story_${storyId}${extension}`;
        
      // Kiểm tra file tồn tại
      const existingFiles = await this.driveClient.files.list({
        q: `name = '${fileName}' and '${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents and trashed = false`,
        fields: 'files(id, name, mimeType)',
      });

      let fileId: string;

      if (existingFiles.data.files && existingFiles.data.files.length > 0) {
        const existingFile = existingFiles.data.files[0];
        fileId = existingFile.id!;

        // Luôn cập nhật file thay vì kiểm tra mimeType
        await this.driveClient.files.update({
          fileId: fileId,
          media: {
            mimeType: normalizedMimeType,
            body: this.bufferToStream(file),
          },
        });
      } else {
        const newFile = await this.createFile(file, normalizedMimeType, fileName);
        fileId = newFile.id!;
      }

      await this.driveClient.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      // Thêm timestamp vào URL để tránh cache
      const timestamp = Date.now();
      const directLink = `https://drive.google.com/uc?export=view&id=${fileId}&t=${timestamp}`;

      return {
        fileId,
        directLink,
      };
    } catch (error) {
      console.error('Error uploading to Google Drive:', error);
      throw new Error('Lỗi khi tải file lên Google Drive');
    }
  }

  private static async createFile(file: Buffer, mimeType: string, fileName: string) {
    const response = await this.driveClient.files.create({
      requestBody: {
        name: fileName,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID as string],
      },
      media: {
        mimeType: mimeType,
        body: this.bufferToStream(file),
      },
      fields: 'id',
    });

    return response.data;
  }

  static async deleteFile(fileId: string) {
    try {
      // Thử xóa file
      await this.driveClient.files.delete({
        fileId: fileId,
      });

      // Thêm một khoảng thời gian chờ để đảm bảo file đã được xóa hoàn toàn
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error: any) {
      // Kiểm tra nếu lỗi là 404 Not Found
      if (error.code === 404) {
        console.warn(`File not found on Google Drive: ${fileId}`);
        return;
      }
      console.error('Error deleting from Google Drive:', error);
      throw new Error('Lỗi khi xóa file từ Google Drive');
    }
  }
} 