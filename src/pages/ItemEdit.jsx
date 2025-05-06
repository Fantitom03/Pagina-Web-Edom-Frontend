import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useItems } from '../context/ItemContext';
import ItemForm from '../components/ItemForm';
import Swal from 'sweetalert2';

export default function ItemEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getItem, updateItem } = useItems();
    const [defaultValues, setDefaultValues] = useState(null);

    useEffect(() => {
        getItem(id)
            .then(data => setDefaultValues({
                ...data,
                category: data.category?._id || ''
            }))
            .catch(() => {
                Swal.fire('Error', 'No se pudo cargar el producto', 'error');
                navigate('/items', { replace: true });
            });
    }, [id, getItem, navigate]);

    if (!defaultValues) return <p className="text-center py-8">Cargando...</p>;

    const onSubmit = async (values) => {
        try {
            await updateItem(id, values);
            Swal.fire('¡Listo!', 'Producto actualizado', 'success');
            navigate(`/items/${id}`, { replace: true });
        } catch {
            Swal.fire('Error', 'No se pudo actualizar el producto', 'error');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 pt-20 text-gray-700 dark:text-gray-200">
            {/* Botón de volver */}
            <h1 className="text-3xl font-bold mb-8">Editar Producto</h1>
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center hover:underline transition-all text-black hover:text-amber-500 dark:text-gray-200 dark:hover:text-orange-400 cursor-pointer"
            >
                ← Volver
            </button>
            <ItemForm onSubmit={onSubmit} defaultValues={defaultValues} />
        </div>
    );
}