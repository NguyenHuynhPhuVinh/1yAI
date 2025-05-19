const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MonAn = sequelize.define('MonAn', {
    MaMon: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false,
    },
    TenMon: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    Gia: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    MoTa: {
        type: DataTypes.STRING(200),
        allowNull: true, // Cho phép null dựa trên sơ đồ không ghi rõ
    },
    HinhAnh: {
        type: DataTypes.STRING(100),
        allowNull: true, // Cho phép null
    },
    TrangThai: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true, // Giả định mặc định là true (đang bán)
    },
}, {
    tableName: 'MONAN', // Chỉ định tên bảng chính xác
    timestamps: false, // Không tự động thêm createdAt, updatedAt
});

module.exports = MonAn;
