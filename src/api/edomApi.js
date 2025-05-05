import axios from 'axios';

const api = axios.create({
    baseURL: 'https://pagina-web-edom-backend.onrender.com/api',
});

// interceptor que añade el Authorization a todas las requests
api.interceptors.request.use(config => {
    const token = localStorage.getItem("edomToken");
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));

// Items (electrodomésticos)
export const getItems = (page, limit) => api.get('/items', { params: { page, limit } });
export const getItem = (id) => api.get(`/items/${id}`);
export const createItem = (data) => api.post('/items', data);
export const updateItem = (id, data) => api.put(`/items/${id}`, data);
export const deleteItem = (id) => api.delete(`/items/${id}`);
export const searchItems = (params) => api.get('/items/search', { params });


// Users
export const getUsers = (page, limit) => api.get('/users', { params: { page, limit } });
export const searchUsers = (id) => api.get(`/users/search/?username=`, { params: { username } });
export const createUser = (data) => api.post('/users', data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const getRoles = () => api.get('users/roles');

export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const registerUser = (data) => api.post('/auth/register', data);

export default api;