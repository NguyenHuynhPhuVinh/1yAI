const { Ban } = require('../models');

// Lấy tất cả bàn
exports.getAllBan = async (req, res) => {
    try {
        const bans = await Ban.findAll();
        res.status(200).json(bans);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh sách bàn", error: error.message });
    }
};

// Lấy bàn theo BanSo
exports.getBanById = async (req, res) => {
    try {
        const ban = await Ban.findByPk(req.params.banSo);
        if (!ban) {
            return res.status(404).json({ message: "Không tìm thấy bàn" });
        }
        res.status(200).json(ban);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy thông tin bàn", error: error.message });
    }
};

// Tạo bàn mới (Admin)
exports.createBan = async (req, res) => {
    try {
        // TODO: Thêm validation
        const newBan = await Ban.create(req.body);
        res.status(201).json(newBan);
    } catch (error) {
        res.status(400).json({ message: "Lỗi tạo bàn", error: error.message });
    }
};

// Cập nhật trạng thái bàn (Admin)
exports.updateBan = async (req, res) => {
    try {
        const banSo = req.params.banSo;
        // Chỉ cho phép cập nhật TrangThaiBan
        const { TrangThaiBan } = req.body;
        if (TrangThaiBan === undefined) {
            return res.status(400).json({ message: "Vui lòng cung cấp TrangThaiBan." });
        }

        const [updated] = await Ban.update({ TrangThaiBan }, {
            where: { BanSo: banSo }
        });

        if (updated) {
            const updatedBan = await Ban.findByPk(banSo);
            res.status(200).json(updatedBan);
        } else {
            res.status(404).json({ message: "Không tìm thấy bàn để cập nhật" });
        }
    } catch (error) {
        res.status(400).json({ message: "Lỗi cập nhật bàn", error: error.message });
    }
};

// Xóa bàn (Admin)
exports.deleteBan = async (req, res) => {
    try {
        const banSo = req.params.banSo;
        // Lưu ý: Cần xử lý các Order liên quan đến bàn này trước khi xóa nếu có ràng buộc khóa ngoại
        const deleted = await Ban.destroy({
            where: { BanSo: banSo }
        });
        if (deleted) {
            res.status(204).send(); // No content
        } else {
            res.status(404).json({ message: "Không tìm thấy bàn để xóa" });
        }
    } catch (error) {
        // Bắt lỗi khóa ngoại nếu có
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({ message: "Không thể xóa bàn vì còn Order liên quan." });
        }
        res.status(500).json({ message: "Lỗi xóa bàn", error: error.message });
    }
};
