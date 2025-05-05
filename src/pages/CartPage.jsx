import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
    const {
        cart,
        removeItem,
        updateItemQuantity,
        clearCart,
        totalItems,
        totalPrice
    } = useCart();
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 pt-20">
                <p className="text-center text-lg text-gray-600">
                    Tu carrito está vacío 🛒
                </p>
                <div className="text-center mt-4">
                    <button
                        onClick={() => navigate('/items')}
                        className="text-emerald-600 hover:underline"
                    >
                        Volver a la tienda
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 pt-20">
            <h1 className="text-3xl mb-6">Tu Carrito</h1>
            <button
                onClick={() => navigate(-1)}
                className="mb-6 text-emerald-600 hover:text-emerald-800 flex items-center gap-2 transition-colors"
            >
                {/* ícono */}
                Volver
            </button>
            <ul className="space-y-4">
                {cart.map(i => (
                    <li key={i._id} className="flex items-center gap-4">
                        <img
                            src={i.image}
                            alt={i.name}
                            className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                            <h3 className="font-semibold">{i.name}</h3>
                            <p>
                                $
                                {(i.price * (1 - (i.discount || 0) / 100)).toFixed(2)} c/u
                            </p>
                            <input
                                type="number"
                                value={i.quantity}
                                min="1"
                                max={i.stock}
                                onChange={e =>
                                    updateItemQuantity(i._id, parseInt(e.target.value, 10))
                                }
                                className="w-16 border rounded p-1"
                            />
                            <p className="text-sm text-gray-500">
                                {i.stock} unidades disponibles
                            </p>
                        </div>
                        <button onClick={() => removeItem(i._id)} className="text-red-600">
                            ×
                        </button>
                    </li>
                ))}
            </ul>

            <div className="mt-8 flex justify-between items-center">
                <button onClick={clearCart} className="px-4 py-2 bg-red-500 text-white rounded">
                    Vaciar carrito
                </button>
                <div className="text-xl">
                    Total ({totalItems}): <strong>${totalPrice.toFixed(2)}</strong>
                </div>
            </div>

            <button
                onClick={() => navigate('/checkout')}
                className="mt-6 px-6 py-3 bg-emerald-600 text-white rounded-lg"
            >
                Finalizar compra
            </button>
        </div>
    );
}