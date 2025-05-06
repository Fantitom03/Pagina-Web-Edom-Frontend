import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/edomApi';

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/categories');
            setCategories(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error cargando categorías');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    const createCategory = useCallback(async (cat) => {
        const { data } = await api.post('/categories', cat);
        setCategories(prev => [...prev, data]);
        return data;
    }, []);

    const updateCategory = useCallback(async (id, cat) => {
        const { data } = await api.put(`/categories/${id}`, cat);
        setCategories(prev => prev.map(c => c._id === id ? data : c));
        return data;
    }, []);

    const deleteCategory = useCallback(async (id) => {
        await api.delete(`/categories/${id}`);
        setCategories(prev => prev.filter(c => c._id !== id));
    }, []);

    return (
        <CategoryContext.Provider value={{ categories, loading, error, fetchCategories, createCategory, updateCategory, deleteCategory }}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategory = () => useContext(CategoryContext);
