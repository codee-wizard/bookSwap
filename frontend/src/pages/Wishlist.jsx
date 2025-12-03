import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { wishlistService } from '../services/wishlistService';
import { swapService } from '../services/swapService';
import { Heart, BookOpen, Trash2, Repeat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const res = await wishlistService.getWishlist();
            setWishlist(res.data.data);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (bookId) => {
        try {
            await wishlistService.removeFromWishlist(bookId);
            setWishlist(wishlist.filter(book => book._id !== bookId));
        } catch (error) {
            alert('Error removing from wishlist');
        }
    };

    const handleRequestSwap = async (book) => {
        try {
            await swapService.createRequest({ bookId: book._id });
            alert('Swap request sent!');
        } catch (error) {
            alert(error.response?.data?.message || 'Error sending request');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F5EEF9] via-[#F9F6FA] to-[#FFF8F0]">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Heart className="w-6 h-6 text-[#E8C4D4] fill-[#E8C4D4]" />
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#3D3344]">My Wishlist</h1>
                    </div>
                    <p className="text-sm sm:text-base text-[#6B5B73]">Books you've saved for later</p>
                </div>

                {/* Statistics Card */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-[#E8C4D4]/30 shadow-md mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#E8C4D4]/20 flex items-center justify-center">
                            <Heart className="w-6 h-6 text-[#E8C4D4] fill-[#E8C4D4]" />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-[#3D3344]">{wishlist.length}</div>
                            <div className="text-sm text-[#6B5B73]">Wishlisted Books</div>
                        </div>
                    </div>
                </div>

                {/* Wishlist Grid */}
                {loading ? (
                    <div className="text-center py-12 text-[#6B5B73]">Loading your wishlist...</div>
                ) : wishlist.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {wishlist.map(book => (
                            <div key={book._id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-[#E8C4D4]/30 group">
                                <div
                                    onClick={() => navigate(`/books/${book._id}`)}
                                    className="cursor-pointer"
                                >
                                    <div className="relative h-48 overflow-hidden bg-[#F5EEF9]">
                                        {book.imageURL ? (
                                            <img
                                                src={book.imageURL}
                                                alt={book.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[#9B7EBD] text-lg font-medium">
                                                <BookOpen className="w-12 h-12" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemove(book._id);
                                                }}
                                                className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-lg"
                                            >
                                                <Trash2 className="w-4 h-4 text-[#D4A574]" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <div className="mb-3">
                                            <h3 className="text-lg font-bold text-[#3D3344] mb-1 line-clamp-1">{book.title}</h3>
                                            <p className="text-[#6B5B73] text-sm">{book.author}</p>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-[#6B5B73]">
                                                <span className="px-2 py-1 rounded-full bg-[#C8B6D6]/20 text-[#9B7EBD] text-xs font-medium">
                                                    {book.genre}
                                                </span>
                                                <span className="text-xs">• {book.condition}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-5 pb-5">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRequestSwap(book);
                                        }}
                                        className="w-full py-2.5 rounded-xl bg-[#9B7EBD] text-white font-medium hover:bg-[#8A6EA8] transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <Repeat className="w-4 h-4" />
                                        Request Swap
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white/60 rounded-2xl border border-[#E8C4D4]/30">
                        <Heart className="w-16 h-16 text-[#E8C4D4] mx-auto mb-4" />
                        <p className="text-[#6B5B73] text-lg mb-2">Your wishlist is empty</p>
                        <p className="text-[#A795AD] text-sm mb-6">Start adding books you're interested in!</p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-3 rounded-full bg-[#9B7EBD] text-white font-medium hover:bg-[#8A6EA8] transition-colors"
                        >
                            Explore Books
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
