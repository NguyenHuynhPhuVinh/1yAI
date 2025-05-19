const { TaiKhoan } = require('../models');
const bcrypt = require('bcrypt');

// Lấy tất cả tài khoản (chỉ mật khẩu đã hash)
exports.getAllTaiKhoan = async (req, res) => {
    try {
        const taiKhoans = await TaiKhoan.findAll({
            attributes: { exclude: ['MatKhau'] } // Không trả về mật khẩu
        });
        res.status(200).json(taiKhoans);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh sách tài khoản", error: error.message });
    }
};

// Lấy tài khoản theo MaTK
exports.getTaiKhoanById = async (req, res) => {
    try {
        const taiKhoan = await TaiKhoan.findByPk(req.params.maTK, {
            attributes: { exclude: ['MatKhau'] }
        });
        if (!taiKhoan) {
            return res.status(404).json({ message: "Không tìm thấy tài khoản" });
        }
        res.status(200).json(taiKhoan);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy thông tin tài khoản", error: error.message });
    }
};

// Tạo tài khoản mới (Admin)
exports.createTaiKhoan = async (req, res) => {
    try {
        // TODO: Thêm validation
        const { MaTK, TenDangNhap, MatKhau, VaiTro, TrangThaiTK } = req.body;
        // Mật khẩu sẽ được hash tự động bởi hook trong model
        const newTaiKhoan = await TaiKhoan.create({ MaTK, TenDangNhap, MatKhau, VaiTro, TrangThaiTK });
        // Không trả về mật khẩu trong response
        const result = newTaiKhoan.toJSON();
        delete result.MatKhau;
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: "Lỗi tạo tài khoản", error: error.message });
    }
};

// Cập nhật tài khoản (Admin) - Cho phép cập nhật VaiTro, TrangThaiTK, và mật khẩu (nếu có)
exports.updateTaiKhoan = async (req, res) => {
    try {
        const maTK = req.params.maTK;
        const { VaiTro, TrangThaiTK, MatKhau } = req.body; // Chỉ cho phép cập nhật các trường này

        const updateData = {};
        if (VaiTro !== undefined) updateData.VaiTro = VaiTro;
        if (TrangThaiTK !== undefined) updateData.TrangThaiTK = TrangThaiTK;
        if (MatKhau) updateData.MatKhau = MatKhau; // Mật khẩu sẽ được hash tự động bởi hook

        const [updated] = await TaiKhoan.update(updateData, {
            where: { MaTK: maTK }
        });

        if (updated) {
            const updatedTaiKhoan = await TaiKhoan.findByPk(maTK, {
                attributes: { exclude: ['MatKhau'] }
            });
            res.status(200).json(updatedTaiKhoan);
        } else {
            res.status(404).json({ message: "Không tìm thấy tài khoản để cập nhật" });
        }
    } catch (error) {
        res.status(400).json({ message: "Lỗi cập nhật tài khoản", error: error.message });
    }
};

// Xóa tài khoản (Admin)
exports.deleteTaiKhoan = async (req, res) => {
    try {
        const maTK = req.params.maTK;
        const deleted = await TaiKhoan.destroy({
            where: { MaTK: maTK }
        });
        if (deleted) {
            res.status(204).send(); // No content
        } else {
            res.status(404).json({ message: "Không tìm thấy tài khoản để xóa" });
        }
    } catch (error) {
        res.status(500).json({ message: "Lỗi xóa tài khoản", error: error.message });
    }
};

// Thêm endpoint đăng nhập (ví dụ)
exports.login = async (req, res) => {
    try {
        const { TenDangNhap, MatKhau } = req.body;
        if (!TenDangNhap || !MatKhau) {
            return res.status(400).json({ message: "Vui lòng cung cấp tên đăng nhập và mật khẩu." });
        }

        const taiKhoan = await TaiKhoan.findOne({ where: { TenDangNhap: TenDangNhap } });

        if (!taiKhoan) {
            return res.status(401).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng." });
        }

        const isMatch = await taiKhoan.validPassword(MatKhau);

        if (!isMatch) {
            return res.status(401).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng." });
        }

        if (!taiKhoan.TrangThaiTK) {
            return res.status(403).json({ message: "Tài khoản đã bị khóa." });
        }

        // Đăng nhập thành công
        // TODO: Tạo và trả về token (JWT) ở đây
        const result = taiKhoan.toJSON();
        delete result.MatKhau; // Không trả về mật khẩu
        res.status(200).json({ message: "Đăng nhập thành công", user: result /*, token: your_jwt_token */ });

    } catch (error) {
        res.status(500).json({ message: "Lỗi đăng nhập", error: error.message });
    }
};
