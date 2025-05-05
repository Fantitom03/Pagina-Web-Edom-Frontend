import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useItems } from '../context/ItemContext';
import { useAuth } from '../context/AuthContext';
import { can } from '../utils/auth';

export const useItemDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { getItem, deleteItem } = useItems();
    
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    // Permisos
    const canEdit = can(user, 'update:items');
    const canDelete = can(user, 'delete:items');

    // Cargar item
    useEffect(() => {
        let isMounted = true;
        const loadItem = async () => {
            try {
                setLoading(true);
                const data = await getItem(id);
                if (isMounted) setItem(data);
            } catch (error) {
                console.error('Error cargando item:', error);
                if (isMounted) navigate('/items', { replace: true });
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        loadItem();
        return () => { isMounted = false };
    }, [id, navigate, getItem]);

    // Manejar eliminación
    const handleDelete = async () => {
        if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
        
        try {
            setIsDeleting(true);
            await deleteItem(id);
            navigate('/items', { replace: true });
        } catch (error) {
            console.error('Error eliminando item:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    // Calcular precios
    const priceData = item ? {
        original: item.price,
        discount: item.discount || 0,
        final: item.discount > 0 
            ? item.price * (1 - item.discount / 100)
            : item.price
    } : null;

    return {
        item,
        loading,
        isDeleting,
        canEdit,
        canDelete,
        priceData,
        handleDelete,
        navigate
    };
};