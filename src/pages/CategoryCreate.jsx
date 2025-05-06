import React from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryForm from '../components/CategoryForm';
import { useCategory } from '../context/CategoryContext';
import Swal from 'sweetalert2';

export default function CategoryCreate() {
    const { createCategory } = useCategory();
    const navigate = useNavigate();

    const onSubmit = async data => {
        try {
            await createCategory(data);
            Swal.fire('¡Creado!', '', 'success');
            nav('/categories');
        } catch {
            Swal.fire('Error', 'No se pudo crear', 'error');
        }
    };

    return (
        <div className="container mx-auto p-4 mt-10 text-gray-950 dark:text-white">
            
            <h1 className="text-3xl  mb-4">Crear Categoría</h1>
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center text-2xl hover:shadow-2xl hover:underline transition-all text-black hover:text-amber-500 dark:text-gray-200 dark:hover:text-orange-400 cursor-pointer"
            >
                ← Volver
            </button>
            <CategoryForm onSubmit={onSubmit} />
        </div>
    );
}
