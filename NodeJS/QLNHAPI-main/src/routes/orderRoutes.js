const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
// TODO: Thêm middleware xác thực (ví dụ: isNhanVienOrAdmin)

// Routes cho quản lý Order (yêu cầu quyền Nhân viên hoặc Admin)
// router.use(isNhanVienOrAdmin);
router.post('/', orderController.createOrder);         // POST /api/order (Tạo đơn đặt món)
router.get('/', orderController.getAllOrders);         // GET /api/order (Lấy tất cả order)
router.get('/:soOrder', orderController.getOrderById);   // GET /api/order/:soOrder (Lấy order theo ID)
router.put('/:soOrder/thanh-toan', orderController.thanhToanOrder); // PUT /api/order/:soOrder/thanh-toan (Thanh toán order)

// TODO: Thêm các routes khác: PUT /:soOrder (cập nhật), DELETE /:soOrder

module.exports = router;
