import { useState, useEffect } from 'react';
import api from '../api/edomApi';

export const useRoles = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get('users/roles');
                setRoles(res.data);
            } catch (err) {
                console.error('Error cargando roles', err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return { roles, loading };
};