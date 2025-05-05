import axios from 'axios';

const api = axios.create({
    baseURL: 'https://pagina-web-edom-backend.onrender.com/api',
});

// Items (electrodomésticos)
export const getItems = (page, limit) => api.get('/items', { params: { page, limit } });
export const getItem = (id) => api.get(`/items/${id}`);
export const createItem = (data) => api.post('/items', data);
export const updateItem = (id, data) => api.put(`/items/${id}`, data);
export const deleteItem = (id) => api.delete(`/items/${id}`);
export const searchItems = (params) => api.get('/items/search', { params });

export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const registerUser = (data) => api.post('/auth/register', data);

export default api;