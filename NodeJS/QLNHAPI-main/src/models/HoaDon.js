const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const HoaDon = sequelize.define('HoaDon', {
    MaHoaDon: {
        type: DataTypes.STRING(10), // Cập nhật theo sơ đồ mới
        primaryKey: true,
        // autoIncrement: true, // Bỏ autoIncrement vì là VARCHAR
        allowNull: false,
    },
    NgayLap: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    TongTien: {
        type: DataTypes.DECIMAL(10, 2), // Giả định kiểu DECIMAL giống TongTien trong Order
        allowNull: false,
        defaultValue: 0.00,
    },
    PhuongThucTT: {
        type: DataTypes.STRING(20), // Cập nhật theo sơ đồ mới
        allowNull: true,
    },
    SoOrder: { // Khóa ngoại liên kết với bảng Order
        type: DataTypes.INTEGER,
        allowNull: false, // Giả định một Hóa đơn phải thuộc về một Order
        unique: true, // Quan hệ 1-1, mỗi Order chỉ có 1 Hóa đơn
        references: {
            model: 'ORDER', // Tên bảng tham chiếu
            key: 'SoOrder', // Khóa chính của bảng Order
        }
    },
    // Identifier_1 <pi> là khóa chính MaHoaDon
}, {
    tableName: 'HOADON', // Chỉ định tên bảng chính xác
    timestamps: false, // Không tự động thêm createdAt, updatedAt
});

module.exports = HoaDon;
