const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const MonAn = require('./MonAn');
const Order = require('./Order');

const ChiTietOrder = sequelize.define('ChiTietOrder', {
    // Sequelize sẽ tự động tạo khóa ngoại MaMon và SoOrder khi định nghĩa association
    SoLuong: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    ThanhTien: {
        type: DataTypes.DECIMAL(10, 2), // Cập nhật theo sơ đồ mới DECIMAL(1) -> DECIMAL(1, 0)
        allowNull: false,
    },
}, {
    tableName: 'CHITIET_ORDER', // Chỉ định tên bảng chính xác
    timestamps: false, // Không tự động thêm createdAt, updatedAt
});

// Định nghĩa quan hệ Many-to-Many ở đây hoặc trong file index.js tập trung
// MonAn.belongsToMany(Order, { through: ChiTietOrder, foreignKey: 'MaMon' });
// Order.belongsToMany(MonAn, { through: ChiTietOrder, foreignKey: 'SoOrder' });

module.exports = ChiTietOrder;
