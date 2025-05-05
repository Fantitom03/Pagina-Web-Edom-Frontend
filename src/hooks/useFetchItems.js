import { useState, useEffect } from 'react';
import api from '../api/edomApi';
import { useItems } from '../context/ItemContext';

export const useFetchItems = () => {
    const { items, setItems, searchQuery, filters } = useItems(); // Usa el contexto
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchItems = async (reset = false) => {
        try {
            setLoading(true);
            const currentPage = reset ? 1 : page;
            
            const response = await api.get('/items', {
                params: {
                    page: currentPage,
                    limit: 12,
                    q: searchQuery,
                    category: filters.category,
                    minPrice: filters.minPrice,
                    maxPrice: filters.maxPrice
                }
            });

            setItems(prev => reset ? response.data.items : [...prev, ...response.data.items]);
            setHasMore(response.data.pagination.total > currentPage * 12);
            setPage(currentPage + 1);
        } catch (err) {
            setError(err.response?.data?.message || 'Error cargando productos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight - 100 || loading || !hasMore) return;
            fetchItems();
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore, page]);

    useEffect(() => {
        fetchItems(true);
    }, [searchQuery, filters]);

    return { items, loading, error, hasMore, fetchItems };
};