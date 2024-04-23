const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
    userID: {
        type: String,
        ref: 'PersonalDetail',
        required: true
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ChatSession', chatSessionSchema);
