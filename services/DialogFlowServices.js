// Import necessary libraries
const dialogflow = require('@google-cloud/dialogflow-cx');
const {SessionsClient} = require('@google-cloud/dialogflow-cx');
const fs = require('fs');
const util = require('util');

// Check if the GOOGLE_APPLICATION_CREDENTIALS environment variable is set
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error('The GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.');
    process.exit(1);
}


const clientOptions = {
    apiEndpoint: 'us-central1-dialogflow.googleapis.com',
};
const client = new SessionsClient(clientOptions);

const projectId = process.env.DIALOGFLOW_PROJECT_ID;
const location = 'us-central1'; // Ensure this matches the location of your agent
const agentId = process.env.DIALOGFLOW_AGENT_ID;
const languageCode = process.env.DIALOGFLOW_LANGUAGE_CODE;
const sessionId = 'some-unique-session-id1'; // This should be unique for each user/session

// Function to detect intent from text input
async function detectIntentFromText(queryText) {
    const sessionPath = client.projectLocationAgentSessionPath(
        projectId,
        location,
        agentId,
        sessionId
    );

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: queryText
            },
            languageCode: languageCode
        },
    };

    try {
        const [response] = await client.detectIntent(request);
        console.log("Response from Dialogflow CX:");
        console.log(`Query Text: ${queryText}`);
        console.log(`Detected Intent: ${response.queryResult.match.intent?.displayName}`);
        console.log(`Confidence: ${response.queryResult.match.confidence}`);
        response.queryResult.responseMessages.forEach(message => {
            if (message.text) {
                console.log(`Fulfillment Text: ${message.text.text}`);
            }
        });
        console.log(`Current Page: ${response.queryResult.currentPage.displayName}`);
        return response;
    } catch (err) {
        console.error(`Error during detectIntent: ${err}`);
        throw err;
    }
}

// Example call to the detectIntentFromText function
// detectIntentFromText("Hello")
//     .then(response => console.log("Intent detection completed."))
//     .catch(err => console.error("Error processing intent:", err));

module.exports = {
    detectIntentFromText
};
