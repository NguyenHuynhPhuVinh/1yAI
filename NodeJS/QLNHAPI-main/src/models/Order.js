const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
    SoOrder: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Giả định đây là khóa tự tăng
        allowNull: false,
    },
    ThoiGianOrder: {
        type: DataTypes.DATE, // Sequelize DATE tương ứng với DATETIME trong MySQL
        allowNull: false,
        defaultValue: DataTypes.NOW, // Tự động lấy thời gian hiện tại khi tạo
    },
    TongTien: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
    },
    TrangThai: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Giả định mặc định là false (chưa hoàn thành/thanh toán)
    },
    BanSo: { // Khóa ngoại liên kết với bảng Ban
        type: DataTypes.INTEGER,
        allowNull: false, // Giả định một Order phải thuộc về một Bàn
        references: {
            model: 'BAN', // Tên bảng tham chiếu
            key: 'BanSo', // Khóa chính của bảng Ban
        }
    },
    // Identifier_1 <pi> là khóa chính SoOrder
}, {
    tableName: 'ORDER', // Chỉ định tên bảng chính xác
    timestamps: false, // Không tự động thêm createdAt, updatedAt
});

module.exports = Order;
