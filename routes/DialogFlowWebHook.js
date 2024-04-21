const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require('openai');
const Transaction = require('../models/TransactionsSchema');
const CreditCard = require("../models/CreditCardSchema")
const { detectIntentFromText } = require('../services/DialogFlowServices');
const OpenAI = require('openai');
const openai = new OpenAI(
    {
        apiKey: process.env.OPENAI_API_KEY
    }
);

// Helper function to generate insights from OpenAI
async function generateInsights(query, data) {
    const prompt = `Assume that you are an expert in credit cards. Given the financial data: ${JSON.stringify(data)}, ${query}. Advise them with insights and advices`;

    try {
        const completion = await openai.chat.completions.create({
            messages: [{"role": "assistant", "content": prompt}],
            model: "gpt-3.5-turbo",
            max_tokens: 150
        });
        return completion.choices[0]?.message.content;
    } catch (error) {
        console.error("Error generating insights from OpenAI:", error);
        throw error;
    }
}

router.post('/send-query', async (req, res) => {
    const { text, userID } = req.body;

    if (!text || !userID) {
        return res.status(400).json({ error: 'No text or userID provided' });
    }

    try {
        const dialogflowResponse = await detectIntentFromText(text);
        const currentIntentName = dialogflowResponse.queryResult.intent.displayName;
        let responsePayload;

        switch (currentIntentName) {
            case 'CreditCardDetails':
                const creditCards = await CreditCard.find({ userID: userID });
                const insights = await generateInsights(text, creditCards);
                responsePayload = { intent: currentIntentName, data:insights };
                break;
            case 'CheckRecentTransactions':
                const transactions = await Transaction.find({ userID: userID });
                const transactionInsights = await generateInsights(text, transactions);
                responsePayload = { intent: currentIntentName, data: transactionInsights };
                break;
            default:
                responsePayload = { intent: currentIntentName, message: "No relevant financial data to process." };
                break;
        }

        res.json(responsePayload);
    } catch (error) {
        console.error('Error during Dialogflow processing or OpenAI response generation:', error);
        res.status(500).json({ error: 'Failed to process query or generate insights' });
    }
});

module.exports = router;
