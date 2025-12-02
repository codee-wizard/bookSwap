const mongoose = require('mongoose');

const SwapRequestSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    type: {
        type: String,
        enum: ['swap', 'buy'],
        default: 'swap'
    },
    shippingStatus: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    },
    shippingAddress: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SwapRequest', SwapRequestSchema);
