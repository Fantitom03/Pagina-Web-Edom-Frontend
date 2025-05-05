import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ItemCard = ({ item }) => {
    const { addItem } = useCart();

    // 1. Calcular precios de forma segura
    const price = item?.price || 0;
    const discount = item?.discount || 0;
    const finalPrice = discount > 0
        ? price * (1 - discount / 100)
        : price;

    // 2. Manejar imagen rota
    const handleImageError = (e) => {
        e.target.src = '/placeholder-product.jpg';
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            {/* Badge de descuento */}
            {discount > 0 && (
                <div className="absolute bg-primary text-white px-3 py-1 text-sm font-bold rounded-tr-xl rounded-bl-xl">
                    -{discount}%
                </div>
            )}

            <Link to={`/items/${item?._id}`}>
                {item.image
                    ? <img className="w-full h-48 object-cover"
                        onError={handleImageError}
                        loading="lazy" src={item.image} />
                    : <div className="w-full h-48 bg-gray-200 flex items-center justify-center">Sin imagen</div>
                }
            </Link>

            <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">
                    <Link to={`/items/${item?._id}`} className="hover:text-primary-dark">
                        {item?.name || 'Nombre no disponible'}
                    </Link>
                </h3>

                <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold text-primary">
                        ${finalPrice.toFixed(2)}
                    </span>
                    {discount > 0 && (
                        <span className="text-sm line-through text-gray-500">
                            ${price.toFixed(2)}
                        </span>
                    )}
                </div>

                <button
                    onClick={() => addItem(item, 1)}
                    disabled={item.quantity <= 0}
                    className="btn-primary"
                >
                    {item.quantity > 0 ? 'Agregar' : 'Sin stock'}
                </button>

            </div>
        </div>
    );
};

export default ItemCard;