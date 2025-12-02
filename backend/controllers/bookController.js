const Book = require('../models/Book');

// @desc    Get all books
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
    try {
        const { search, genre, condition, sort, location, type, page = 1, limit = 10 } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } }
            ];
        }

        if (genre && genre !== 'All Genres') {
            query.genre = genre;
        }

        if (condition) {
            query.condition = condition;
        }

        if (type) {
            query.listingType = type;
        }

        // Filter by location
        if (location && location !== 'All Locations') {
            // Find users in this location
            const usersInLocation = await require('../models/User').find({
                location: { $regex: location, $options: 'i' }
            }).select('_id');

            const userIds = usersInLocation.map(user => user._id);
            query.owner = { $in: userIds };
        }

        let booksQuery = Book.find(query).populate('owner', 'username email fullName location');

        if (sort) {
            const sortFields = sort.split(',').join(' ');
            booksQuery = booksQuery.sort(sortFields);
        } else {
            booksQuery = booksQuery.sort('-createdAt');
        }

        const count = await Book.countDocuments(query);
        const books = await booksQuery.limit(limit * 1).skip((page - 1) * limit);

        res.json({
            status: true,
            data: books,
            pagination: {
                totalBooks: count,
                totalPages: Math.ceil(count / limit),
                currentPage: Number(page)
            }
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('owner', 'username email fullName location averageRating reviewCount');
        if (book) {
            res.json({ status: true, data: book });
        } else {
            res.status(404).json({ status: false, message: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// @desc    Create a book
// @route   POST /api/books
// @access  Private
const createBook = async (req, res) => {
    try {
        const { title, author, genre, condition, description, imageURL, listingType, price, publishedYear, pages, language } = req.body;

        const book = new Book({
            title,
            author,
            genre,
            condition,
            description,
            imageURL,
            listingType,
            price,
            publishedYear,
            pages,
            language,
            owner: req.user._id
        });

        const createdBook = await book.save();
        res.status(201).json({ status: true, data: createdBook });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message });
    }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private
const updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (book) {
            if (book.owner.toString() !== req.user._id.toString()) {
                return res.status(401).json({ status: false, message: 'Not authorized to update this book' });
            }

            book.title = req.body.title || book.title;
            book.author = req.body.author || book.author;
            book.genre = req.body.genre || book.genre;
            book.condition = req.body.condition || book.condition;
            book.description = req.body.description || book.description;
            book.imageURL = req.body.imageURL || book.imageURL;
            book.listingType = req.body.listingType || book.listingType;
            book.price = req.body.price || book.price;
            book.publishedYear = req.body.publishedYear || book.publishedYear;
            book.pages = req.body.pages || book.pages;
            book.language = req.body.language || book.language;

            const updatedBook = await book.save();
            res.json({ status: true, data: updatedBook });
        } else {
            res.status(404).json({ status: false, message: 'Book not found' });
        }
    } catch (error) {
        res.status(400).json({ status: false, message: error.message });
    }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (book) {
            // Check if the user is the owner of the book
            if (book.owner.toString() !== req.user._id.toString()) {
                return res.status(401).json({ status: false, message: 'Not authorized to delete this book' });
            }

            await book.deleteOne();
            res.json({ status: true, message: 'Book removed' });
        } else {
            res.status(404).json({ status: false, message: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
};
