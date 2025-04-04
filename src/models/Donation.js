const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    foodType: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    pickupLocation: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'completed', 'expired'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Donation', donationSchema); 