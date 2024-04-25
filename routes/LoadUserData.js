const express = require('express');
const PersonalDetail = require('../models/PersonalDetailSchema');
const CreditCard = require('../models/CreditCardSchema');
const Transaction = require('../models/TransactionsSchema');
const ChatMessage = require('../models/ChatMessageSchema');


const router = express.Router();

// Fetch user data endpoint
router.get('/userData', async (req, res) => {
    const { email } = req.query;

    try {
        const userDetails = await PersonalDetail.findOne({ email });
        if (!userDetails) {
            return res.status(404).send('User not found.');
        }

        const creditCards = await CreditCard.find({ userID: userDetails.userID });
        const transactions = await Transaction.find({ userID: userDetails.userID })
            .sort({ date: -1 }) // Sort by date in descending order
            .limit(20);

        const chatMessages = await ChatMessage.find({ userID: userDetails.userID })
            .sort({ timestamp: -1 })

        res.json({
            personalDetails: userDetails,
            creditCards: creditCards,
            transactions: transactions,
            chatMessages: chatMessages
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching user data');
    }
});

module.exports = router;
