const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const router = express.Router();
const { Configuration, OpenAIApi } = require('openai');

const Transaction = require('../models/TransactionsSchema');
const CreditCard = require("../models/CreditCardSchema")
const ChatSession = require("../models/ChatSession")
const ChatMessage = require("../models/ChatMessageSchema")

const { detectIntentFromText } = require('../services/DialogFlowServices');
const OpenAI = require('openai');
const openai = new OpenAI(
    {
        apiKey: process.env.OPENAI_API_KEY
    }
);

// Helper function to generate insights from OpenAI
async function generateInsights(query, data) {
    const prompt = `Keep your answers concise and to the point because you are an AI agent. Make your responses more human. Assume that you are an expert in credit cards. Given the financial data: ${JSON.stringify(data)}, ${query}. Advise them with insights and advices in less 30 words`;

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

    // let session;
    // try {
    //     session = await ChatSession.create({ userID: userID });
    // } catch (error) {
    //     console.error('Failed to create session:', error);
    //     return res.status(500).json({ error: 'Failed to initialize chat session' });
    // }

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
            case 'Default Welcome Intent':
                const welcomeInsights1 = await generateInsights(text, "")
                responsePayload = {intent: currentIntentName, data: welcomeInsights1}
            default:
                const welcomeInsights = await generateInsights(text, "");
                responsePayload = { intent: currentIntentName, data: welcomeInsights };
                break;
        }

        // Save the assistant's response
        await ChatMessage.create({
            userID: userID,
            query: text,
            content: responsePayload.data || responsePayload.message,
        });

        console.log("Sending response payload:", JSON.stringify(responsePayload, null, 2));
        res.json(responsePayload);
    } catch (error) {
        console.error('Error during Dialogflow processing or OpenAI response generation:', error);
        res.status(500).json({ error: 'Failed to process query or generate insights' });
    }
    // finally {
    //     // Update the session end time when the interaction is complete
    //     // session.endTime = new Date();
    //     // await session.save();
    // }
});

module.exports = router;
