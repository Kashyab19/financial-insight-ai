const mongoose = require('mongoose');

const PersonalDetailSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    last4SSN: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /\d{4}/.test(v);
            },
            message: props => `${props.value} is not a valid SSN last 4 digits!`
        },
        maxLength: 4
    },
    dob: {
        type: Date,
        required: true
    },
    email: { type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('PersonalDetail', PersonalDetailSchema);
