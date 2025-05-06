import { useItemDetail } from '../hooks/useItemDetail';
import { useCart } from '../context/CartContext';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function ItemDetail() {
    const {
        item, loading, canEdit, canDelete,
        priceData, handleDelete,
    } = useItemDetail();
    const { addItem, cart } = useCart();

    const inCart = cart.find(i => i._id === item?._id);
    const cartQty = inCart?.quantity ?? 0;
    const available = item?.quantity ?? 0;
    const canAdd = cartQty < available;
    const navigate = useNavigate();

    const handleAdd = () => {
        addItem(item, 1);
        Swal.fire({
            icon: 'success',
            title: 'Añadido',
            text: `${item.name} añadido al carrito`,
            showCancelButton: true,
            confirmButtonText: 'Ver carrito',
            cancelButtonText: 'Seguir comprando'
        }).then(res => res.isConfirmed && navigate('/cart'));
    };

    if (loading) return <div className="text-center py-8">Cargando...</div>;
    if (!item) return <div className="text-center py-8">No encontrado</div>;

    return (
        <div className="text-gray-700 dark:text-gray-200 container mx-auto px-4 pt-20 pb-10 min-h-screen">
            <button
                onClick={() => navigate('/items')}
                className="items-center text-2xl hover:shadow-2xl hover:underline transition-all text-black hover:text-amber-500 dark:text-gray-200 dark:hover:text-orange-400 cursor-pointer mb-3"
            >
                ← Volver al Listado
            </button>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-1/2 p-4 bg-gray-50 dark:bg-gray-700">
                    <img
                        src={item.image || '/placeholder-product.jpg'}
                        alt={item.name}
                        className="w-full h-80 object-contain rounded-lg"
                    />
                </div>

                <div className="flex-1 p-6 space-y-4">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                        {item.name}
                    </h1>

                    <div className="space-y-2">
                        {priceData.discount > 0 ? (
                            <div className="flex items-baseline gap-4">
                                <span className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                                    ${priceData.final.toFixed(2)}
                                </span>
                                <span className="text-xl line-through text-gray-400 dark:text-gray-500">
                                    ${priceData.original.toFixed(2)}
                                </span>
                                <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm">
                                    {priceData.discount}% OFF
                                </span>
                            </div>
                        ) : (
                            <span className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                                ${priceData.original.toFixed(2)}
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <h3 className="text-sm text-gray-500">Categoría</h3>
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                                {item.category?.name || 'Sin categoría'}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <h3 className="text-sm text-gray-500">Disponibles</h3>
                            <p className={`font-medium ${available > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {available > 0 ? `${available} unidades` : 'Agotado'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <p className="text-gray-700 dark:text-gray-300">{item.description}</p>

                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => console.log('Compra!')}
                                disabled={available <= 0}
                                className={`flex-1 px-6 py-3 rounded-lg font-medium text-white transition 
                                    ${available > 0 ? 'bg-orange-600 hover:bg-orange-700 cursor-pointer' : 'bg-gray-400 cursor-not-allowed'}`}
                            >
                                {available > 0 ? 'Comprar ahora' : 'Agotado'}
                            </button>

                            <button
                                onClick={handleAdd}
                                disabled={!canAdd}
                                className={`px-6 py-3 rounded-lg font-medium text-white transition 
                                    ${canAdd
                                        ? 'bg-orange-500 hover:bg-orange-600 cursor-pointer'
                                        : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                                    }`}
                            >
                                {canAdd ? 'Agregar al carrito' : 'Máximo alcanzado'}
                            </button>

                            {canEdit && (
                                <button
                                    onClick={() => navigate(`/items/edit/${item._id}`)}
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg cursor-pointer"
                                >
                                    Editar
                                </button>
                            )}
                            {canDelete && (
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg cursor-pointer"
                                >
                                    Eliminar
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}