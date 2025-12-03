const express = require('express');
const { registerUser, loginUser, updateProfile, getUserStats, addRating } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', protect, updateProfile);
router.get('/stats', protect, getUserStats);
router.post('/rate/:userId', protect, addRating);

module.exports = router;