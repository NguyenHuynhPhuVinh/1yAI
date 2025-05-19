// utils/saveUtils.js
const crypto = require('crypto');
const JSZip = require('jszip');

// Tạo mã save ngẫu nhiên
exports.generateSaveCode = async () => {
    // Tạo một chuỗi alphanumeric ngẫu nhiên 8 ký tự
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let saveCode = '';

    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        saveCode += chars.charAt(randomIndex);
    }

    // Kiểm tra xem mã đã tồn tại chưa
    const SaveGame = require('../models/SaveGame');
    const existingSave = await SaveGame.findOne({ saveCode });

    if (existingSave) {
        // Nếu đã tồn tại, tạo mã khác đệ quy
        return exports.generateSaveCode();
    }

    return saveCode;
};

// Trích xuất metadata từ save file
exports.extractMetadata = async (buffer) => {
    try {
        const zip = await JSZip.loadAsync(buffer);
        const headerFile = zip.file('saveHeader');

        if (!headerFile) {
            return {}; // Không có metadata
        }

        const headerContent = await headerFile.async('string');
        const headerData = JSON.parse(headerContent);

        return {
            companyName: headerData.companyName || 'Unknown Company',
            level: headerData.level || 1,
            // Có thể thêm các metadata khác
        };
    } catch (error) {
        console.error('Error extracting metadata:', error);
        return {}; // Trả về object rỗng nếu có lỗi
    }
};