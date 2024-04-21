const ChatMessageSchema = new mongoose.Schema({
    messageType: {
        type: String,
        required: true,
        enum: ['user', 'assistant', 'insight']  // Added an enum to specify the type of message
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
