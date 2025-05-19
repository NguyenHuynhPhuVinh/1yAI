const express = require('express');
const router = express.Router();
const taiKhoanController = require('../controllers/taiKhoanController');

// Route đăng nhập
router.post('/login', taiKhoanController.login); // POST /api/auth/login

// TODO: Thêm các route khác liên quan đến xác thực (đăng ký nếu cần, quên mật khẩu,...)

module.exports = router;
