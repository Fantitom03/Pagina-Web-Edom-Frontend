import { useState, useEffect } from 'react';
import api from '../api/edomApi';

export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loadingCats, setLoadingCats] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get('/categories');
                setCategories(res.data);
            } catch (err) {
                console.error('Error cargando categorías', err);
            } finally {
                setLoadingCats(false);
            }
        })();
    }, []);

    return { categories, loadingCats };
};