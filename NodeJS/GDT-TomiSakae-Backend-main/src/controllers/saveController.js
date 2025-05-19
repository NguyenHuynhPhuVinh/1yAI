// controllers/saveController.js
const SaveGame = require('../models/SaveGame');
const { generateSaveCode, extractMetadata } = require('../utils/saveUtils');
const multer = require('multer');
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });

exports.uploadSave = [
    upload.single('saveFile'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No save file uploaded' });
            }

            // Tạo mã save code ngẫu nhiên 8 ký tự
            const saveCode = await generateSaveCode();

            // Trích xuất metadata từ save file (nếu cần)
            const metadata = await extractMetadata(req.file.buffer);

            // Lưu vào database
            const savegame = new SaveGame({
                saveCode,
                saveData: req.file.buffer,
                metadata
            });

            await savegame.save();

            return res.status(201).json({ saveCode });
        } catch (error) {
            console.error('Upload error:', error);
            return res.status(500).json({ error: 'Server error' });
        }
    }
];

exports.downloadSave = async (req, res) => {
    try {
        const { saveCode } = req.params;

        if (!saveCode || saveCode.length !== 8) {
            return res.status(400).json({ error: 'Invalid save code' });
        }

        const savegame = await SaveGame.findOne({ saveCode });

        if (!savegame) {
            return res.status(404).json({ error: 'Save not found' });
        }

        // Trả về file dạng download
        res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename="GDT-${saveCode}.sav"`
        });

        return res.send(savegame.saveData);
    } catch (error) {
        console.error('Download error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};