import { useEffect, useState, useCallback } from 'react';
import api from '../api/edomApi';

export function useItems() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ 
        page: 1, 
        hasMore: true,
        total: 0,
        limit: 12
    });

    const getItems = useCallback(async (params = {}, reset = false) => {
        try {
            setLoading(true);
            const currentPage = reset ? 1 : params.page || pagination.page;

            const response = await api.get('/items', {
                params: {
                    page: currentPage,
                    limit: pagination.limit,
                    ...params
                }
            });

            setItems(prev => reset 
                ? response.data.items 
                : [...prev, ...response.data.items]
            );

            setPagination({
                page: response.data.pagination.page,
                limit: response.data.pagination.limit,
                total: response.data.pagination.total,
                hasMore: response.data.pagination.hasMore
            });

        } catch (err) {
            setError(err.response?.data?.message || 'Error cargando productos');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit]);

    const getItem = useCallback(async (id) => {
        try {
            setLoading(true);
            const response = await api.get(`/items/${id}`);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Error cargando producto');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const createItem = useCallback(async (itemData) => {
        try {
            const response = await api.post('/items', itemData);
            setItems(prev => [response.data, ...prev]);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Error creando producto');
            throw err;
        }
    }, []);

    const updateItem = useCallback(async (id, itemData) => {
        try {
            const response = await api.put(`/items/${id}`, itemData);
            setItems(prev => prev.map(item => 
                item._id === id ? response.data : item
            ));
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Error actualizando producto');
            throw err;
        }
    }, []);

    const deleteItem = useCallback(async (id) => {
        try {
            await api.delete(`/items/${id}`);
            setItems(prev => prev.filter(item => item._id !== id));
        } catch (err) {
            setError(err.response?.data?.message || 'Error eliminando producto');
            throw err;
        }
    }, []);

    const getCategorys = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/category');
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Error cargando categorias');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getCategory = useCallback(async (id) => {
        try {
            setLoading(true);
            const response = await api.get(`/category/${id}`);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Error cargando categoria');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    
    useEffect(() => {
        getItems({}, true);
    }, [getItems]);

    return {
        items,
        loading,
        error,
        pagination,
        getItems,
        getItem,
        createItem,
        updateItem,
        deleteItem,
        getCategory
    };
}