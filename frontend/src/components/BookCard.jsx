import { MapPin, User, Tag, DollarSign, Heart, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { wishlistService } from '../services/wishlistService';

export function BookCard({ book, onRequestSwap }) {
    const navigate = useNavigate();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const hasPrice = book.price && book.price > 0;
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const isOwnBook = currentUser._id === book.owner?._id;
    const [available, setAvailable] = useState(true);

    useEffect(() => {
        checkWishlistStatus();
    }, []);

    const checkWishlistStatus = async () => {
        try {
            const res = await wishlistService.getWishlist();
            const wishlistIds = res.data.data.map(b => b._id);
            setIsWishlisted(wishlistIds.includes(book._id));
        } catch (error) {
            console.error('Error checking wishlist:', error);
        }
    };
    const toggleWishlist = async (e) => {
        e.stopPropagation();
        try {
            if (isWishlisted) {
                await wishlistService.removeFromWishlist(book._id);
                setIsWishlisted(false);
            } else {
                await wishlistService.addToWishlist(book._id);
                setIsWishlisted(true);
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        }
    };

    // console.log(book.isSwapped)

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-[#E8C4D4]/30 group">
            <div
                onClick={() => navigate(`/books/${book._id}`)}
                className="cursor-pointer"
            >
                <div className="relative h-48 overflow-hidden bg-[#F5EEF9]">
                    {book.isSwapped && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                            <span className="text-white text-xl font-bold">SWAPPED</span>
                        </div>
                    )}

                    {book.imageURL ? (
                        <img
                            src={book.imageURL}
                            alt={book.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#9B7EBD] text-lg font-medium">
                            No Cover
                        </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                        {!isOwnBook && (
                            <button
                                onClick={toggleWishlist}
                                className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-lg"
                            >
                                <Heart
                                    className={`w-4 h-4 transition-colors ${isWishlisted ? 'text-[#E8C4D4] fill-[#E8C4D4]' : 'text-[#A795AD]'}`}
                                />
                            </button>
                        )}
                    </div>
                    <div className="absolute top-3 right-3">
                        {hasPrice && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm bg-[#D4A574] text-white">
                                ₹{book.price}
                            </span>
                        )}
                    </div>
                </div>

                <div className="p-5">
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-[#3D3344] mb-1 line-clamp-1">{book.title}</h3>
                        <p className="text-[#6B5B73] text-sm">{book.author}</p>
                    </div>

                    <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-[#6B5B73]">
                            <User className="w-4 h-4 text-[#9B7EBD]" />
                            <span>{book.owner?.fullName || book.owner?.username}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#6B5B73]">
                            <MapPin className="w-4 h-4 text-[#D4A574]" />
                            <span>{book.owner?.location || 'Unknown Location'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#6B5B73]">
                            <Tag className="w-4 h-4 text-[#9B7EBD]" />
                            <span>{book.genre} • {book.condition}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#6B5B73]">
                            <BookOpen className="w-4 h-4 text-[#9B7EBD]" />
                            <span>{book.language || 'English'} • {book.publishedYear || 'N/A'}</span>
                        </div>
                        {hasPrice && (
                            <div className="flex items-center gap-2 text-sm font-bold text-[#3D3344]">
                                <DollarSign className="w-4 h-4 text-[#D4A574]" />
                                <span>₹{book.price}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-5">
                <div className="flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRequestSwap({ ...book, type: 'swap' });
                        }}
                        disabled={book.isSwapped}
                        className="flex-1 py-2.5 rounded-xl bg-[#F5EEF9] text-[#9B7EBD] font-medium hover:bg-[#9B7EBD] hover:text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {book.isSwapped ? 'Swapped' : 'Request Swap'}
                    </button>

                    {hasPrice && !book.isSwapped && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onRequestSwap({ ...book, type: 'buy' });
                            }}
                            className="flex-1 py-2.5 rounded-xl bg-[#FFF8F0] text-[#D4A574] font-medium hover:bg-[#D4A574] hover:text-white transition-all duration-300 border border-[#D4A574]/30"
                        >
                            Buy Now
                        </button>
                    )}
                </div>
            </div>
        </div >
    );
}
