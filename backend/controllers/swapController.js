const SwapRequest = require('../models/SwapRequest');
const Book = require('../models/Book');
const Message = require('../models/Message');

// @desc    Create a swap request
// @route   POST /api/swaps
// @access  Private
const createSwapRequest = async (req, res) => {
    try {
        const { bookId } = req.body;
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({ status: false, message: 'Book not found' });
        }

        if (book.owner.toString() === req.user._id.toString()) {
            return res.status(400).json({ status: false, message: 'You cannot request your own book' });
        }

        if (book.isSwapped) {
            return res.status(400).json({ status: false, message: 'This book has already been swapped' });
        }

        const existingRequest = await SwapRequest.findOne({
            requester: req.user._id,
            book: bookId,
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({ status: false, message: 'You already have a pending request for this book' });
        }

        const swapRequest = new SwapRequest({
            requester: req.user._id,
            owner: book.owner,
            book: bookId,
            type: req.body.type || 'swap',
            shippingAddress: req.body.shippingAddress,
            paymentStatus: req.body.type === 'buy' ? 'paid' : 'pending',
            paymentStatus: req.body.type === 'buy' ? 'paid' : 'pending',
            status: 'pending' // Buy requests now wait for seller acceptance
        });

        const createdSwapRequest = await swapRequest.save();

        // Create automated message
        const messageContent = req.body.type === 'buy'
            ? `👋 Hi! I'm interested in buying your book "${book.title}". Could you please let me know more about its condition and availability? Thanks!`
            : `👋 I'm interested in swapping for your book "${book.title}".`;

        await Message.create({
            swapRequest: createdSwapRequest._id,
            sender: req.user._id,
            receiver: book.owner,
            content: messageContent,
            read: false
        });

        res.status(201).json({ status: true, data: createdSwapRequest });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message });
    }
};

// @desc    Get my swap requests (as requester or owner)
// @route   GET /api/swaps
// @access  Private
const getMySwapRequests = async (req, res) => {
    try {
        const requests = await SwapRequest.find({
            $or: [{ requester: req.user._id }, { owner: req.user._id }]
        })
            .populate('book', 'title author imageURL')
            .populate('requester', 'username email fullName location')
            .populate('owner', 'username email fullName location')
            .sort('-createdAt');

        res.json({ status: true, data: requests });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// @desc    Update swap request status
// @route   PUT /api/swaps/:id
// @access  Private
const updateSwapStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const swapRequest = await SwapRequest.findById(req.params.id).populate('book');

        if (!swapRequest) {
            return res.status(404).json({ status: false, message: 'Swap request not found' });
        }

        if (swapRequest.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ status: false, message: 'Not authorized to update this request' });
        }

        if (!['accepted', 'rejected', 'shipped', 'delivered'].includes(status)) {
            return res.status(400).json({ status: false, message: 'Invalid status' });
        }

        if (status === 'accepted' && swapRequest.book.isSwapped) {
            return res.status(400).json({ status: false, message: 'This book has already been swapped' });
        }

        swapRequest.status = status;
        const updatedSwapRequest = await swapRequest.save();

        // Send automated message based on status
        // Send automated message based on status
        let messageContent = '';

        if (status === 'accepted') {
            await Book.updateOne({ _id: swapRequest.book._id }, { isSwapped: true });
            console.log(await Book.find({ _id: swapRequest.book._id }));

            // Auto-reject other pending requests for this book
            await SwapRequest.updateMany(
                { book: swapRequest.book._id, status: 'pending', _id: { $ne: swapRequest._id } },
                { status: 'rejected' }
            );

            messageContent = `🎉 Great news! I've accepted your swap request for "${swapRequest.book.title}". Let's arrange the exchange!`;
        } else if (status === 'rejected') {
            await Book.updateOne({ _id: swapRequest.book._id }, { isSwapped: false });
            messageContent = `❌ I've declined the swap request for "${swapRequest.book.title}".`;
        } else if (status === 'shipped') {
            swapRequest.shippingStatus = 'shipped';
            await swapRequest.save();
            messageContent = `📦 I've shipped your book "${swapRequest.book.title}"! It should arrive in 2-3 days.`;
        } else if (status === 'delivered') {
            swapRequest.shippingStatus = 'delivered';
            await swapRequest.save();
            messageContent = `✅ The book "${swapRequest.book.title}" has been marked as delivered. Enjoy reading!`;
        }

        await Message.create({
            swapRequest: swapRequest._id,
            sender: req.user._id,
            receiver: swapRequest.requester,
            content: messageContent,
            read: false
        });

        res.json({ status: true, data: updatedSwapRequest });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message });
    }
};

// @desc    Cancel swap request
// @route   DELETE /api/swaps/:id
// @access  Private
const cancelSwapRequest = async (req, res) => {
    try {
        const swapRequest = await SwapRequest.findById(req.params.id);

        if (!swapRequest) {
            return res.status(404).json({ status: false, message: 'Swap request not found' });
        }

        if (swapRequest.requester.toString() !== req.user._id.toString()) {
            return res.status(401).json({ status: false, message: 'Not authorized to cancel this request' });
        }

        if (swapRequest.status !== 'pending') {
            return res.status(400).json({ status: false, message: 'Cannot cancel a processed request' });
        }

        // Delete associated messages first
        await Message.deleteMany({ swapRequest: swapRequest._id });

        await SwapRequest.findByIdAndDelete(req.params.id);

        res.json({ status: true, message: 'Swap request cancelled successfully' });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = {
    createSwapRequest,
    getMySwapRequests,
    updateSwapStatus,
    cancelSwapRequest
};
