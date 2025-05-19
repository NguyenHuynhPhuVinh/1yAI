// routes/saveRoutes.js
const express = require('express');
const router = express.Router();
const saveController = require('../controllers/saveController');

router.post('/upload', saveController.uploadSave);
router.get('/download/:saveCode', saveController.downloadSave);

module.exports = router;