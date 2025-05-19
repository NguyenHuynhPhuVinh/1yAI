const express = require('express');
const router = express.Router();
const taiKhoanController = require('../controllers/taiKhoanController');
// TODO: Thêm middleware xác thực và phân quyền (ví dụ: isAdmin)

// Routes cho quản lý tài khoản (yêu cầu quyền Admin)
// router.use(isAdmin); // Áp dụng middleware kiểm tra quyền Admin cho tất cả route bên dưới
router.get('/', taiKhoanController.getAllTaiKhoan);          // GET /api/taikhoan
router.post('/', taiKhoanController.createTaiKhoan);         // POST /api/taikhoan
router.get('/:maTK', taiKhoanController.getTaiKhoanById);   // GET /api/taikhoan/:maTK
router.put('/:maTK', taiKhoanController.updateTaiKhoan);    // PUT /api/taikhoan/:maTK
router.delete('/:maTK', taiKhoanController.deleteTaiKhoan); // DELETE /api/taikhoan/:maTK

module.exports = router;
