const express = require('express');
const router = express.Router();
const {
    createSwapRequest,
    getMySwapRequests,
    updateSwapStatus,
    cancelSwapRequest
} = require('../controllers/swapController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createSwapRequest);
router.get('/', protect, getMySwapRequests);
router.put('/:id', protect, updateSwapStatus);
router.delete('/:id', protect, cancelSwapRequest);

module.exports = router;
