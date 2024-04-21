const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const faker = require('@faker-js/faker').faker; // Note the path change for faker-js

// Assuming these are your Mongoose models
const PersonalDetail = require('../models/PersonalDetailSchema');
const CreditCard = require('../models/CreditCardSchema');
const Transaction = require('../models/TransactionsSchema');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const generateData = async () => {
    for (let i = 0; i < 10; i++) { // Generate data for 10 users
        const personalDetail = new PersonalDetail({
            userID: faker.string.uuid(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            last4SSN: faker.finance.accountNumber(4).slice(-4), // Ensure only the last 4 digits
            dob: faker.date.past(50, '2000-01-01')
        });

        await personalDetail.save();

        for (let j = 0; j < 5; j++) { // Generate 5 credit cards for each user
            const creditCard = new CreditCard({
                userID: personalDetail._id,
                cardType: ['Visa', 'MasterCard', 'Amex'][Math.floor(Math.random() * 3)],
                cardDetails: {
                    creditLimit: faker.finance.amount(1000, 5000),
                    balance: faker.finance.amount(0, 1000),
                }
            });

            await creditCard.save();

            for (let k = 0; k < 20; k++) { // Generate 20 transactions for each credit card
                const transaction = new Transaction({
                    cardID: creditCard._id,
                    date: faker.date.between('2021-01-01', '2023-12-31'),
                    amount: faker.finance.amount(5, 500),
                    merchant: "Merchant",
                    category: ['Groceries', 'Utilities', 'Dining', 'Shopping', 'Entertainment'][Math.floor(Math.random() * 3)],
                });

                await transaction.save();
            }
        }
    }

    console.log('Mock data generation complete!');
    // Properly close the Mongoose connection after the script runs
    mongoose.connection.close();
};

generateData().catch(err => {
    console.error('Mock data generation error:', err);
    mongoose.connection.close();
});
