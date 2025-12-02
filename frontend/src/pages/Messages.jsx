import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { messageService } from '../services/messageService';
import { swapService } from '../services/swapService';
import { MessageCircle, Send, Clock, BookOpen, User, Trash2, Check, X, Truck, Package } from 'lucide-react';

export function Messages() {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchConversations();
        // Auto-refresh every 5 seconds
        const interval = setInterval(fetchConversations, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation.swapRequest._id);
            // Auto-refresh messages every 3 seconds when viewing a conversation
            const interval = setInterval(() => {
                fetchMessages(selectedConversation.swapRequest._id);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [selectedConversation]);

    const fetchConversations = async () => {
        try {
            const res = await messageService.getConversations();
            setConversations(res.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching conversations:', error);
            setLoading(false);
        }
    };

    const fetchMessages = async (swapRequestId) => {
        try {
            const res = await messageService.getMessages(swapRequestId);
            setMessages(res.data.data);

            // Mark unread messages as read
            const unreadMessages = res.data.data.filter(
                msg => msg.receiver._id === currentUser._id && !msg.read
            );
            for (const msg of unreadMessages) {
                await messageService.markAsRead(msg._id);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        try {
            await messageService.sendMessage(selectedConversation.swapRequest._id, newMessage);
            setNewMessage('');
            fetchMessages(selectedConversation.swapRequest._id);
            fetchConversations(); // Refresh to update last message
        } catch (error) {
            alert('Error sending message');
        }
    };

    const formatTime = (date) => {
        const now = new Date();
        const messageDate = new Date(date);
        const diffInHours = (now - messageDate) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return messageDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else {
            return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    const handleDeleteConversation = async (swapRequestId, e) => {
        e.stopPropagation(); // Prevent selecting the conversation
        if (window.confirm('Are you sure you want to delete this conversation? This will remove all messages.')) {
            try {
                await messageService.deleteConversation(swapRequestId);
                // If this was the selected conversation, clear it
                if (selectedConversation?.swapRequest._id === swapRequestId) {
                    setSelectedConversation(null);
                    setMessages([]);
                }
                fetchConversations(); // Refresh the list
            } catch (error) {
                alert('Error deleting conversation');
            }
        }
    };

    const handleUpdateStatus = async (status) => {
        try {
            await swapService.updateStatus(selectedConversation.swapRequest._id, status);
            // Update local state to reflect change
            setSelectedConversation(prev => ({
                ...prev,
                swapRequest: { ...prev.swapRequest, status }
            }));
            fetchConversations(); // Refresh list to update any status indicators if we add them
            fetchMessages(selectedConversation.swapRequest._id); // Refresh messages to see automated message
        } catch (error) {
            alert('Error updating status');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F5EEF9] via-[#F9F6FA] to-[#FFF8F0]">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center gap-2 mb-6">
                    <MessageCircle className="w-6 h-6 text-[#9B7EBD]" />
                    <h1 className="text-3xl font-bold text-[#3D3344]">Messages</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Conversations List */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-[#E8C4D4]/30 shadow-lg overflow-hidden">
                            <div className="p-4 border-b border-[#E8C4D4]/30">
                                <h2 className="font-bold text-[#3D3344]">Conversations</h2>
                            </div>
                            <div className="max-h-[600px] overflow-y-auto">
                                {loading ? (
                                    <p className="text-center py-8 text-[#6B5B73]">Loading...</p>
                                ) : conversations.length > 0 ? (
                                    conversations.map((conv) => (
                                        <div
                                            key={conv.swapRequest._id}
                                            onClick={() => setSelectedConversation(conv)}
                                            className={`relative group p-4 border-b border-[#E8C4D4]/20 cursor-pointer hover:bg-[#F5EEF9] transition-colors ${selectedConversation?.swapRequest._id === conv.swapRequest._id
                                                ? 'bg-[#F5EEF9]'
                                                : ''
                                                }`}
                                        >
                                            <button
                                                onClick={(e) => handleDeleteConversation(conv.swapRequest._id, e)}
                                                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/90 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 shadow-md"
                                                title="Delete conversation"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </button>
                                            <div className="flex items-start gap-3">
                                                {conv.swapRequest.book?.imageURL ? (
                                                    <img
                                                        src={conv.swapRequest.book.imageURL}
                                                        alt={conv.swapRequest.book.title}
                                                        className="w-12 h-16 object-cover rounded"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-16 bg-[#F5EEF9] rounded flex items-center justify-center">
                                                        <BookOpen className="w-6 h-6 text-[#9B7EBD]" />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-semibold text-[#3D3344] truncate">
                                                            {conv.otherUser.fullName || conv.otherUser.username}
                                                        </p>
                                                        {conv.unreadCount > 0 && (
                                                            <span className="ml-2 px-2 py-0.5 bg-[#9B7EBD] text-white text-xs rounded-full">
                                                                {conv.unreadCount}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-[#6B5B73] truncate">
                                                        {conv.swapRequest.book?.title || 'Book'}
                                                    </p>
                                                    {conv.lastMessage && (
                                                        <p className="text-xs text-[#A795AD] truncate mt-1">
                                                            {conv.lastMessage.content}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center py-8 text-[#6B5B73]">No conversations yet</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-[#E8C4D4]/30 shadow-lg h-[600px] flex flex-col">
                            {selectedConversation ? (
                                <>
                                    {/* Chat Header */}
                                    <div className="p-4 border-b border-[#E8C4D4]/30 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#9B7EBD] to-[#D4A574] flex items-center justify-center text-white font-bold">
                                                {(selectedConversation.otherUser.fullName || selectedConversation.otherUser.username).charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-[#3D3344]">
                                                    {selectedConversation.otherUser.fullName || selectedConversation.otherUser.username}
                                                </h3>
                                                <div className="flex items-center gap-2 text-sm text-[#6B5B73]">
                                                    <span>About: {selectedConversation.swapRequest.book?.title}</span>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${selectedConversation.swapRequest.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                                        selectedConversation.swapRequest.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                            selectedConversation.swapRequest.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                                                selectedConversation.swapRequest.status === 'delivered' ? 'bg-purple-100 text-purple-700' :
                                                                    'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {selectedConversation.swapRequest.status.charAt(0).toUpperCase() + selectedConversation.swapRequest.status.slice(1)}
                                                    </span>
                                                    {selectedConversation.swapRequest.type === 'buy' && (
                                                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#E8D5F2] text-[#9B7EBD]">
                                                            Order
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Accept/Deny Actions for Owner */}
                                        {selectedConversation.swapRequest.status === 'pending' &&
                                            selectedConversation.swapRequest.owner._id === currentUser._id && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleUpdateStatus('accepted')}
                                                        className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                                                        title="Accept Swap"
                                                    >
                                                        <Check className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus('rejected')}
                                                        className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                                        title="Decline Swap"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            )}

                                        {/* Shipping Actions for Owner (Buy Requests) */}
                                        {selectedConversation.swapRequest.type === 'buy' &&
                                            selectedConversation.swapRequest.owner._id === currentUser._id && (
                                                <div className="flex gap-2">
                                                    {selectedConversation.swapRequest.status === 'accepted' && (
                                                        <button
                                                            onClick={() => handleUpdateStatus('shipped')}
                                                            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors text-sm font-medium"
                                                        >
                                                            <Package className="w-4 h-4" />
                                                            Mark Shipped
                                                        </button>
                                                    )}
                                                    {selectedConversation.swapRequest.status === 'shipped' && (
                                                        <button
                                                            onClick={() => handleUpdateStatus('delivered')}
                                                            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors text-sm font-medium"
                                                        >
                                                            <Truck className="w-4 h-4" />
                                                            Mark Delivered
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                    </div>

                                    {/* Messages */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                        {messages.map((msg) => {
                                            const isSent = msg.sender._id === currentUser._id;
                                            return (
                                                <div
                                                    key={msg._id}
                                                    className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div
                                                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${isSent
                                                            ? 'bg-[#9B7EBD] text-white'
                                                            : 'bg-[#F5EEF9] text-[#3D3344]'
                                                            }`}
                                                    >
                                                        <p className="text-sm">{msg.content}</p>
                                                        <p
                                                            className={`text-xs mt-1 ${isSent ? 'text-white/70' : 'text-[#A795AD]'
                                                                }`}
                                                        >
                                                            {formatTime(msg.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Message Input */}
                                    <form onSubmit={handleSendMessage} className="p-4 border-t border-[#E8C4D4]/30">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder="Type a message..."
                                                className="flex-1 px-4 py-3 rounded-xl bg-[#F5EEF9] border-none focus:ring-2 focus:ring-[#9B7EBD]/20 text-[#3D3344]"
                                            />
                                            <button
                                                type="submit"
                                                className="px-6 py-3 rounded-xl bg-[#9B7EBD] text-white hover:bg-[#8A6EA8] transition-colors flex items-center gap-2"
                                            >
                                                <Send className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-[#A795AD]">
                                    <div className="text-center">
                                        <MessageCircle className="w-16 h-16 mx-auto mb-4 text-[#C8B6D6]" />
                                        <p>Select a conversation to start messaging</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
