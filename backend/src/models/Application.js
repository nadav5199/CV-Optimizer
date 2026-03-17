const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    description: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    cv: {
        type: Buffer
    }
});
module.exports = mongoose.model('Application', applicationSchema);