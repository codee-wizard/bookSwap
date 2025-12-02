import API from './api';

export const messageService = {
    getConversations: () => API.get('/messages/conversations'),
    getMessages: (swapRequestId) => API.get(`/messages/${swapRequestId}`),
    sendMessage: (swapRequestId, content) => API.post(`/messages/${swapRequestId}`, { content }),
    markAsRead: (messageId) => API.put(`/messages/${messageId}/read`),
    getUnreadCount: () => API.get('/messages/unread/count'),
    deleteConversation: (swapRequestId) => API.delete(`/messages/${swapRequestId}`)
};
