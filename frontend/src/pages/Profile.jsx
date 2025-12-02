import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { swapService } from '../services/swapService';
import { authService } from '../services/authServices';
import { Edit2, Mail, MapPin, Calendar, Star, Trophy, BookOpen, Repeat, X } from 'lucide-react';

export function Profile() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
    const [swapHistory, setSwapHistory] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({
        username: user.username || '',
        fullName: user.fullName || '',
        location: user.location || '',
        email: user.email || '',
        about: user.about || ''
    });

    const [stats, setStats] = useState({
        booksListed: 0,
        averageRating: 0,
        reviewCount: 0
    });

    useEffect(() => {
        fetchSwapHistory();
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await authService.getStats();
            setStats(res.data.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchSwapHistory = async () => {
        try {
            const res = await swapService.getMyRequests();
            setSwapHistory(res.data.data);
        } catch (error) {
            console.error('Error fetching swap history:', error);
        }
    };

    const completedSwaps = swapHistory.filter(s => s.status === 'accepted').length;

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const handleSaveProfile = async () => {
        try {
            const res = await authService.updateProfile(editData);
            const updatedUser = { ...user, ...res.data.data };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setShowEditModal(false);
            alert('Profile updated successfully!');
        } catch (error) {
            alert('Error updating profile: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#F5EEF9] via-[#F9F6FA] to-[#FFF8F0]">
            <Navbar />

            <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-[#E8C4D4]/30 shadow-lg sticky top-24">
                            {/* Avatar */}
                            <div className="flex justify-center mb-6">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#C8B6D6] to-[#9B7EBD] flex items-center justify-center text-white text-4xl font-bold">
                                        {getInitials(user.fullName || user.username || 'U')}
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-white border-4 border-white flex items-center justify-center">
                                        <span className="text-2xl">✨</span>
                                    </div>
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-[#3D3344] mb-2">{user.fullName || user.username}</h2>
                                <div className="space-y-2 text-sm text-[#6B5B73]">
                                    <div className="flex items-center justify-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        <span>{user.email}</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>{user.location || 'Unknown'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="space-y-4 mb-6">
                                <div className="flex items-center justify-between pb-3 border-b border-[#E8C4D4]/30">
                                    <div className="flex items-center gap-2 text-[#6B5B73]">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-sm">Member Since</span>
                                    </div>
                                    <span className="font-bold text-[#3D3344]">Jan 2024</span>
                                </div>
                                <div className="flex items-center justify-between pb-3 border-b border-[#E8C4D4]/30">
                                    <div className="flex items-center gap-2 text-[#6B5B73]">
                                        <Star className="w-4 h-4 fill-current text-[#D4A574]" />
                                        <span className="text-sm">Rating</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {stats.reviewCount > 0 ? (
                                            <>
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3 h-3 ${i < Math.round(stats.averageRating) ? 'fill-current text-[#D4A574]' : 'text-[#E8C4D4]'}`} />
                                                ))}
                                                <span className="ml-1 font-bold text-[#3D3344]">{stats.averageRating.toFixed(1)}</span>
                                            </>
                                        ) : (
                                            <span className="text-sm text-[#A0A0A0]">No ratings</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pb-3 border-b border-[#E8C4D4]/30">
                                    <div className="flex items-center gap-2 text-[#6B5B73]">
                                        <Repeat className="w-4 h-4" />
                                        <span className="text-sm">Total Swaps</span>
                                    </div>
                                    <span className="font-bold text-[#3D3344]">{completedSwaps}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[#6B5B73]">
                                        <BookOpen className="w-4 h-4" />
                                        <span className="text-sm">Books Listed</span>
                                    </div>
                                    <span className="font-bold text-[#3D3344]">{stats.booksListed}</span>
                                </div>
                            </div>

                            {/* Edit Button */}
                            <button
                                onClick={() => setShowEditModal(true)}
                                className="w-full py-3 rounded-xl border border-[#C8B6D6] text-[#9B7EBD] font-medium hover:bg-[#F5EEF9] transition-colors flex items-center justify-center gap-2"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit Profile
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* About Me */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-[#E8C4D4]/30 shadow-md">
                            <h3 className="text-xl font-bold text-[#3D3344] mb-4">About Me</h3>
                            <p className="text-[#6B5B73] leading-relaxed">
                                {user.about || "An avid reader and lover of stories. Always seeking new adventures through books and sharing the magic of reading with fellow book enthusiasts. Favorite genres include fantasy, mystery, and literary fiction."}
                            </p>
                        </div>

                        {/* Achievements */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-[#E8C4D4]/30 shadow-md">
                            <div className="flex items-center gap-2 mb-6">
                                <Trophy className="w-6 h-6 text-[#D4A574]" />
                                <h3 className="text-xl font-bold text-[#3D3344]">Achievements</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-[#FFF8F0] rounded-xl p-4 text-center border border-[#E8C4D4]/30">
                                    <div className="text-4xl mb-2">🏆</div>
                                    <div className="font-bold text-[#3D3344]">First Swap</div>
                                    <div className="text-sm text-[#6B5B73]">Completed</div>
                                </div>
                                <div className="bg-[#F5EEF9] rounded-xl p-4 text-center border border-[#C8B6D6]/30">
                                    <div className="text-4xl mb-2">📚</div>
                                    <div className="font-bold text-[#3D3344]">Bookworm</div>
                                    <div className="text-sm text-[#6B5B73]">10+ Swaps</div>
                                </div>
                                <div className="bg-[#FFF8F0] rounded-xl p-4 text-center border border-[#D4A574]/30">
                                    <div className="text-4xl mb-2">⭐</div>
                                    <div className="font-bold text-[#3D3344]">Trusted Keeper</div>
                                    <div className="text-sm text-[#6B5B73]">5 Star Rating</div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Swap History */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-[#E8C4D4]/30 shadow-md">
                            <div className="flex items-center gap-2 mb-6">
                                <Repeat className="w-6 h-6 text-[#9B7EBD]" />
                                <h3 className="text-xl font-bold text-[#3D3344]">Recent Swap History</h3>
                            </div>
                            <div className="space-y-4">
                                {swapHistory.slice(0, 3).map((swap, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-[#F5EEF9] rounded-xl border border-[#C8B6D6]/20">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-[#C8B6D6]/30 flex items-center justify-center">
                                                <Repeat className="w-6 h-6 text-[#9B7EBD]" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-[#3D3344]">Swapped with {swap.requester?.username || 'User'}</div>
                                                <div className="text-sm text-[#6B5B73]">Book: {swap.book?.title || 'N/A'}</div>
                                                <div className="text-xs text-[#A795AD]">{new Date(swap.createdAt).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${swap.status === 'accepted' ? 'bg-[#C8B6D6]/20 text-[#9B7EBD]' :
                                            swap.status === 'pending' ? 'bg-[#E8C4D4]/20 text-[#D4A574]' :
                                                'bg-gray-100 text-gray-600'
                                            }`}>
                                            {swap.status}
                                        </span>
                                    </div>
                                ))}
                                {swapHistory.length === 0 && (
                                    <p className="text-center text-[#6B5B73] py-8">No swap history yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-[#3D3344]">Edit Profile</h2>
                            <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-[#F5EEF9] rounded-full transition-colors">
                                <X className="w-6 h-6 text-[#6B5B73]" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#3D3344] mb-2">Username</label>
                                <input
                                    type="text"
                                    value={editData.username}
                                    onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-[#F5EEF9] border-none focus:ring-2 focus:ring-[#9B7EBD]/20"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#3D3344] mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={editData.fullName}
                                    onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-[#F5EEF9] border-none focus:ring-2 focus:ring-[#9B7EBD]/20"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#3D3344] mb-2">Email</label>
                                <input
                                    type="email"
                                    value={editData.email}
                                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-[#F5EEF9] border-none focus:ring-2 focus:ring-[#9B7EBD]/20"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#3D3344] mb-2">Location</label>
                                <input
                                    type="text"
                                    value={editData.location}
                                    onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-[#F5EEF9] border-none focus:ring-2 focus:ring-[#9B7EBD]/20"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#3D3344] mb-2">About Me</label>
                                <textarea
                                    value={editData.about}
                                    onChange={(e) => setEditData({ ...editData, about: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-[#F5EEF9] border-none focus:ring-2 focus:ring-[#9B7EBD]/20 h-32 resize-none"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSaveProfile}
                            className="w-full mt-6 py-4 rounded-xl bg-[#9B7EBD] text-white font-bold hover:bg-[#8A6EA8] transition-colors shadow-lg"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
