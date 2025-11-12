const User = require('../models/User')
const jwt = require('jsonwebtoken')

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' }) 
}

// Register a new user
const registerUser = async (req, res) => {
    const { username, email, password } = req.body
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

module.exports = {
    registerUser,
    loginUser
}
