const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    query: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports =  mongoose.model('ChatMessage', ChatMessageSchema);
