const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Ban = sequelize.define('Ban', {
    BanSo: {
        type: DataTypes.INTEGER, // Giả định là Integer dựa trên tên 'So'
        primaryKey: true,
        allowNull: false,
        // Không autoIncrement vì có thể là số bàn cố định
    },
    TrangThaiBan: {
        type: DataTypes.STRING(20), // Cập nhật độ dài theo sơ đồ mới
        allowNull: true, // Cho phép null
    },
    // Identifier_1 <pi> có vẻ là khóa ngoại, sẽ định nghĩa trong association
}, {
    tableName: 'BAN', // Chỉ định tên bảng chính xác
    timestamps: false, // Không tự động thêm createdAt, updatedAt
});

module.exports = Ban;
