import API from './api';

export const bookService = {
    getAllBooks: (params) => API.get('/books', { params }),
    getBookById: (id) => API.get(`/books/${id}`),
    createBook: (data) => API.post('/books', data),
    updateBook: (id, data) => API.put(`/books/${id}`, data),
    deleteBook: (id) => API.delete(`/books/${id}`)
};
