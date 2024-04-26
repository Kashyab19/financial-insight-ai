
const express = require('express');
const router = express.Router();
const PersonalDetail = require('../models/PersonalDetailSchema'); // Update with correct path to your model

// PATCH endpoint for updating personal details
router.patch('/update/:userID', async (req, res) => {
    const { userID } = req.params;
    const { firstName, lastName } = req.body;

    // Check if there is at least one field to update
    if (!firstName && !lastName) {
        return res.status(400).send('No update information provided.');
    }

    try {
        // Prepare the update object
        const updates = {};
        if (firstName) updates.firstName = firstName;
        if (lastName) updates.lastName = lastName;

        // Find the document by userID and update it
        const updatedPersonalDetail = await PersonalDetail.findOneAndUpdate(
            { userID },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedPersonalDetail) {
            return res.status(404).send('User not found.');
        }

        res.json(updatedPersonalDetail);
    } catch (error) {
        console.error('Error during database update:', error);
        // Check the kind of error
        if (error.kind === 'ObjectId') {
            res.status(404).send('Invalid user ID format.');
        } else if (error.name === 'ValidationError') {
            res.status(400).send(error.message);
        } else {
            res.status(500).send('Server error occurred while updating personal details.');
        }
    }
});

module.exports = router;
