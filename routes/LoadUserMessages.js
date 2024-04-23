const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessageSchema');  // Adjust the path as necessary

// Fetch all messages for a specific user
router.get('/messages/:userID', async (req, res) => {
    try {
        const { userID } = req.params;
        const messages = await ChatMessage.find({ userID }).sort({ timestamp: -1 }); // Sort by latest first
        console.log("Existing Chat Messages Loaded Successfully")
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages', details: error.message });
    }
});

module.exports = router;
