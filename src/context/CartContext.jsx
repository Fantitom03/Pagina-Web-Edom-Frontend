import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const storageKey = user ? `cart_${user._id}` : null;

    const [cart, setCart] = useState([]);

    // 1️⃣ Carga inicial desde localStorage
    useEffect(() => {
        if (!storageKey) {
            setCart([]);
            return;
        }
        const saved = localStorage.getItem(storageKey);
        setCart(saved ? JSON.parse(saved) : []);
    }, [storageKey]);

    // 2️⃣ Siempre que cambie carrito, lo persistimos
    useEffect(() => {
        if (storageKey) {
            localStorage.setItem(storageKey, JSON.stringify(cart));
        }
    }, [cart, storageKey]);

    // 3️⃣ Añadir un producto (o actualizar cantidad)
    const addItem = useCallback((product, qty = 1) => {
        setCart(prev => {
            const idx = prev.findIndex(i => i._id === product._id);
            if (idx > -1) {
                const updated = [...prev];
                updated[idx].quantity += qty;
                return updated;
            }
            return [...prev, { ...product, quantity: qty }];
        });
    }, []);

    // 4️⃣ Eliminar un producto del carrito
    const removeItem = useCallback((productId) => {
        setCart(prev => prev.filter(i => i._id !== productId));
    }, []);

    // 5️⃣ Cambiar cantidad de un ítem
    const updateItemQuantity = useCallback((productId, quantity) => {
        setCart(prev => {
            const updated = prev.map(i =>
                i._id === productId ? { ...i, quantity } : i
            );
            // opcionalmente filtrar out si quantity <= 0
            return updated.filter(i => i.quantity > 0);
        });
    }, []);

    // 6️⃣ Vaciar carrito
    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

    // 7️⃣ Totales
    const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = cart.reduce((sum, i) => sum + i.quantity * (i.price * (1 - (i.discount || 0) / 100)), 0);

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

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
    return ctx;
};