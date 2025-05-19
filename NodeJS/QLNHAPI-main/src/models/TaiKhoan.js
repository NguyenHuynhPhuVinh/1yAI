const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcrypt'); // Import bcrypt

const TaiKhoan = sequelize.define('TaiKhoan', {
    MaTK: {
        type: DataTypes.STRING(10), // Cập nhật theo sơ đồ mới
        primaryKey: true,
        // autoIncrement: true, // Bỏ autoIncrement vì là VARCHAR
        allowNull: false,
    },
    TenDangNhap: {
        type: DataTypes.STRING(30), // Cập nhật theo sơ đồ mới
        allowNull: false,
        unique: true, // Tên đăng nhập thường là duy nhất
    },
    MatKhau: {
        type: DataTypes.STRING(64), // Cập nhật theo sơ đồ mới
        allowNull: false,
    },
    VaiTro: {
        type: DataTypes.STRING(10), // Cập nhật theo sơ đồ mới
        allowNull: false,
    },
    TrangThaiTK: {
        type: DataTypes.BOOLEAN, // Giả định là Boolean (Active/Inactive)
        allowNull: false,
        defaultValue: true,
    },
    // Identifier_1 <pi> có vẻ là khóa ngoại, sẽ định nghĩa trong association
}, {
    tableName: 'TAIKHOAN', // Chỉ định tên bảng chính xác
    timestamps: false, // Không tự động thêm createdAt, updatedAt
    hooks: { // Hooks để hash mật khẩu trước khi lưu
        beforeCreate: async (taiKhoan) => {
            if (taiKhoan.MatKhau) {
                const salt = await bcrypt.genSalt(10);
                taiKhoan.MatKhau = await bcrypt.hash(taiKhoan.MatKhau, salt);
            }
        },
        beforeUpdate: async (taiKhoan) => {
            // Chỉ hash lại nếu mật khẩu thực sự thay đổi
            if (taiKhoan.changed('MatKhau')) {
                const salt = await bcrypt.genSalt(10);
                taiKhoan.MatKhau = await bcrypt.hash(taiKhoan.MatKhau, salt);
            }
        }
    }
});

// Thêm phương thức kiểm tra mật khẩu vào prototype
TaiKhoan.prototype.validPassword = async function (password) {
    return await bcrypt.compare(password, this.MatKhau);
};

module.exports = TaiKhoan;
