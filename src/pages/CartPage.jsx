import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';

export default function CartPage() {
    const {
        cart,
        addItem,
        decreaseItem,
        removeItem,
        clearCart,
        totalItems,
        totalPrice,
        refreshCartStock
    } = useCart();

    const { user } = useAuth();
    const navigate = useNavigate();

    // Actualizamos el stock cuando se monta el componente
    useEffect(() => {
        refreshCartStock();
    }, []);

    const handleCheckout = () => {
        // Si el usuario no está autenticado, redirigir a login
        if (!user) {
            Swal.fire({
                title: 'Iniciar sesión',
                text: 'Necesitas iniciar sesión para completar la compra',
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#10b981',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Ir a iniciar sesión',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Guardar la URL actual para redireccionar después del login
                    localStorage.setItem('redirectAfterLogin', '/cart');
                    navigate('/login');
                }
            });
            return;
        }

        Swal.fire({
            title: '¿Finalizar compra?',
            html: `
                <div class="text-left dark:text-gray-100">
                    <p class="text-lg">Total: <span class="font-bold">$${totalPrice.toFixed(2)}</span></p>
                    <p class="mt-2">${totalItems} ${totalItems === 1 ? 'producto' : 'productos'}</p>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Confirmar compra',
            cancelButtonText: 'Seguir comprando',
            background: '#1f2937',
            color: '#fff'
        }).then((result) => {
            if (result.isConfirmed) {
                clearCart();
                Swal.fire({
                    title: '¡Compra exitosa!',
                    text: 'Tu pedido ha sido procesado',
                    icon: 'success',
                    confirmButtonColor: '#10b981'
                });
                navigate('/');
            }
        });
    };

    const handleRefresh = async () => {
        await refreshCartStock();
        Swal.fire({
            title: 'Carrito actualizado',
            text: 'Se ha actualizado la disponibilidad de los productos',
            icon: 'success',
            confirmButtonColor: '#10b981'
        });
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen pt-20 px-4 max-w-6xl mx-auto">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Carrito vacío</h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        No hay productos en tu carrito
                    </p>
                    <button
                        onClick={() => navigate('/items')}
                        className="cursor-pointer mt-4 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                    >
                        Explorar productos
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 px-4 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Tu Carrito</h1>
                <div className="flex gap-4">
                    <button
                        onClick={handleRefresh}
                        className="cursor-pointer text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Actualizar
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="cursor-pointer text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center gap-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Volver
                    </button>
                </div>
            </div>

            <div className="grid gap-6">
                {cart.map(item => (
                    <div key={item._id} className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex gap-4">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-24 h-24 object-cover rounded-lg"
                                onError={(e) => e.target.src = '/placeholder-product.jpg'}
                            />

                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                            {item.name}
                                        </h3>
                                        <p className="text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                                            ${(item.price * (1 - (item.discount || 0) / 100)).toFixed(2)}
                                            {item.discount > 0 && (
                                                <span className="ml-2 text-sm line-through text-gray-500 dark:text-gray-400">
                                                    ${item.price.toFixed(2)}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item._id)}
                                        className="cursor-pointer text-gray-400 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 mt-4">
                                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                                        <button
                                            onClick={() => decreaseItem(item._id)}
                                            disabled={item.quantity === 1}
                                            className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-md bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center font-medium text-gray-800 dark:text-gray-100">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => addItem(item)}
                                            disabled={item.quantity >= item.stock}
                                            className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-md bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {item.stock} disponibles
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <button
                        onClick={clearCart}
                        className="cursor-pointer px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-2 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Vaciar carrito
                    </button>

                    <div className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        Total ({totalItems} productos):
                        <span className="ml-2 text-emerald-600 dark:text-emerald-400">
                            ${totalPrice.toFixed(2)}
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleCheckout}
                    className="cursor-pointer mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                    Finalizar compra
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}