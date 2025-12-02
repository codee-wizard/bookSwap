const Message = require('../models/Message');
const SwapRequest = require('../models/SwapRequest');

// @desc    Get all conversations for logged-in user
// @route   GET /api/messages/conversations
// @access  Private
const getUserConversations = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find all swap requests where user is involved
        const swapRequests = await SwapRequest.find({
            $or: [{ requester: userId }, { owner: userId }]
        })
            .populate('requester', 'username fullName')
            .populate('owner', 'username fullName')
            .populate('book', 'title imageURL')
            .sort('-createdAt');

        // For each swap request, get the latest message and unread count
        const conversations = await Promise.all(
            swapRequests.map(async (swap) => {
                const messages = await Message.find({ swapRequest: swap._id })
                    .sort('-createdAt')
                    .limit(1);

                const unreadCount = await Message.countDocuments({
                    swapRequest: swap._id,
                    receiver: userId,
                    read: false
                });

                const otherUser = swap.requester._id.toString() === userId.toString()
                    ? swap.owner
                    : swap.requester;

                return {
                    swapRequest: swap,
                    lastMessage: messages[0] || null,
                    unreadCount,
                    otherUser
                };
            })
        );

        res.json({
            status: true,
            data: conversations
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// @desc    Get messages for a specific swap request
// @route   GET /api/messages/:swapRequestId
// @access  Private
const getConversation = async (req, res) => {
    try {
        const { swapRequestId } = req.params;
        const userId = req.user._id;

        // Verify user is part of this swap request
        const swapRequest = await SwapRequest.findById(swapRequestId);
        if (!swapRequest) {
            return res.status(404).json({ status: false, message: 'Swap request not found' });
        }

        if (swapRequest.requester.toString() !== userId.toString() &&
            swapRequest.owner.toString() !== userId.toString()) {
            return res.status(403).json({ status: false, message: 'Not authorized to view this conversation' });
        }

        const messages = await Message.find({ swapRequest: swapRequestId })
            .populate('sender', 'username fullName')
            .populate('receiver', 'username fullName')
            .sort('createdAt');

        res.json({
            status: true,
            data: messages
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// @desc    Send a message
// @route   POST /api/messages/:swapRequestId
// @access  Private
const sendMessage = async (req, res) => {
    try {
        const { swapRequestId } = req.params;
        const { content } = req.body;
        const userId = req.user._id;

        // Verify swap request exists and user is part of it
        const swapRequest = await SwapRequest.findById(swapRequestId);
        if (!swapRequest) {
            return res.status(404).json({ status: false, message: 'Swap request not found' });
        }

        if (swapRequest.requester.toString() !== userId.toString() &&
            swapRequest.owner.toString() !== userId.toString()) {
            return res.status(403).json({ status: false, message: 'Not authorized to send messages in this conversation' });
        }

        // Determine receiver
        const receiverId = swapRequest.requester.toString() === userId.toString()
            ? swapRequest.owner
            : swapRequest.requester;

        const message = await Message.create({
            swapRequest: swapRequestId,
            sender: userId,
            receiver: receiverId,
            content
        });

        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'username fullName')
            .populate('receiver', 'username fullName');

        res.status(201).json({
            status: true,
            data: populatedMessage
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// @desc    Mark message as read
// @route   PUT /api/messages/:messageId/read
// @access  Private
const markAsRead = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user._id;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ status: false, message: 'Message not found' });
        }

        // Only receiver can mark as read
        if (message.receiver.toString() !== userId.toString()) {
            return res.status(403).json({ status: false, message: 'Not authorized' });
        }

        message.read = true;
        await message.save();

        res.json({
            status: true,
            data: message
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// @desc    Get unread message count
// @route   GET /api/messages/unread/count
// @access  Private
const getUnreadCount = async (req, res) => {
    try {
        const count = await Message.countDocuments({
            receiver: req.user._id,
            read: false
        });

        res.json({
            status: true,
            data: { count }
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// @desc    Delete conversation (all messages for a swap request)
// @route   DELETE /api/messages/:swapRequestId
// @access  Private
const deleteConversation = async (req, res) => {
    try {
        const { swapRequestId } = req.params;
        const userId = req.user._id;

        // Verify user is part of this swap request
        const swapRequest = await SwapRequest.findById(swapRequestId);
        if (!swapRequest) {
            return res.status(404).json({ status: false, message: 'Swap request not found' });
        }

        if (swapRequest.requester.toString() !== userId.toString() &&
            swapRequest.owner.toString() !== userId.toString()) {
            return res.status(403).json({ status: false, message: 'Not authorized to delete this conversation' });
        }

        // Delete all messages for this swap request
        await Message.deleteMany({ swapRequest: swapRequestId });

        res.json({
            status: true,
            message: 'Conversation deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = {
    getUserConversations,
    getConversation,
    sendMessage,
    markAsRead,
    getUnreadCount,
    deleteConversation
};
