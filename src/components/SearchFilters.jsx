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
        <div className="text-gray-800 dark:text-white bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-8 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Input de texto de búsqueda */}
                <div className="col-span-full">
                    <input
                        type="text"
                        placeholder="🔍 Buscar productos..."
                        value={localQuery}
                        onChange={e => setLocalQuery(e.target.value)}
                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-orange-300"
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
                        className="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-orange-300"
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
                <div className="flex gap-2 cursor-pointer">
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
                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-orange-300 cursor-pointer"
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
                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-orange-300"
                    />
                </div>
            </div>

            {/* Botones de acción */}
            <div className="mt-4 flex justify-end gap-2">
                <button
                    onClick={applyFilters}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition cursor-pointer"
                >
                    Aplicar Filtros
                </button>

                {(localQuery || localFilters.category || localFilters.minPrice || localFilters.maxPrice) && (
                    <button
                        onClick={onClear}
                        className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 transition cursor-pointer"
                    >
                        Limpiar
                    </button>
                )}
            </div>
        </div>
    );
}
