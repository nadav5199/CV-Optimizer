const mongoose = require('mongoose');

const mainCvSchema = new mongoose.Schema({
    cvUrl: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MainCv', mainCvSchema);
