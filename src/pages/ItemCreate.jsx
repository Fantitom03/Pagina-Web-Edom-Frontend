import { useNavigate } from 'react-router-dom';
import { useItems } from '../context/ItemContext';
import ItemForm from '../components/ItemForm';
import Swal from 'sweetalert2';

export default function ItemCreate() {
    const navigate = useNavigate();
    const { createItem } = useItems();

    const onSubmit = async (values) => {
        try {
            const newItem = await createItem(values);
            Swal.fire('¡Listo!', 'Producto creado con éxito', 'success');
            navigate(`/items/${newItem._id}`, { replace: true });
        } catch (err) {
            Swal.fire('Error', err.message || 'No se pudo crear el producto', 'error');
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
            <h1 className="text-3xl font-bold mb-8">Agregar Nuevo Producto</h1>
            <ItemForm
                onSubmit={onSubmit}
                defaultValues={{
                    name: '',
                    quantity: 0,
                    description: '',
                    price: 0,
                    discount: 0,
                    category: '',
                    image: '',
                }}
            />
        </div>
    );
}