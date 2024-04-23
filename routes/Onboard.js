// onboard.js

const express = require('express');
const router = express.Router();
const faker = require('@faker-js/faker').faker;
const PersonalDetail = require('../models/PersonalDetailSchema'); // Adjust path as needed
const CreditCard = require('../models/CreditCardSchema'); // Adjust path as needed
const Transaction = require('../models/TransactionsSchema'); // Adjust path as needed
const { v4: uuidv4 } = require('uuid');

// POST route for onboarding
router.post('/onboard', async (req, res) => {
    const { firstName, lastName, dob, last4SSN, email } = req.body;

    try {
        // Create or update the personal detail
        const userId = uuidv4(); // Make sure this is correctly generating a UUID

        let personalDetail = await PersonalDetail.findOneAndUpdate(
            { email: req.body.email },
            {
                userID: userId, // Ensure this is correctly included
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                dob: req.body.dob,
                last4SSN: req.body.last4SSN,
                email: req.body.email
            },
            { new: true, upsert: true }
        );

        // Generate 2 mock credit cards and save them
        for (let i = 0; i < 5; i++) {
            const creditCard = new CreditCard({
                userID: userId,
                cardType: ['Visa', 'MasterCard', 'Amex'][Math.floor(Math.random() * 3)],
                cardDetails: {
                    cardNumber: faker.finance.creditCardNumber(),
                    creditLimit: faker.finance.amount({min: 1000, max: 5000}),
                    balance: faker.finance.amount({min: 0, max: 1000}),
                }
            });

            await creditCard.save();

            // For each credit card, generate 10 transactions and save them
            for (let j = 0; j < 1; j++) {
                const transactionId = uuidv4();
                const transaction = new Transaction({
                    userID: userId,
                    transactionID: transactionId,
                    cardID: creditCard._id,
                    date: faker.date.between('2020-04-14', '2024-04-14'),
                    amount: faker.finance.amount(5, 500),
                    merchant: "Merchant",
                    category: ['Groceries', 'Utilities', 'Dining', 'Shopping', 'Entertainment'][Math.floor(Math.random() * 3)],
                });

                await transaction.save();
            }
        }

        res.status(201).json({ message: 'Onboarding completed successfully.', userId: personalDetail._id });
    } catch (error) {
        console.error('Onboarding error:', error);
        res.status(500).json({ message: 'Server error during onboarding' });
    }
});

module.exports = router;
