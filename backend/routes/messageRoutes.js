const express = require('express');
const router = express.Router();
const {
    getUserConversations,
    getConversation,
    sendMessage,
    markAsRead,
    getUnreadCount,
    deleteConversation
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

router.get('/conversations', getUserConversations);
router.get('/unread/count', getUnreadCount);
router.get('/:swapRequestId', getConversation);
router.post('/:swapRequestId', sendMessage);
router.delete('/:swapRequestId', deleteConversation);
router.put('/:messageId/read', markAsRead);

module.exports = router;
