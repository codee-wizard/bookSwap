import API from './api';

export const swapService = {
    createRequest: (data) => API.post('/swaps', data),
    getMyRequests: () => API.get('/swaps'),
    updateStatus: (id, status) => API.put(`/swaps/${id}`, { status }),
    cancelRequest: (id) => API.delete(`/swaps/${id}`)
};
