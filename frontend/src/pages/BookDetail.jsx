import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { bookService } from '../services/bookService';
import { swapService } from '../services/swapService';
import { wishlistService } from '../services/wishlistService';
import { ArrowLeft, Star, MapPin, Heart, Sparkles, Mail, ShoppingBag, X, CreditCard, Truck } from 'lucide-react';

export function BookDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [existingRequest, setExistingRequest] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [shippingAddress, setShippingAddress] = useState('');
    const [processingPayment, setProcessingPayment] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchBookDetails();
        checkWishlistStatus();
        checkExistingRequest();
    }, [id]);

    const fetchBookDetails = async () => {
        try {
            const res = await bookService.getBookById(id);
            setBook(res.data.data);
        } catch (error) {
            console.error('Error fetching book details:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkExistingRequest = async () => {
        try {
            const res = await swapService.getMyRequests();
            const request = res.data.data.find(req =>
                req.book._id === id &&
                req.requester._id === currentUser._id &&
                req.status === 'pending'
            );
            setExistingRequest(request);
        } catch (error) {
            console.error('Error checking existing requests:', error);
        }
    };

    const checkWishlistStatus = async () => {
        try {
            const res = await wishlistService.getWishlist();
            const wishlistIds = res.data.data.map(b => b._id);
            setIsWishlisted(wishlistIds.includes(id));
        } catch (error) {
            console.error('Error checking wishlist:', error);
        }
    };

    const toggleWishlist = async () => {
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

    const handleSwapAction = async (type = 'swap') => {
        try {
            if (existingRequest) {
                if (window.confirm('Do you want to cancel your request?')) {
                    await swapService.cancelRequest(existingRequest._id);
                    setExistingRequest(null);
                    alert('Request cancelled.');
                }
            } else {
                if (type === 'buy') {
                    setShowPaymentModal(true);
                    return;
                }
                await swapService.createRequest({ bookId: book._id, type: 'swap' });
                alert('Swap request sent! You can now message the book keeper.');
                checkExistingRequest();
                navigate('/messages');
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Error processing request');
        }
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setProcessingPayment(true);

        // Simulate payment processing
        setTimeout(async () => {
            try {
                await swapService.createRequest({
                    bookId: book._id,
                    type: 'buy',
                    shippingAddress
                });
                setProcessingPayment(false);
                setShowPaymentModal(false);
                alert('Payment successful! Order placed.');
                checkExistingRequest();
                navigate('/messages');
            } catch (error) {
                setProcessingPayment(false);
                alert(error.response?.data?.message || 'Payment failed');
            }
        }, 1500);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8F4F9] flex items-center justify-center">
                <div className="text-[#8B7BA8] text-xl">Loading...</div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="min-h-screen bg-[#F8F4F9]">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                    <p className="text-[#6B5B73] text-xl mb-4">Book not found</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 rounded-lg bg-[#8B7BA8] text-white hover:bg-[#7A6A97]"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const isOwner = currentUser._id === book.owner._id;

    return (
        <div className="min-h-screen bg-[#F8F4F9]">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-[#8B7BA8] hover:text-[#7A6A97] mb-8 font-medium"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Collection
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Left Column - Book Image (2/5 width) */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-8 shadow-sm">
                            {/* Book Image */}
                            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 mb-6">
                                {book.imageURL ? (
                                    <img
                                        src={book.imageURL}
                                        alt={book.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="text-gray-300">No Image</div>
                                    </div>
                                )}
                            </div>

                            {/* Star Rating */}
                            <div className="flex items-center gap-2 mb-6">
                                {book.owner.reviewCount > 0 ? (
                                    <>
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-5 h-5 ${i < Math.round(book.owner.averageRating) ? 'fill-[#D4A574] text-[#D4A574]' : 'fill-[#E5E5E5] text-[#E5E5E5]'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-[#3D3344] font-semibold">{book.owner.averageRating.toFixed(1)}</span>
                                        <span className="text-[#A0A0A0]">({book.owner.reviewCount} reviews)</span>
                                    </>
                                ) : (
                                    <span className="text-[#A0A0A0]">No reviews yet</span>
                                )}
                            </div>

                            {/* Action Buttons */}
                            {!isOwner && (
                                <div className="space-y-3">
                                    <button
                                        onClick={handleSwapAction}
                                        className={`w-full py-4 rounded-xl font-semibold transition-colors ${existingRequest
                                            ? 'bg-red-50 text-red-500 hover:bg-red-100'
                                            : 'bg-[#8B7BA8] text-white hover:bg-[#7A6A97]'
                                            }`}
                                    >
                                        {existingRequest ? 'Undo Request' : 'Request to Swap'}
                                    </button>
                                    {book.price && book.price > 0 && (
                                        <button
                                            onClick={() => handleSwapAction('buy')}
                                            disabled={existingRequest}
                                            className={`w-full py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${existingRequest
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-[#D4A574] text-white hover:bg-[#C39361]'
                                                }`}
                                        >
                                            <ShoppingBag className="w-5 h-5" />
                                            {existingRequest ? 'Order Pending' : `Buy Now - ₹${book.price}`}
                                        </button>
                                    )}
                                    <button
                                        onClick={toggleWishlist}
                                        className="w-full py-4 rounded-xl border-2 border-[#8B7BA8] text-[#8B7BA8] font-semibold hover:bg-[#F8F4F9] transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#8B7BA8]' : ''}`} />
                                        {isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Book Details (3/5 width) */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Genre Badge */}
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8D5F2] text-[#8B7BA8] text-sm font-medium">
                                {book.genre}
                                <Sparkles className="w-3.5 h-3.5" />
                            </span>
                        </div>

                        {/* Title and Author */}
                        <div>
                            <h1 className="text-4xl font-bold text-[#3D3344] mb-2">{book.title}</h1>
                            <p className="text-xl text-[#6B5B73]">by {book.author}</p>
                        </div>

                        {/* Book Information */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold text-[#3D3344] mb-4">Book Information</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-[#A0A0A0]">
                                        <Star className="w-4 h-4" />
                                        <span>Condition</span>
                                    </div>
                                    <span className="font-semibold text-[#3D3344]">{book.condition}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-[#A0A0A0]">
                                        <ShoppingBag className="w-4 h-4" />
                                        <span>Type</span>
                                    </div>
                                    <span className={`font-semibold ${book.listingType === 'Sell' ? 'text-[#D4A574]' : 'text-[#9B7EBD]'}`}>
                                        {book.listingType === 'Sell' ? 'For Sale' : 'For Swap'}
                                    </span>
                                </div>
                                {book.listingType === 'Sell' && (
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-[#A0A0A0]">
                                            <CreditCard className="w-4 h-4" />
                                            <span>Price</span>
                                        </div>
                                        <span className="font-bold text-xl text-[#3D3344]">₹{book.price}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <span className="text-[#A0A0A0]">Published</span>
                                    <span className="font-semibold text-[#3D3344]">{book.publishedYear || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[#A0A0A0]">Pages</span>
                                    <span className="font-semibold text-[#3D3344]">{book.pages || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[#A0A0A0]">Language</span>
                                    <span className="font-semibold text-[#3D3344]">{book.language || 'English'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Book Keeper */}
                        {!isOwner && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h3 className="font-bold text-[#3D3344] mb-4">Book Keeper</h3>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#9B7EBD] to-[#D4A574] p-0.5">
                                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                            <span className="text-2xl font-bold text-[#9B7EBD]">
                                                {(book.owner.fullName || book.owner.username).charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#3D3344] text-lg">{book.owner.fullName || book.owner.username}</h4>
                                        <div className="flex items-center gap-2 text-[#6B5B73] mb-1">
                                            <MapPin className="w-4 h-4 text-[#D4A574]" />
                                            <span>{book.owner.location || 'Unknown Location'}</span>
                                        </div>
                                        {book.owner.reviewCount > 0 && (
                                            <div className="flex items-center gap-2">
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-4 h-4 ${i < Math.round(book.owner.averageRating) ? 'fill-[#D4A574] text-[#D4A574]' : 'fill-[#E5E5E5] text-[#E5E5E5]'}`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="font-semibold text-[#3D3344]">{book.owner.averageRating.toFixed(1)}</span>
                                                <span className="text-[#A0A0A0]">({book.owner.reviewCount} reviews)</span>
                                            </div>
                                        )}
                                        {book.owner.reviewCount === 0 && (
                                            <span className="text-[#A0A0A0] text-sm">No reviews yet</span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={handleSwapAction}
                                    className={`w-full py-3 rounded-xl border-2 font-semibold transition-colors flex items-center justify-center gap-2 ${existingRequest
                                        ? 'border-red-200 text-red-500 hover:bg-red-50'
                                        : 'border-[#8B7BA8] text-[#8B7BA8] hover:bg-[#F8F4F9]'
                                        }`}
                                >
                                    <Mail className="w-5 h-5" />
                                    {existingRequest ? 'Undo Request' : 'Contact Keeper'}
                                </button>
                            </div>
                        )}

                        {/* Story Summary */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold text-[#3D3344] mb-3">Story Summary</h3>
                            <p className="text-[#6B5B73] leading-relaxed">
                                {book.description || 'No description available for this book.'}
                            </p>
                        </div>

                        {/* How Swapping Works */}
                        {!isOwner && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h3 className="font-bold text-[#3D3344] mb-4">How Swapping Works</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Sparkles className="w-5 h-5 text-[#D4A574] mt-0.5 flex-shrink-0" />
                                        <p className="text-[#6B5B73]">Send a magical swap request to the book keeper</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Sparkles className="w-5 h-5 text-[#D4A574] mt-0.5 flex-shrink-0" />
                                        <p className="text-[#6B5B73]">They'll review your profile and available books</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Sparkles className="w-5 h-5 text-[#D4A574] mt-0.5 flex-shrink-0" />
                                        <p className="text-[#6B5B73]">Agree on exchange details and meeting place</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Sparkles className="w-5 h-5 text-[#D4A574] mt-0.5 flex-shrink-0" />
                                        <p className="text-[#6B5B73]">Meet safely in a cozy location to share stories</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
                        <button
                            onClick={() => setShowPaymentModal(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6 text-gray-500" />
                        </button>

                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-[#F5EEF9] rounded-full flex items-center justify-center mx-auto mb-4">
                                <CreditCard className="w-8 h-8 text-[#9B7EBD]" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#3D3344]">Secure Checkout</h2>
                            <p className="text-[#6B5B73]">Complete your purchase for "{book.title}"</p>
                        </div>

                        <form onSubmit={handlePayment} className="space-y-6">
                            <div className="bg-[#F8F4F9] p-4 rounded-xl flex justify-between items-center">
                                <span className="text-[#6B5B73]">Total Amount</span>
                                <span className="text-xl font-bold text-[#3D3344]">₹{book.price || '0'}</span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#3D3344] mb-2">Shipping Address</label>
                                <textarea
                                    required
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                    placeholder="Enter your full delivery address..."
                                    className="w-full px-4 py-3 rounded-xl bg-[#F5EEF9] border-none focus:ring-2 focus:ring-[#9B7EBD]/20 h-24 resize-none"
                                />
                            </div>

                            <div className="flex items-center gap-2 text-sm text-[#6B5B73] bg-blue-50 p-3 rounded-lg">
                                <Truck className="w-4 h-4 text-blue-500" />
                                <span>Seller will ship within 2-3 business days</span>
                            </div>

                            <button
                                type="submit"
                                disabled={processingPayment}
                                className="w-full py-4 rounded-xl bg-[#9B7EBD] text-white font-bold hover:bg-[#8A6EA8] transition-colors shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {processingPayment ? (
                                    <>Processing...</>
                                ) : (
                                    <>Pay & Place Order</>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
