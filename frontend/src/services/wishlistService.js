import API from './api';

export const wishlistService = {
    getWishlist: () => API.get('/wishlist'),
    addToWishlist: (bookId) => API.post(`/wishlist/${bookId}`),
    removeFromWishlist: (bookId) => API.delete(`/wishlist/${bookId}`)
};
