const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const PersonalDetail = require('../models/PersonalDetailSchema');
const Transaction = require('../models/TransactionsSchema');
const CreditCard = require('../models/CreditCardSchema');
const ChatMessage = require('../models/ChatMessageSchema');

// Delete user and all related data
router.delete('/deleteUser/:userID', async (req, res) => {
    const { userID } = req.params;
    const session = await mongoose.startSession();
    try {
        session.startTransaction(); // Start a transaction

        // Deleting all related data
        await Transaction.deleteMany({ userID: userID });
        await CreditCard.deleteMany({ userID: userID });
        await ChatMessage.deleteMany({ userID: userID });
        const deletedPersonalDetail = await PersonalDetail.findOneAndDelete({ userID: userID }, { session });

        if (!deletedPersonalDetail) {
            throw new Error('User not found');
        }

        // If everything was successful, commit the transaction
        await session.commitTransaction();
        res.sendStatus(200);
    } catch (error) {
        // If an error occurred, abort the transaction
        await session.abortTransaction();
        console.error('Error deleting user data:', error);
        res.status(500).json({ message: "Error deleting user data: " + error.message });
    } finally {
        // End the session whether it was successful or an error occurred
        session.endSession();
    }
});

module.exports = router;
