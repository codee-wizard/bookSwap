import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { BookCard } from '../components/BookCard';
import { bookService } from '../services/bookService';
import { swapService } from '../services/swapService';
import { Search, MapPin, Filter } from 'lucide-react';

export function Homepage() {
    const [books, setBooks] = useState([]);
    const [nearbyBooks, setNearbyBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const [genre, setGenre] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        setPage(1); // Reset page when filters change
        fetchBooks(1, true);
    }, [search, genre]);

    const fetchBooks = async (pageNum = 1, isNewFilter = false) => {
        try {
            const params = { search, genre, page: pageNum, limit: 8 };
            const res = await bookService.getAllBooks(params);

            if (isNewFilter) {
                setBooks(res.data.data);
            } else {
                setBooks(prev => [...prev, ...res.data.data]);
            }

            setHasMore(res.data.pagination.currentPage < res.data.pagination.totalPages);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchBooks(nextPage, false);
    };

    // console.log(books)

    const handleRequestSwap = async (book) => {
        try {
            const requestType = book.type || 'swap'; // Default to 'swap' if type not specified
            await swapService.createRequest({ bookId: book._id, type: requestType });
            const message = requestType === 'buy' ? 'Buy request sent!' : 'Swap request sent!';
            alert(message);
        } catch (error) {
            alert(error.response?.data?.message || 'Error sending request');
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF8F0]">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-[#F5EEF9] via-[#F9F6FA] to-[#FFF8F0] py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#3D3344] mb-3 sm:mb-4">
                        Discover Your Next <span className="text-[#9B7EBD]">Magical Adventure</span>
                    </h1>
                    <p className="text-[#6B5B73] text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl">
                        Explore books from our community or find treasures right in your neighborhood.
                    </p>

                    {/* Search & Filter */}
                    <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-lg border border-[#E8C4D4]/30 flex flex-row gap-3 sm:gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 sm:top-3.5 w-4 sm:w-5 h-4 sm:h-5 text-[#A795AD]" />
                            <input
                                type="text"
                                placeholder="Search by title or author..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-[#F5EEF9] border-none focus:ring-2 focus:ring-[#9B7EBD]/20 text-[#3D3344] placeholder-[#A795AD] text-sm sm:text-base"
                            />
                        </div>
                        <div className="flex-shrink-0">
                            <select
                                value={genre}
                                onChange={(e) => setGenre(e.target.value)}
                                className="px-3 py-2.5 sm:py-3 rounded-xl bg-[#F5EEF9] text-[#6B5B73] border-none focus:ring-2 focus:ring-[#9B7EBD]/20 text-sm sm:text-base"
                            >
                                <option value="">All Genres</option>
                                <option value="Fiction">Fiction</option>
                                <option value="Self-help">Self-help</option>
                                <option value="Fantasy">Fantasy</option>
                                <option value="Science Fiction">Science Fiction (Sci-Fi)</option>
                                <option value="Dystopian">Dystopian</option>
                                <option value="Adventure">Adventure</option>
                                <option value="Romance">Romance</option>
                                <option value="Historical Fiction">Historical Fiction</option>
                                <option value="Horror">Horror</option>
                                <option value="Thriller">Thriller</option>
                                <option value="Mystery">Mystery / Crime</option>
                                <option value="Detective Fiction">Detective Fiction</option>
                                <option value="Drama">Drama</option>
                                <option value="Literary Fiction">Literary Fiction</option>
                                <option value="Magical Realism">Magical Realism</option>
                                <option value="Realistic Fiction">Realistic Fiction</option>
                                <option value="Mythology">Mythology / Folklore</option>
                                <option value="Young Adult">Young Adult (YA)</option>
                                <option value="Childrens Fiction">Children's Fiction</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">


                {/* All Books Section */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <Filter className="w-6 h-6 text-[#9B7EBD]" />
                        <h2 className="text-2xl font-bold text-[#3D3344]">Explore Collection</h2>
                    </div>

                    {loading ? (
                        <div className="text-center py-12 text-[#6B5B73]">Loading magical books...</div>
                    ) : books.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {books.map(book => (
                                <BookCard key={book._id} book={book} onRequestSwap={handleRequestSwap} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-2xl border border-[#E8C4D4]/30">
                            <p className="text-[#6B5B73]">No books found matching your criteria.</p>
                        </div>
                    )}

                    {/* Load More Button */}
                    {hasMore && !loading && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={handleLoadMore}
                                className="px-8 py-3 rounded-xl bg-white border border-[#E8C4D4] text-[#9B7EBD] font-semibold hover:bg-[#F5EEF9] transition-colors shadow-sm"
                            >
                                Load More Books
                            </button>
                        </div>
                    )}
                </section>
            </div>

            <Footer />
        </div>
    );
}
