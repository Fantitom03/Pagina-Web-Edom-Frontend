import React, { useState, useEffect } from 'react';
import { useItems } from '../context/ItemContext';

export default function SearchFilters({ categories }) {
    const {
        searchQuery,
        filters,
        setSearchQuery,
        setFilters,
        debugFilters // Para depuración
    } = useItems();

    // Estado local para manejar los cambios antes de enviarlos
    const [localQuery, setLocalQuery] = useState(searchQuery);
    const [localFilters, setLocalFilters] = useState({
        category: filters.category || '',
        minPrice: filters.minPrice || '',
        maxPrice: filters.maxPrice || ''
    });

    // Sincronizar estado local cuando cambian los props
    useEffect(() => {
        setLocalQuery(searchQuery);
        setLocalFilters({
            category: filters.category || '',
            minPrice: filters.minPrice || '',
            maxPrice: filters.maxPrice || ''
        });
    }, [searchQuery, filters]);

    // Aplicar filtros manualmente
    const applyFilters = () => {
        console.log('Aplicando filtros:', { localQuery, localFilters });
        setSearchQuery(localQuery);
        setFilters({
            category: localFilters.category,
            minPrice: localFilters.minPrice ? localFilters.minPrice : '',
            maxPrice: localFilters.maxPrice ? localFilters.maxPrice : ''
        });
    };

    // Debounce para la búsqueda por texto
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localQuery !== searchQuery) {
                console.log('Aplicando búsqueda después de debounce:', localQuery);
                setSearchQuery(localQuery);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [localQuery, searchQuery, setSearchQuery]);

    // Resetear todos los filtros
    const onClear = () => {
        console.log('Limpiando todos los filtros');
        setLocalQuery('');
        setLocalFilters({ category: '', minPrice: '', maxPrice: '' });
        setSearchQuery('');
        setFilters({ category: '', minPrice: '', maxPrice: '' });
    };

    // Para debug
    const showCurrentState = () => {
        if (debugFilters) debugFilters();
    };

    return (
        <div className="bg-gray-50 p-4 rounded-lg shadow mb-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Input de texto de búsqueda */}
                <div className="col-span-1 md:col-span-2">
                    <input
                        type="text"
                        placeholder="🔍 Buscar productos..."
                        value={localQuery}
                        onChange={e => setLocalQuery(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    />
                </div>

                {/* Select de categorías */}
                <div>
                    <select
                        value={localFilters.category}
                        onChange={e => {
                            const newCategory = e.target.value;
                            console.log('Cambiando categoría a:', newCategory);
                            setLocalFilters(prev => ({ ...prev, category: newCategory }));
                            // Aplicar inmediatamente al cambiar categoría
                            setFilters(prev => ({ ...prev, category: newCategory }));
                        }}
                        className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    >
                        <option value="">Todas las categorías</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Rango de precios */}
                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="number"
                        placeholder="Mín $"
                        value={localFilters.minPrice}
                        onChange={e => {
                            const value = e.target.value;
                            console.log('Cambiando precio mínimo a:', value);
                            setLocalFilters(prev => ({ ...prev, minPrice: value }));
                        }}
                        onBlur={applyFilters}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    />
                    <input
                        type="number"
                        placeholder="Máx $"
                        value={localFilters.maxPrice}
                        onChange={e => {
                            const value = e.target.value;
                            console.log('Cambiando precio máximo a:', value);
                            setLocalFilters(prev => ({ ...prev, maxPrice: value }));
                        }}
                        onBlur={applyFilters}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    />
                </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end mt-4 gap-2">
                <button
                    onClick={applyFilters}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                    Aplicar Filtros
                </button>

                {(localQuery || localFilters.category || localFilters.minPrice || localFilters.maxPrice) && (
                    <button
                        onClick={onClear}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Limpiar
                    </button>
                )}

                {process.env.NODE_ENV === 'development' && (
                    <button
                        onClick={showCurrentState}
                        className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
                    >
                        Debug
                    </button>
                )}
            </div>
        </div>
    );
}
