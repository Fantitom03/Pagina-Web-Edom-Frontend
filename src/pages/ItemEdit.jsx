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
        <div className="container mx-auto px-4 py-8 pt-20">
            {/* Botón de volver */}
            <button
                onClick={() => navigate(-1)}
                className="mb-6 text-emerald-600 hover:text-emerald-800 flex items-center gap-2 transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver
            </button>
            <h1 className="text-3xl font-bold mb-8">Editar Producto</h1>
            <ItemForm onSubmit={onSubmit} defaultValues={defaultValues} />
        </div>
    );
}