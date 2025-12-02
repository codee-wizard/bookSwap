const User = require('../models/User')
const jwt = require('jsonwebtoken')

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

// Register a new user
const registerUser = async (req, res) => {
    const { username, email, password, fullName, location } = req.body
    try {
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json({
                status: false,
                message: 'User already exists'
            })
        }
        const user = await User.create({
            username,
            email,
            password,
            fullName,
            location
        })
        // Generate JWT for the new user
        const token = generateToken(user._id)

        res.status(201).json({
            status: true,
            message: 'User registered successfully',
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                location: user.location,
                role: user.role,
                token,
            }
        })
    } catch (error) {
        res.status(400).json({
            status: false,
            message: error.message
        })
    }
}

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user._id)

            res.json({
                status: true,
                message: 'User logged in successfully',
                data: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    fullName: user.fullName,
                    location: user.location,
                    role: user.role,
                    token,
                }
            })
        } else {
            res.status(401).json({
                status: false,
                message: 'Invalid email or password'
            })
        }
    } catch (error) {
        res.status(400).json({
            status: false,
            message: error.message
        })
    }
}

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.username = req.body.username || user.username;
            user.fullName = req.body.fullName || user.fullName;
            user.email = req.body.email || user.email;
            user.location = req.body.location || user.location;

            const updatedUser = await user.save();

            res.json({
                status: true,
                message: 'Profile updated successfully',
                data: {
                    _id: updatedUser._id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    fullName: updatedUser.fullName,
                    location: updatedUser.location,
                    role: updatedUser.role
                }
            });
        } else {
            res.status(404).json({
                status: false,
                message: 'User not found'
            });
        }
    } catch (error) {
        res.status(400).json({
            status: false,
            message: error.message
        });
    }
};

// Get user stats
const getUserStats = async (req, res) => {
    try {
        const Book = require('../models/Book');
        const booksListed = await Book.countDocuments({ owner: req.user._id });
        const user = await User.findById(req.user._id);

        res.json({
            status: true,
            data: {
                booksListed,
                averageRating: user.averageRating || 0,
                reviewCount: user.reviewCount || 0
            }
        });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    updateProfile,
    getUserStats
}
