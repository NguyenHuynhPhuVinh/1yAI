const { MonAn } = require('../models'); // Import từ index của models

// Lấy tất cả món ăn
exports.getAllMonAn = async (req, res) => {
    try {
        const monAns = await MonAn.findAll();
        res.status(200).json(monAns);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh sách món ăn", error: error.message });
    }
};

// Lấy món ăn theo MaMon
exports.getMonAnById = async (req, res) => {
    try {
        const monAn = await MonAn.findByPk(req.params.maMon);
        if (!monAn) {
            return res.status(404).json({ message: "Không tìm thấy món ăn" });
        }
        res.status(200).json(monAn);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy thông tin món ăn", error: error.message });
    }
};

// Tạo món ăn mới
exports.createMonAn = async (req, res) => {
    try {
        // TODO: Thêm validation cho req.body
        const newMonAn = await MonAn.create(req.body);
        res.status(201).json(newMonAn);
    } catch (error) {
        res.status(400).json({ message: "Lỗi tạo món ăn", error: error.message });
    }
};

// Cập nhật món ăn
exports.updateMonAn = async (req, res) => {
    try {
        const maMon = req.params.maMon;
        const [updated] = await MonAn.update(req.body, {
            where: { MaMon: maMon }
        });
        if (updated) {
            const updatedMonAn = await MonAn.findByPk(maMon);
            res.status(200).json(updatedMonAn);
        } else {
            res.status(404).json({ message: "Không tìm thấy món ăn để cập nhật" });
        }
    } catch (error) {
        res.status(400).json({ message: "Lỗi cập nhật món ăn", error: error.message });
    }
};

// Xóa món ăn
exports.deleteMonAn = async (req, res) => {
    try {
        const maMon = req.params.maMon;
        const deleted = await MonAn.destroy({
            where: { MaMon: maMon }
        });
        if (deleted) {
            res.status(204).send(); // No content
        } else {
            res.status(404).json({ message: "Không tìm thấy món ăn để xóa" });
        }
    } catch (error) {
        res.status(500).json({ message: "Lỗi xóa món ăn", error: error.message });
    }
};
