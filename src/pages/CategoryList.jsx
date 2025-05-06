import React from 'react';
import { useCategory } from '../context/CategoryContext';
import { useNavigate } from 'react-router-dom';
import { can } from '../utils/auth';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

export default function CategoryList() {
    const { categories, loading, deleteCategory } = useCategory();
    const { user } = useAuth();
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-xl text-orange-500 dark:text-orange-400">Cargando categorías…</p>
            </div>
        );
    }

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'eliminar categoría',
            text: '¿Está seguro de que desea eliminar esta categoría?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
        }).then((result) => {
            result.isConfirmed && deleteCategory(id) ? Swal.fire('Eliminado', '', 'success') : null;
        })
    };
    return (
        <div className="container mx-auto px-4 py-8">

            <div className="py-12 flex justify-between items-center mb-4">

                <button
                    onClick={() => navigate(-1)}
                    className="items-center text-2xl hover:shadow-2xl hover:underline transition-all text-black hover:text-amber-500 dark:text-gray-200 dark:hover:text-orange-400 cursor-pointer"
                >
                    ← Volver
                </button>

                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Categorías</h1>

                {can(user, 'create:categories') && (
                    <button
                        onClick={() => nav('/categories/new')}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition cursor-pointer"
                    >
                        + Nueva Categoría
                    </button>
                )}

            </div>


            <ul className="space-y-2">
                {categories.map(cat => (
                    <li
                        key={cat._id}
                        className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm transition-colors"
                    >
                        <span className="text-gray-800 dark:text-gray-100 font-medium">{cat.name}</span>
                        <div className="space-x-2">
                            {can(user, 'update:categories') && (
                                <button
                                    onClick={() => nav(`/categories/edit/${cat._id}`)}
                                    className="px-3 py-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded transition cursor-pointer"
                                >
                                    ✏️
                                </button>
                            )}
                            {can(user, 'delete:categories') && (
                                <button
                                    onClick={() => handleDelete(cat._id)}
                                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition cursor-pointer"
                                >
                                    🗑️
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}