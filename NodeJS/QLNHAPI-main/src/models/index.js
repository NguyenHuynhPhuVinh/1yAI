const { sequelize } = require('../config/database');
const MonAn = require('./MonAn');
const Order = require('./Order');
const Ban = require('./Ban');
const HoaDon = require('./HoaDon');
const TaiKhoan = require('./TaiKhoan');
const ChiTietOrder = require('./ChiTietOrder');

// Định nghĩa các mối quan hệ

// 1. Ban - Order (One-to-Many)
Ban.hasMany(Order, { foreignKey: 'BanSo', as: 'orders' });
Order.belongsTo(Ban, { foreignKey: 'BanSo', as: 'ban' });

// 2. Order - HoaDon (One-to-One)
Order.hasOne(HoaDon, { foreignKey: 'SoOrder', as: 'hoaDon' });
HoaDon.belongsTo(Order, { foreignKey: 'SoOrder', as: 'order' });

// 3. MonAn - Order (Many-to-Many through ChiTietOrder)
MonAn.belongsToMany(Order, {
    through: ChiTietOrder,
    foreignKey: 'MaMon', // Khóa ngoại trong bảng ChiTietOrder trỏ đến MonAn
    otherKey: 'SoOrder', // Khóa ngoại trong bảng ChiTietOrder trỏ đến Order
    as: 'orders'
});
Order.belongsToMany(MonAn, {
    through: ChiTietOrder,
    foreignKey: 'SoOrder', // Khóa ngoại trong bảng ChiTietOrder trỏ đến Order
    otherKey: 'MaMon', // Khóa ngoại trong bảng ChiTietOrder trỏ đến MonAn
    as: 'monAns'
});

// Quan hệ trực tiếp giữa ChiTietOrder với MonAn và Order (nếu cần truy cập trực tiếp)
ChiTietOrder.belongsTo(MonAn, { foreignKey: 'MaMon' });
MonAn.hasMany(ChiTietOrder, { foreignKey: 'MaMon' });

ChiTietOrder.belongsTo(Order, { foreignKey: 'SoOrder' });
Order.hasMany(ChiTietOrder, { foreignKey: 'SoOrder' });


// Các quan hệ khác có thể cần dựa trên logic nghiệp vụ (ví dụ: TaiKhoan tạo Order,...)
// Tạm thời chưa định nghĩa các quan hệ liên quan đến TaiKhoan vì sơ đồ không thể hiện rõ
// TaiKhoan.hasMany(Order, { foreignKey: 'MaTK' }); // Ví dụ nếu cần
// Order.belongsTo(TaiKhoan, { foreignKey: 'MaTK' }); // Ví dụ nếu cần


const db = {
    sequelize,
    MonAn,
    Order,
    Ban,
    HoaDon,
    TaiKhoan,
    ChiTietOrder,
};

module.exports = db;
