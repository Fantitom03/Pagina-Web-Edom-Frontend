import { createContext, useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('myCart')) || [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('myCart', JSON.stringify(cart));
    }, [cart]);

    const addItem = (product, qty = 1) => {
        const id = product._id || product.id;
        setCart(prev => {
            const idx = prev.findIndex(i => i._id === id);
            const currentQty = idx > -1 ? prev[idx].quantity : 0;
            const maxStock = product.quantity;
            if (currentQty + qty > maxStock) {
                Swal.fire('Ups', `Sólo hay ${maxStock} unidades disponibles`, 'warning');
                return prev;
            }
            if (idx > -1) {
                return prev.map(i =>
                    i._id === id
                        ? { ...i, quantity: i.quantity + qty }
                        : i
                );
            } else {
                return [
                    ...prev,
                    { ...product, _id: id, quantity: qty }
                ];
            }
        });
    };

    const removeItem = id => {
        setCart(prev => prev.filter(i => i._id !== id));
    };

    const updateItemQuantity = (id, qty) => {
        setCart(prev =>
            prev.map(i => {
                if (i._id !== id) return i;
                const stock = i.quantityInStock ?? i.quantity; // si guardas stock separado
                const newQty = Math.min(Math.max(qty, 1), stock);
                if (qty > stock) {
                    Swal.fire('Ups', `Sólo hay ${stock} unidades disponibles`, 'warning');
                }
                return { ...i, quantity: newQty };
            })
        );
    };

    const clearCart = () => setCart([]);

    const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = cart.reduce(
        (sum, i) => sum + i.quantity * i.price * (1 - (i.discount || 0) / 100),
        0
    );

    return (
        <CartContext.Provider value={{
            cart,
            addItem,
            removeItem,
            updateItemQuantity,
            clearCart,
            totalItems,
            totalPrice
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);