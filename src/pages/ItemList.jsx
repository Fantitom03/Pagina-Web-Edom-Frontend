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
        searchQuery,
        filters,
        getItems
    } = useItems();

    // Scroll infinito
    const handleScroll = useCallback(() => {
        if (
            window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
            !loading &&
            pagination.hasMore   // ahora funciona
        ) {
            getItems({ page: pagination.page + 1, q: searchQuery, ...filters }, false);
        }
    }, [loading, pagination, getItems, searchQuery, filters]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return (
        <div className="container mx-auto px-4 pt-20 pb-8">
            {/* Botón de volver */}
            <button
                onClick={() => navigate('/')}
                className="mb-6 text-emerald-600 hover:text-emerald-800 flex items-center gap-2 transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver
            </button>

            <h1 className="text-3xl font-bold mb-4">Nuestros Productos</h1>

            {/* Filtros y búsqueda */}
            {!loadingCats && <SearchFilters categories={categories} />}

            {/* Botón nuevo */}
            <div className="mb-6 text-right">
                <button
                    onClick={() => navigate('/items/new')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
                >
                    <span>+</span> Nuevo Producto
                </button>
            </div>



            {/* Grid de items */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => <ItemCard key={item._id} item={item} />)}
            </div>

            {loading && <p className="text-center py-8">Cargando...</p>}
            {error && <p className="text-red-500 text-center py-4">{error}</p>}
            {!pagination.hasMore && <p>Todos los productos cargados</p>}
            {/* ¡No hace falta nada más! El <div id="infinite-loader" /> en el Provider se encarga. */}
        </div>

    );
}