const mongoose = require('mongoose');

const CreditCardSchema = new mongoose.Schema({
    userID: {
        type: String,
        ref: 'PersonalDetail',
        required: true
    },
    cardType: {
        type: String,
        required: true
    },
    cardDetails: {
        cardNumber: String,
        creditLimit: Number,
        balance: Number,
    }
});

module.exports = mongoose.model('CreditCard', CreditCardSchema);
