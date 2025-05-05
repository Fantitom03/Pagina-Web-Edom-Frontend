import { useItemDetail } from '../hooks/useItemDetail';
import { useCart } from '../context/CartContext';
import Swal from 'sweetalert2';

const ItemDetail = () => {
    const {
        item,
        loading,
        isDeleting,
        canEdit,
        canDelete,
        priceData,
        handleDelete,
        navigate
    } = useItemDetail();
    const { addItem } = useCart();

    const handleAddToCart = () => {
        addItem(item, 1);
        // opcional: notificación SweetAlert, toast…
        Swal.fire({
            icon: 'success',
            title: 'Producto añadido al carrito',
            text: `${item.name} ha sido añadido a tu carrito.`,
            showConfirmButton: false,
            timer: 1500
        });
    };

    if (loading) return <div className="text-center py-8">Cargando...</div>;
    if (!item) return <div className="text-center py-8">Producto no encontrado</div>;

    return (
        <div className="container mx-auto px-4 pt-20 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-emerald-50">

                {/* Botón de volver */}
                <button
                    onClick={() => navigate('/items')}
                    className="mb-6 text-emerald-600 hover:text-emerald-800 flex items-center gap-2 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Volver al listado
                </button>

                {/* Contenido principal */}
                <div className="flex flex-col md:flex-row gap-8">
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full md:w-1/2 h-96 object-contain bg-gray-50 rounded-lg p-4 border"
                    />

                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-4">{item.name}</h1>

                        {/* Sección de precios */}
                        <div className="mb-6">
                            {priceData.discount > 0 ? (
                                <div className="flex items-baseline gap-4">
                                    <span className="text-4xl font-bold text-emerald-600">
                                        ${priceData.final.toFixed(2)}
                                    </span>
                                    <span className="text-xl text-gray-500 line-through">
                                        ${priceData.original.toFixed(2)}
                                    </span>
                                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                                        {priceData.discount}% OFF
                                    </span>
                                </div>
                            ) : (
                                <span className="text-4xl font-bold text-emerald-600">
                                    ${priceData.original.toFixed(2)}
                                </span>
                            )}
                        </div>

                        {/* Detalles del producto */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-sm font-semibold text-gray-500 mb-1">Categoría</h3>
                                <p className="font-medium">{item.category?.name || 'Sin categoría'}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-sm font-semibold text-gray-500 mb-1">Disponibles</h3>
                                <p className={`font-medium ${item.quantity > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {item.quantity > 0 ? `${item.quantity} unidades` : 'Agotado'}
                                </p>
                            </div>

                        </div>

                        {/* Descripción */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-3">Descripción del producto</h2>
                            <p className="text-gray-700 leading-relaxed">{item.description}</p>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => console.log("Iniciando compra...")}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg transition-colors font-medium flex-1"
                                disabled={item.quantity <= 0}
                            >
                                {item.quantity > 0 ? 'Comprar ahora' : 'Producto agotado'}
                            </button>

                            <button onClick={handleAddToCart}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg">
                                Agregar al carrito
                            </button>

                            {canEdit && (
                                <button
                                    onClick={() => navigate(`/items/edit/${item._id}`)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    Editar
                                </button>
                            )}

                            {canDelete && (
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Eliminando...' : 'Eliminar'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemDetail;