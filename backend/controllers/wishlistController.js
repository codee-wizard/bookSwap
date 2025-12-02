const User = require('../models/User');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'wishlist',
            populate: {
                path: 'owner',
                select: 'username email fullName location'
            }
        });

        res.json({
            status: true,
            data: user.wishlist || []
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// @desc    Add book to wishlist
// @route   POST /api/wishlist/:bookId
// @access  Private
const addToWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const bookId = req.params.bookId;

        // Check if book is already in wishlist
        if (user.wishlist.includes(bookId)) {
            return res.status(400).json({
                status: false,
                message: 'Book already in wishlist'
            });
        }

        user.wishlist.push(bookId);
        await user.save();

        res.json({
            status: true,
            message: 'Book added to wishlist',
            data: user.wishlist
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// @desc    Remove book from wishlist
// @route   DELETE /api/wishlist/:bookId
// @access  Private
const removeFromWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const bookId = req.params.bookId;

        user.wishlist = user.wishlist.filter(
            id => id.toString() !== bookId
        );

        await user.save();

        res.json({
            status: true,
            message: 'Book removed from wishlist',
            data: user.wishlist
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist
};
