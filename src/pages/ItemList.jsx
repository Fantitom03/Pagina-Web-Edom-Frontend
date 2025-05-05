import { useEffect } from 'react';
import ItemCard from "../components/ItemCard";
import { useItems } from '../hooks/useItems';
import { useItemFilters } from '../context/ItemContext';
import { useCallback } from 'react';

const ItemList = () => {
    const { items, loading, error, pagination, getItems } = useItems();
    const { searchQuery, filters } = useItemFilters();

    // Efecto para filtros y búsqueda
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            getItems({
                q: searchQuery,
                ...filters
            }, true); // Resetear paginación
        }, 500); // Debounce de 500ms

        return () => clearTimeout(timeoutId);
    }, [searchQuery, filters]);

    // Scroll handler modificado
    const handleScroll = useCallback(() => {
        if (
            window.innerHeight + document.documentElement.scrollTop <
            document.documentElement.offsetHeight - 100 ||
            loading ||
            !pagination.hasMore
        ) return;

        getItems({ page: pagination.page + 1 });
    }, [loading, pagination, getItems]);

    // Efecto de scroll mejorado
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]); // Dependencia correcta


    return (
        <div className="container mx-auto px-4 pt-20 pb-8">
            <h1 className="text-3xl font-bold mb-6">Nuestros Productos</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                    <ItemCard key={item._id} item={item} />
                ))}
            </div>

            {loading && <div className="text-center py-8">Cargando...</div>}
            {error && <div className="text-red-500 text-center py-4">{error}</div>}
            {!pagination.hasMore && <div className="text-center py-4">Todos los productos cargados</div>}
        </div>
    );
};

export default ItemList;