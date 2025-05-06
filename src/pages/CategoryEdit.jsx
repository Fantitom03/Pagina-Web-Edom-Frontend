import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CategoryForm from '../components/CategoryForm';
import { useCategory } from '../context/CategoryContext';
import Swal from 'sweetalert2';

export default function CategoryEdit() {
    const { id } = useParams();
    const { categories, updateCategory } = useCategory();
    const [defaultValues, setDefaultValues] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const cat = categories.find(c => c._id === id);
        if (!cat) return;
        setDefaultValues(cat);
    }, [categories, id]);

    if (!defaultValues) return <p>Cargando…</p>;

    const onSubmit = async vals => {
        try {
            await updateCategory(id, vals);
            Swal.fire('¡Actualizado!', '', 'success');
            nav('/categories');
        } catch {
            Swal.fire('Error', 'No se pudo actualizar', 'error');
        }
    };

    return (
        <div className="container mx-auto p-4 mt-15 text-gray-800 dark:text-gray-200">
            
            <h1 className="text-3xl mb-4">Editar Categoría</h1>
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center text-2xl hover:shadow-2xl hover:underline transition-all text-black hover:text-amber-500 dark:text-gray-200 dark:hover:text-orange-400 cursor-pointer"
            >
                ← Volver
            </button>
            <CategoryForm defaultValues={defaultValues} onSubmit={onSubmit} />
        </div>
    );
}