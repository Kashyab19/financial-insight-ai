const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userID: {
        type: String,
        ref: 'PersonalDetail',
        required: true
    },
    cardID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CreditCard',
        required: true
    },
    transactionID:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    merchant: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
