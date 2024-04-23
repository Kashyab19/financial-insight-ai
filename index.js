const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv').config(); // Ensure you have installed dotenv package for environment variables
const cors = require('cors');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(bodyParser.json());


const mongoURI = process.env.MONGO_URI || 'yourMongoDBConnectionString';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json()); // Middleware to parse JSON bodies

// Import your route modules
const onboardRouter = require('./routes/Onboard');
const userDataRoutes = require('./routes/LoadUserData'); // Adjust path as needed
const dialogflowWebhookRoute = require('./routes/DialogFlowWebhook'); // Update the path as needed
const dialogflowService = require('./services/DialogFlowServices');
const chatRoutes = require('./routes/LoadUserMessages');  // Adjust the path as necessary

// Use routes
app.use('/api/', onboardRouter);
app.use('/api/', userDataRoutes);
app.use('/api', dialogflowWebhookRoute);
app.use('/api', chatRoutes);


// app.post('/send-query', async (req, res) => {
//     const userInput = req.body.query;
//     try {
//         const response = await dialogflowService.detectIntent(userInput);
//         res.json({ response: response.queryResult.fulfillmentText });
//     } catch (error) {
//         console.error('Error during detectIntent:', error);
//         res.status(500).send('Error processing the query');
//     }
// });


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
