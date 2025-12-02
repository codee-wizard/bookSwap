const express = require('express');
const { registerUser, loginUser, updateProfile, getUserStats } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', protect, updateProfile);
router.get('/stats', protect, getUserStats);

module.exports = router;