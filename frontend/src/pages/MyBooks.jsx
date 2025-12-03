import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { bookService } from '../services/bookService';
import { swapService } from '../services/swapService';
import { Plus, X, BookOpen, Repeat, CheckCircle, Edit2, Trash2 } from 'lucide-react';

export function MyBooks() {
    const [myBooks, setMyBooks] = useState([]);
    const [swapRequests, setSwapRequests] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [formData, setFormData] = useState({
        title: '', author: '', genre: '', condition: 'Good',
        description: '', listingType: 'Swap', price: '', imageURL: '',
        publishedYear: '', pages: '', language: 'English'
    });

    useEffect(() => {
        fetchMyBooks();
        fetchSwapRequests();
    }, []);

    const fetchMyBooks = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const res = await bookService.getAllBooks();
            const myBooksData = res.data.data.filter(book => book.owner._id === user._id);
            setMyBooks(myBooksData);
        } catch (error) {
            console.error('Error fetching my books:', error);
        }
    };

    const fetchSwapRequests = async () => {
        try {
            const res = await swapService.getMyRequests();
            setSwapRequests(res.data.data);
        } catch (error) {
            console.error('Error fetching swap requests:', error);
        }
    };

    const getSwapCountForBook = (bookId) => {
        return swapRequests.filter(req => req.book._id === bookId && req.status === 'pending').length;
    };

    const activeRequests = swapRequests.filter(req => req.status === 'pending').length;
    const completedSwaps = swapRequests.filter(req => req.status === 'accepted').length;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingBook) {
                await bookService.updateBook(editingBook._id, formData);
            } else {
                await bookService.createBook(formData);
            }
            setShowModal(false);
            setEditingBook(null);
            fetchMyBooks();
            setFormData({
                title: '', author: '', genre: '', condition: 'Good',
                description: '', listingType: 'Swap', price: '', imageURL: '',
                publishedYear: '', pages: '', language: 'English'
            });
        } catch (error) {
            alert(editingBook ? 'Error updating book' : 'Error creating book');
        }
    };

    const handleEdit = (book) => {
        setEditingBook(book);
        setFormData({
            title: book.title,
            author: book.author,
            genre: book.genre,
            condition: book.condition,
            description: book.description,
            listingType: book.listingType,
            price: book.price || '',
            imageURL: book.imageURL || '',
            publishedYear: book.publishedYear || '',
            pages: book.pages || '',
            language: book.language || 'English'
        });
        setShowModal(true);
    };

    const handleDelete = async (bookId) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await bookService.deleteBook(bookId);
                fetchMyBooks();
            } catch (error) {
                alert('Error deleting book');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F5EEF9] via-[#F9F6FA] to-[#FFF8F0]">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="w-6 h-6 text-[#9B7EBD]" />
                            <h1 className="text-3xl font-bold text-[#3D3344]">My Collection</h1>
                        </div>
                        <p className="text-[#6B5B73]">Manage your treasured stories and swap requests</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#9B7EBD] text-white font-medium hover:bg-[#8A6EA8] transition-colors shadow-lg hover:shadow-xl"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Story
                    </button>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-[#C8B6D6]/30 shadow-md">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#C8B6D6]/20 flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-[#9B7EBD]" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-[#3D3344]">{myBooks.length}</div>
                                <div className="text-sm text-[#6B5B73]">Total Books</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-[#E8C4D4]/30 shadow-md">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#E8C4D4]/20 flex items-center justify-center">
                                <Repeat className="w-6 h-6 text-[#D4A574]" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-[#3D3344]">{activeRequests}</div>
                                <div className="text-sm text-[#6B5B73]">Active Requests</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-[#9B7EBD]/30 shadow-md">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#9B7EBD]/20 flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-[#9B7EBD]" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-[#3D3344]">{completedSwaps}</div>
                                <div className="text-sm text-[#6B5B73]">Completed Swaps</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Books List */}
                <div className="space-y-4">
                    {myBooks.map(book => (
                        <div key={book._id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#E8C4D4]/30 shadow-md hover:shadow-lg transition-all">
                            <div className="flex gap-6">
                                {/* Book Image */}
                                <div className="w-32 h-40 rounded-xl overflow-hidden bg-[#F5EEF9] flex-shrink-0">
                                    {book.imageURL ? (
                                        <img src={book.imageURL} alt={book.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[#A795AD]">
                                            <BookOpen className="w-12 h-12" />
                                        </div>
                                    )}
                                </div>

                                {/* Book Details */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold text-[#3D3344]">{book.title}</h3>
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#C8B6D6]/20 text-[#9B7EBD]">
                                                    {book.genre}
                                                </span>
                                            </div>
                                            <p className="text-[#6B5B73]">by {book.author}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(book)}
                                                className="p-2 rounded-full hover:bg-[#F5EEF9] transition-colors"
                                            >
                                                <Edit2 className="w-5 h-5 text-[#9B7EBD]" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(book._id)}
                                                className="p-2 rounded-full hover:bg-[#FFF8F0] transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5 text-[#D4A574]" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 text-sm">
                                        <div>
                                            <span className="text-[#A795AD]">⭐ Condition</span>
                                            <p className="text-[#3D3344] font-medium">{book.condition}</p>
                                        </div>
                                        <div>
                                            <span className="text-[#A795AD]">🔄 Swap Requests</span>
                                            <p className="text-[#3D3344] font-medium">{getSwapCountForBook(book._id)}</p>
                                        </div>
                                    </div>

                                    {getSwapCountForBook(book._id) > 0 && (
                                        <button className="mt-4 px-4 py-2 rounded-full border border-[#C8B6D6] text-[#9B7EBD] text-sm font-medium hover:bg-[#F5EEF9] transition-colors">
                                            View {getSwapCountForBook(book._id)} Request{getSwapCountForBook(book._id) > 1 ? 's' : ''}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {myBooks.length === 0 && (
                        <div className="text-center py-16 bg-white/60 rounded-2xl border border-[#E8C4D4]/30">
                            <BookOpen className="w-16 h-16 text-[#C8B6D6] mx-auto mb-4" />
                            <p className="text-[#6B5B73] text-lg">No books yet. Start adding your treasured stories!</p>
                        </div>
                    )}
                </div>

                {/* Add Book Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-[#3D3344]">{editingBook ? 'Edit Book' : 'Add a New Book'}</h2>
                                <button onClick={() => {
                                    setShowModal(false);
                                    setEditingBook(null);
                                }} className="p-2 hover:bg-[#F5EEF9] rounded-full transition-colors">
                                    <X className="w-6 h-6 text-[#6B5B73]" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-[#3D3344] mb-2">Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-[#F5EEF9] border-none focus:ring-2 focus:ring-[#9B7EBD]/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#3D3344] mb-2">Author</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.author}
                                            onChange={e => setFormData({ ...formData, author: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-[#F5EEF9] border-none focus:ring-2 focus:ring-[#9B7EBD]/20"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-[#3D3344] mb-2">Genre</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.genre}
                                            onChange={e => setFormData({ ...formData, genre: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-[#F5EEF9] border-none focus:ring-2 focus:ring-[#9B7EBD]/20"
                                            list="genre-options"
                                            placeholder="Select or type genre"
                                        />
                                        <datalist id="genre-options">
                                            <option value="Romance" />
                                            <option value="Thriller" />
                                            <option value="Sci-Fi" />
                                            <option value="Biography" />
                                            <option value="Self-help" />
                                            <option value="History" />
                                            <option value="Sonnet" />
                                            <option value="Free Verse" />
                                            <option value="Haiku" />
                                            <option value="Plays" />
                                            <option value="Screenplays" />
                                            <option value="Textbooks" />
                                            <option value="Manuals" />
                                            <option value="Comics" />
                                            <option value="Novellas" />
                                            <option value="Anthologies" />
                                        </datalist>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#3D3344] mb-2">Condition</label>
                                        <select
                                            value={formData.condition}
                                            onChange={e => setFormData({ ...formData, condition: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-[#F5EEF9] border-none focus:ring-2 focus:ring-[#9B7EBD]/20"
                                        >
                                            <option>New</option>
                                            <option>Like New</option>
                                            <option>Good</option>
                                            <option>Fair</option>
                                            <option>Poor</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#3D3344] mb-2">Description</label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-[#F5EEF9] border-none focus:ring-2 focus:ring-[#9B7EBD]/20 h-32"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-[#3D3344] mb-2">Listing Type</label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="listingType"
                                                    value="Swap"
                                                    checked={formData.listingType === 'Swap'}
                                                    onChange={(e) => setFormData({ ...formData, listingType: e.target.value })}
                                                    className="text-[#9B7EBD] focus:ring-[#9B7EBD]"
                                                />
                                                <span className="text-[#3D3344]">Swap</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="listingType"
                                                    value="Sell"
                                                    checked={formData.listingType === 'Sell'}
                                                    onChange={(e) => setFormData({ ...formData, listingType: e.target.value })}
                                                    className="text-[#9B7EBD] focus:ring-[#9B7EBD]"
                                                />
                                                <span className="text-[#3D3344]">Sell</span>
                                            </label>
                                        </div>
                                    </div>
                                    {formData.listingType === 'Sell' && (
                                        <div>
                                            <label className="block text-sm font-medium text-[#3D3344] mb-2">Price (₹)</label>
                                            <input
                                                type="number"
                                                required
                                                value={formData.price}
                                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-[#F5EEF9] border-none focus:ring-2 focus:ring-[#9B7EBD]/20"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#3D3344] mb-2">Published Year</label>
                                        <input
                                            type="number"
                                            value={formData.publishedYear}
                                            onChange={e => setFormData({ ...formData, publishedYear: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-[#F5EEF9] border-none focus:ring-2 focus:ring-[#9B7EBD]/20"
                                            placeholder="e.g. 1925"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#3D3344] mb-2">Pages</label>
                                        <input
                                            type="number"
                                            value={formData.pages}
                                            onChange={e => setFormData({ ...formData, pages: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-[#F5EEF9] border-none focus:ring-2 focus:ring-[#9B7EBD]/20"
                                            placeholder="e.g. 180"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#3D3344] mb-2">Language</label>
                                        <input
                                            type="text"
                                            value={formData.language}
                                            onChange={e => setFormData({ ...formData, language: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-[#F5EEF9] border-none focus:ring-2 focus:ring-[#9B7EBD]/20"
                                            placeholder="e.g. English"
                                        />
                                    </div>
                                </div>


                                <div>
                                    <label className="block text-sm font-medium text-[#3D3344] mb-2">Book Cover Image</label>

                                    {!formData.imageURL ? (
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        // Check file size (limit to 5MB)
                                                        if (file.size > 5 * 1024 * 1024) {
                                                            alert('Image size should be less than 5MB');
                                                            return;
                                                        }

                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setFormData({ ...formData, imageURL: reader.result });
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                                className="hidden"
                                                id="book-image-upload"
                                            />
                                            <label
                                                htmlFor="book-image-upload"
                                                className="flex flex-col items-center justify-center w-full h-32 px-4 py-6 bg-[#F5EEF9] border-2 border-dashed border-[#C8B6D6] rounded-xl cursor-pointer hover:bg-[#F0E6F6] transition-colors"
                                            >
                                                <svg className="w-10 h-10 text-[#9B7EBD] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <span className="text-sm text-[#6B5B73]">Click to upload book cover</span>
                                                <span className="text-xs text-[#A795AD] mt-1">PNG, JPG up to 5MB</span>
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <img
                                                src={formData.imageURL}
                                                alt="Book cover preview"
                                                className="w-full h-48 object-cover rounded-xl border border-[#E8C4D4]"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, imageURL: '' })}
                                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 rounded-xl bg-[#9B7EBD] text-white font-bold hover:bg-[#8A6EA8] transition-colors shadow-lg"
                                >
                                    {editingBook ? 'Update Book' : 'Add Book'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
