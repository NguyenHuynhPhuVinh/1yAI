const express = require('express');
const { connectDB, sequelize } = require('./src/config/database');
const db = require('./src/models'); // Import các model đã định nghĩa quan hệ

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware để parse JSON request body
app.use(express.json());

// Kết nối cơ sở dữ liệu
connectDB();

// Đồng bộ model với database (chỉ nên dùng trong dev, hoặc dùng migrations cho production)
// Lưu ý: { force: true } sẽ xóa và tạo lại bảng. Dùng { alter: true } để cập nhật bảng.
sequelize.sync({ alter: true }).then(() => {
    console.log('Đã đồng bộ model với database (alter: true).');
}).catch(err => {
    console.error('Lỗi đồng bộ database:', err);
});


// --- Định nghĩa Routes ---
// Ví dụ route cơ bản
app.get('/', (req, res) => {
    res.send('Chào mừng đến với API Quản lý Nhà Hàng!');
});

// --- Sử dụng Routes ---
const authRoutes = require('./src/routes/authRoutes');
const monAnRoutes = require('./src/routes/monAnRoutes');
const taiKhoanRoutes = require('./src/routes/taiKhoanRoutes');
const banRoutes = require('./src/routes/banRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const hoaDonRoutes = require('./src/routes/hoaDonRoutes');

app.use('/api/auth', authRoutes);         // Routes xác thực (login,...)
app.use('/api/monan', monAnRoutes);       // Routes quản lý món ăn
app.use('/api/taikhoan', taiKhoanRoutes); // Routes quản lý tài khoản (Admin)
app.use('/api/ban', banRoutes);           // Routes quản lý bàn (Admin)
app.use('/api/order', orderRoutes);       // Routes quản lý order (Nhân viên/Admin)
app.use('/api/hoadon', hoaDonRoutes);     // Routes quản lý hóa đơn (Nhân viên/Admin)


// Khởi động server
app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});

module.exports = app; // Export app cho testing (nếu cần)
