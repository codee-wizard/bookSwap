const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    condition: {
        type: String,
        required: true,
        enum: ['New', 'Like New', 'Good', 'Fair', 'Poor']
    },
    description: {
        type: String,
        required: true
    },
    imageURL: {
        type: String,
        required: false
    },
    publishedYear: {
        type: Number,
        required: false
    },
    pages: {
        type: Number,
        required: false
    },
    language: {
        type: String,
        required: false,
        default: 'English'
    },
    listingType: {
        type: String,
        enum: ['Sell', 'Swap'],
        default: 'Swap',
        required: true
    },
    isSwapped:{
        type: Boolean,
        default: false,
        required: true
    },
    price: {
        type: Number,
        required: function () { return this.listingType === 'Sell'; }
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Book', BookSchema);