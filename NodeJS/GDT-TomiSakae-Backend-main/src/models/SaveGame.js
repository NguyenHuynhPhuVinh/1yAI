// models/SaveGame.js
const mongoose = require('mongoose');

const SaveGameSchema = new mongoose.Schema({
    saveCode: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    saveData: {
        type: Buffer,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '90d' // Tự động xóa sau 90 ngày
    },
    metadata: {
        companyName: String,
        gameCount: Number,
        cashAmount: Number,
        weekNumber: Number,
        level: Number
    }
});

module.exports = mongoose.model('SaveGame', SaveGameSchema);