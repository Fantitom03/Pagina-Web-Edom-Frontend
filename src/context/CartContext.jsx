import { createContext, useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '../api/edomApi'; // Importamos la API
import { useAuth } from './AuthContext'; // Importamos el contexto de autenticación

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const userId = user?.id || 'guest'; 


    const [cart, setCart] = useState([]);
    
    // Efecto para cargar el carrito correcto cuando cambia el usuario
    useEffect(() => {
        try {
            if (!user) {
                clearCart(); // Limpiamos el carrito si no hay usuario
            }

            // Cargamos el carrito específico del usuario
            const userCart = JSON.parse(localStorage.getItem(`myCart_${userId}`)) || [];
            setCart(userCart);
            console.log(`Cargando carrito para usuario: ${userId}`, userCart);
        } catch (error) {
            console.error("Error al cargar el carrito:", error);
            setCart([]);
        }
    }, [userId]); // El carrito se recarga cuando cambia el usuario
    
    // Actualizamos el localStorage cuando cambia el carrito
    useEffect(() => {
        localStorage.setItem(`myCart_${userId}`, JSON.stringify(cart));
        console.log(`Guardando carrito para usuario: ${userId}`, cart);
    }, [cart, userId]);

    // Función para verificar el stock actual de un producto
    const checkCurrentStock = async (productId) => {
        try {
            const response = await api.get(`/items/${productId}`);
            return response.data.quantity || 0;
        } catch (error) {
            console.error('Error al verificar stock:', error);
            return 0;
        }
    };

    // Función para añadir un item al carrito con verificación de stock
    const addItem = async (product, qty = 1) => {
        const id = product._id || product.id;
        
        try {
            const currentStock = await checkCurrentStock(id);
            
            setCart(prev => {
                const idx = prev.findIndex(i => i._id === id);
                const currentQty = idx > -1 ? prev[idx].quantity : 0;
                
                // Verificamos si hay suficiente stock
                if (currentQty + qty > currentStock) {
                    Swal.fire('Ups', `Sólo hay ${currentStock} unidades disponibles`, 'warning');
                    return prev;
                }
                
                if (idx > -1) {
                    return prev.map(i =>
                        i._id === id
                            ? { ...i, quantity: i.quantity + qty, stock: currentStock }
                            : i
                    );
                } else {
                    return [
                        ...prev,
                        { ...product, _id: id, quantity: qty, stock: currentStock }
                    ];
                }
            });
        } catch (error) {
            console.error('Error al añadir producto:', error);
            Swal.fire('Error', 'No se pudo añadir el producto al carrito', 'error');
        }
    };

    const decreaseItem = (id, qty = 1) => {
        setCart(prev => {
            const idx = prev.findIndex(i => i._id === id);
            if (idx > -1) {
                const newQty = Math.max(0, prev[idx].quantity - qty);
                if (newQty === 0) {
                    return prev.filter(i => i._id !== id);
                }
                return prev.map(i =>
                    i._id === id
                        ? { ...i, quantity: newQty }
                        : i
                );
            }
            return prev;
        });
    };

    const removeItem = id => {
        setCart(prev => prev.filter(i => i._id !== id));
    };

    const clearCart = () => setCart([]);

    // Función para actualizar el stock de todos los productos en el carrito
    const refreshCartStock = async () => {
        if (cart.length === 0) return;
        
        try {
            // Actualizamos el stock de cada producto en el carrito
            const updatedCart = await Promise.all(
                cart.map(async (item) => {
                    const currentStock = await checkCurrentStock(item._id);
                    
                    // Si el stock actual es menor que la cantidad en el carrito, ajustamos
                    if (currentStock < item.quantity) {
                        Swal.fire('Aviso', `El stock de "${item.name}" ha cambiado a ${currentStock} unidades`, 'info');
                        return { ...item, quantity: currentStock, stock: currentStock };
                    }
                    
                    return { ...item, stock: currentStock };
                })
            );
            
            // Filtramos productos con stock 0
            const filteredCart = updatedCart.filter(item => item.stock > 0);
            
            // Si hay productos que se eliminaron por stock 0
            if (filteredCart.length < updatedCart.length) {
                Swal.fire('Aviso', 'Algunos productos ya no están disponibles y han sido removidos del carrito', 'info');
            }
            
            setCart(filteredCart);
        } catch (error) {
            console.error('Error al actualizar el carrito:', error);
        }
    };

    // Actualizamos el stock cuando cambia el usuario o se recarga el carrito
    useEffect(() => {
        if (cart.length > 0) {
            refreshCartStock();
        }
    }, [userId]); // Se ejecuta cuando cambia el usuario

    const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = cart.reduce(
        (sum, i) => sum + i.quantity * i.price * (1 - (i.discount || 0) / 100),
        0
    );

    return (
        <CartContext.Provider value={{
            cart,
            addItem,
            decreaseItem,
            removeItem,
            clearCart,
            totalItems,
            totalPrice,
            refreshCartStock,
            userId
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);