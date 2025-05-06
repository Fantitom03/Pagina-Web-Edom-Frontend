import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ItemCard({ item }) {
    const { addItem, cart } = useCart();

    // Precio final con descuento
    const price = item?.price || 0;
    const discount = item?.discount || 0;
    const finalPrice = discount > 0
        ? price * (1 - discount / 100)
        : price;

    // Cuánto hay en el carrito
    const inCart = cart.find(i => i._id === item._id);
    const cartQty = inCart?.quantity ?? 0;

    return (
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden">
            {discount > 0 && (
                <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                    -{discount}%
                </span>
            )}

            <Link to={`/items/${item._id}`}>
                {item.image
                    ? <img
                        src={item.image}
                        alt={item.name}
                        onError={e => e.currentTarget.src = '/placeholder-product.jpg'}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                    />
                    : <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                        Sin imagen
                    </div>
                }
            </Link>

            <div className="p-4 flex flex-col">
                <Link to={`/items/${item._id}`}>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 hover:text-orange-500 transition">
                        {item.name}
                    </h3>
                </Link>

                <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
                        ${finalPrice.toFixed(2)}
                    </span>
                    {discount > 0 && (
                        <span className="text-sm line-through text-gray-400 dark:text-gray-500">
                            ${price.toFixed(2)}
                        </span>
                    )}
                </div>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    Disponibles: {item.quantity - cartQty}
                </p>

                <button
                    onClick={() => addItem(item, 1)}
                    disabled={item.quantity - cartQty <= 0}
                    className={`cursor-pointer mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white transition 
            ${item.quantity - cartQty > 0
                            ? 'bg-orange-500 hover:bg-orange-600'
                            : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                        }`}
                >
                    {item.quantity - cartQty > 0 ? 'Agregar al carrito' : 'Sin stock'}
                </button>
            </div>
        </div>
    );
}