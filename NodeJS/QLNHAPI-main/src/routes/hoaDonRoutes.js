const express = require('express');
const router = express.Router();
const hoaDonController = require('../controllers/hoaDonController');
// TODO: Thêm middleware xác thực (ví dụ: isNhanVienOrAdmin)

// Routes cho quản lý Hóa Đơn (yêu cầu quyền Nhân viên hoặc Admin)
// router.use(isNhanVienOrAdmin);
router.get('/', hoaDonController.getAllHoaDon);          // GET /api/hoadon
router.post('/', hoaDonController.createHoaDon);         // POST /api/hoadon
router.get('/:maHoaDon', hoaDonController.getHoaDonById);   // GET /api/hoadon/:maHoaDon

// TODO: Thêm các routes khác: PUT /:maHoaDon, DELETE /:maHoaDon (nếu cần)

module.exports = router;
