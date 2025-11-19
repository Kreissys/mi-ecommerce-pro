// src/context/CartContext.jsx
// Archivo completo para copiar y pegar

import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Creamos el Contexto
const CartContext = createContext();

// 2. Creamos un "Hook" personalizado para usar el contexto fácilmente
export const useCart = () => {
  return useContext(CartContext);
};

// 3. Creamos el Proveedor (el componente que envuelve la app)
export const CartProvider = ({ children }) => {
  // 4. Estado del carrito
  // Intentamos cargar el carrito desde localStorage al iniciar
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('cart');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("No se pudo parsear el carrito de localStorage", error);
      return [];
    }
  });

  // 5. Guardamos en localStorage CADA VEZ que el carrito cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // --- Lógica del Carrito ---

  /**
   * Añade un producto al carrito.
   * Si ya existe, incrementa la cantidad.
   */
  const addToCart = (productToAdd) => {
    setCartItems(prevItems => {
      // 1. Buscar si el producto ya está en el carrito
      const existingItem = prevItems.find(item => item.id === productToAdd.id);

      if (existingItem) {
        // 2. Si existe, incrementamos la cantidad (sin pasar del stock)
        return prevItems.map(item =>
          item.id === productToAdd.id
            ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) } // No pasar del stock
            : item
        );
      } else {
        // 3. Si no existe, lo añadimos con cantidad 1
        return [...prevItems, { ...productToAdd, quantity: 1 }];
      }
    });
  };

  /**
   * Remueve un producto del carrito (por su ID).
   */
  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      return prevItems.filter(item => item.id !== productId);
    });
  };

  /**
   * Actualiza la cantidad de un producto.
   */
  const updateQuantity = (productId, newQuantity) => {
    setCartItems(prevItems => {
      return prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ).filter(item => item.quantity > 0); // Si la cantidad es 0, lo quita
    });
  };

  /**
   * Vacía el carrito completamente.
   */
  const clearCart = () => {
    setCartItems([]);
  };

  // --- Valores que el contexto proveerá ---

  // Calculamos el número total de items (no de productos únicos)
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  // Calculamos el precio total
  const cartTotal = cartItems.reduce((total, item) => total + (item.precio * item.quantity), 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
    cartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};