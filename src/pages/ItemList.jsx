import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchFilters from '../components/SearchFilters';
import { useItems } from '../context/ItemContext';
import ItemCard from '../components/ItemCard';
import { useCategories } from '../hooks/useCategories';

export default function ItemList() {
    const navigate = useNavigate();
    const { categories, loadingCats } = useCategories();
    const {
        items,
        loading,
        error,
        pagination,
        getItems,
        searchQuery,
        filters
    } = useItems();

    // Scroll infinito
    const handleScroll = useCallback(() => {
        if (
            window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
            !loading &&
            pagination.hasMore
        ) {
            getItems(
                { page: pagination.page + 1, q: searchQuery, ...filters },
                false
            );
        }
    }, [loading, pagination, getItems, searchQuery, filters]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return (
        <div className="container mx-auto px-4 pt-20 pb-8">

            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Nuestros Productos
            </h1>

            <button
                onClick={() => navigate('/')}
                className="inline-flex items-center text-2xl hover:shadow-2xl hover:underline transition-all text-black hover:text-amber-500 dark:text-gray-200 dark:hover:text-orange-400 cursor-pointer"
            >
                ← Volver
            </button>

            {!loadingCats && <SearchFilters categories={categories} />}

            <div className="mb-6 text-right">
                <button
                    onClick={() => navigate('/items/new')}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition cursor-pointer"
                >
                    <span className="text-2xl leading-none">+</span> Nuevo Producto
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => (
                    <ItemCard key={item._id} item={item} />
                ))}
            </div>

            {loading && (
                <p className="text-center py-8 text-orange-500 dark:text-orange-400">
                    Cargando…
                </p>
            )}
            {error && (
                <p className="text-center py-4 text-red-500">{error}</p>
            )}
            {!pagination.hasMore && !loading && (
                <p className="text-center py-4 text-gray-600 dark:text-gray-400">
                    Todos los productos cargados
                </p>
            )}
        </div>
    );
}