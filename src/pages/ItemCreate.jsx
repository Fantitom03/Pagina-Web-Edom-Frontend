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
        <div className="container mx-auto px-4 py-8 pt-20 text-gray-950 dark:text-white">
            {/* Botón de volver */}
            
            <h1 className="text-3xl font-bold mb-8">Agregar Nuevo Producto</h1>
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center text-2xl hover:shadow-2xl hover:underline transition-all text-black hover:text-amber-500 dark:text-gray-200 dark:hover:text-orange-400 cursor-pointer"
            >
                ← Volver
            </button>
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