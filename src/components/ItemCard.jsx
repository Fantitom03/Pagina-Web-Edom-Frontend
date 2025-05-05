import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { can } from '../utils/auth';

const ItemCard = ({ item, onAddToCart }) => {
    const { user } = useAuth();
    const canEdit = can(user, 'update:items');
    
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
                <img 
                    src={item?.image} 
                    alt={item?.name} 
                    className="w-full h-48 object-cover"
                    onError={handleImageError}
                    loading="lazy"
                />
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

                <div className="flex justify-between items-center">
                    <button 
                        onClick={onAddToCart}
                        className="btn-primary"
                        disabled={!item?.quantity}
                    >
                        {item?.quantity > 0 ? 'Agregar al carrito' : 'Sin stock'}
                    </button>
                    
                    {/* 3. Mostrar edición solo con permiso */}
                    {canEdit && (
                        <Link
                            to={`/items/edit/${item?._id}`}
                            className="text-gray-500 hover:text-primary-dark"
                        >
                            ✏️ Editar
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ItemCard;