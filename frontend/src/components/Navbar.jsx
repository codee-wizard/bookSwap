import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { BookOpen, LogOut, User, MessageCircle, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { messageService } from '../services/messageService';

export function Navbar() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [unreadCount, setUnreadCount] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        fetchUnreadCount();
        // Update unread count every 10 seconds
        const interval = setInterval(fetchUnreadCount, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const res = await messageService.getUnreadCount();
            setUnreadCount(res.data.data.count);
        } catch (error) {
            // Silently fail - user might not be logged in
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    return (
        <>
            <nav className="bg-white/80 backdrop-blur-md border-b border-[#E8C4D4]/30 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <BookOpen className="w-8 h-8 text-[#9B7EBD] group-hover:scale-110 transition-transform" />
                            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#9B7EBD] to-[#D4A574] bg-clip-text text-transparent">
                                BookSwap
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-6">
                            <Link to="/" className="text-[#6B5B73] hover:text-[#9B7EBD] font-medium transition-colors">
                                Home
                            </Link>
                            <Link to="/my-books" className="text-[#6B5B73] hover:text-[#9B7EBD] font-medium transition-colors">
                                My Books
                            </Link>
                            <Link to="/wishlist" className="text-[#6B5B73] hover:text-[#9B7EBD] font-medium transition-colors">
                                Wishlist
                            </Link>
                            <Link to="/messages" className="relative text-[#6B5B73] hover:text-[#9B7EBD] font-medium transition-colors flex items-center gap-1">
                                <MessageCircle className="w-4 h-4" />
                                Messages
                                {unreadCount > 0 && (
                                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#D4A574] text-white text-xs rounded-full flex items-center justify-center font-bold">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </Link>

                            <div className="flex items-center gap-4 pl-6 border-l border-[#E8C4D4]">
                                <Link to="/profile" className="flex items-center gap-2 text-[#3D3344] hover:text-[#9B7EBD] transition-colors group">
                                    <div className="p-1 rounded-full bg-[#F5EEF9] group-hover:bg-[#E8D5F2] transition-colors">
                                        <User className="w-5 h-5 text-[#9B7EBD]" />
                                    </div>
                                    <span className="font-medium">{user.username}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#E8C4D4] text-[#6B5B73] hover:bg-[#FFF8F0] hover:text-[#D4A574] transition-all"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg text-[#6B5B73] hover:bg-[#F5EEF9] transition-colors"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-40 bg-white">
                    <div className="flex flex-col h-full pt-20 px-6 pb-6">
                        <div className="flex-1 space-y-4">
                            <Link
                                to="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-3 px-4 rounded-xl text-[#6B5B73] hover:bg-[#F5EEF9] hover:text-[#9B7EBD] font-medium transition-colors"
                            >
                                Home
                            </Link>
                            <Link
                                to="/my-books"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-3 px-4 rounded-xl text-[#6B5B73] hover:bg-[#F5EEF9] hover:text-[#9B7EBD] font-medium transition-colors"
                            >
                                My Books
                            </Link>
                            <Link
                                to="/wishlist"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-3 px-4 rounded-xl text-[#6B5B73] hover:bg-[#F5EEF9] hover:text-[#9B7EBD] font-medium transition-colors"
                            >
                                Wishlist
                            </Link>
                            <Link
                                to="/messages"
                                onClick={() => setMobileMenuOpen(false)}
                                className="relative block py-3 px-4 rounded-xl text-[#6B5B73] hover:bg-[#F5EEF9] hover:text-[#9B7EBD] font-medium transition-colors"
                            >
                                <span className="flex items-center gap-2">
                                    <MessageCircle className="w-4 h-4" />
                                    Messages
                                    {unreadCount > 0 && (
                                        <span className="ml-auto px-2 py-0.5 bg-[#D4A574] text-white text-xs rounded-full font-bold">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </span>
                            </Link>
                            <Link
                                to="/profile"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-3 px-4 rounded-xl text-[#6B5B73] hover:bg-[#F5EEF9] hover:text-[#9B7EBD] font-medium transition-colors"
                            >
                                <span className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Profile ({user.username})
                                </span>
                            </Link>
                        </div>

                        <button
                            onClick={() => {
                                handleLogout();
                                setMobileMenuOpen(false);
                            }}
                            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#9B7EBD] text-white font-medium hover:bg-[#8A6EA8] transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
