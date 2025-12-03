import API from './api'

export const authService = {
    login: (credential) => API.post('/auth/login', credential),
    register: (data) => API.post('/auth/register', data),
    updateProfile: (data) => API.put('/auth/profile', data),
    getStats: () => API.get('/auth/stats'),
    addRating: (userId, data) => API.post(`/auth/rate/${userId}`, data),
    logout: () => {
        localStorage.removeItem('token')
    }
}