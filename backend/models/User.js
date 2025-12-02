const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const User = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    about: {
        type: String,
        default: "An avid reader and lover of stories. Always seeking new adventures through books and sharing the magic of reading with fellow book enthusiasts. Favorite genres include fantasy, mystery, and literary fiction."
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],
    ratings: [{
        rating: { type: Number, required: true },
        review: { type: String },
        reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }],
    averageRating: {
        type: Number,
        default: 0
    },
    reviewCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

// Password hashing middleware
User.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

// Method to compare password
User.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', User)