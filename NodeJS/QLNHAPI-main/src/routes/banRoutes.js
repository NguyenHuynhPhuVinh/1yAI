const express = require('express');
const router = express.Router();
const banController = require('../controllers/banController');
// TODO: Thêm middleware xác thực và phân quyền (ví dụ: isAdmin)

// Routes cho quản lý bàn (yêu cầu quyền Admin)
// router.use(isAdmin);
router.get('/', banController.getAllBan);          // GET /api/ban
router.post('/', banController.createBan);         // POST /api/ban
router.get('/:banSo', banController.getBanById);   // GET /api/ban/:banSo
router.put('/:banSo', banController.updateBan);    // PUT /api/ban/:banSo (Chỉ cập nhật trạng thái)
router.delete('/:banSo', banController.deleteBan); // DELETE /api/ban/:banSo

module.exports = router;
