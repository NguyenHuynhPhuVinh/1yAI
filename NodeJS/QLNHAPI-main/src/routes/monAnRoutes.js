const express = require('express');
const router = express.Router();
const monAnController = require('../controllers/monAnController');

// Định nghĩa các routes cho MonAn
router.get('/', monAnController.getAllMonAn);          // GET /api/monan
router.post('/', monAnController.createMonAn);         // POST /api/monan
router.get('/:maMon', monAnController.getMonAnById);   // GET /api/monan/:maMon
router.put('/:maMon', monAnController.updateMonAn);    // PUT /api/monan/:maMon
router.delete('/:maMon', monAnController.deleteMonAn); // DELETE /api/monan/:maMon

module.exports = router;
