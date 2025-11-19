// src/context/WishlistContext.jsx
// ✅ Context para manejar la lista de deseos (favoritos)

import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist debe usarse dentro de WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  // Inicializar el estado leyendo directamente desde localStorage (lazy initializer)
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('ludoteka_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error al parsear wishlist desde localStorage:', error);
      localStorage.removeItem('ludoteka_wishlist');
      return [];
    }
  });

  // Guardar en localStorage cada vez que cambie la wishlist
  useEffect(() => {
    try {
      localStorage.setItem('ludoteka_wishlist', JSON.stringify(wishlistItems));
    } catch (error) {
      console.error('Error al guardar wishlist en localStorage:', error);
    }
  }, [wishlistItems]);

  // Guardar en localStorage cada vez que cambie la wishlist
  useEffect(() => {
    localStorage.setItem('ludoteka_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Agregar producto a favoritos
  const addToWishlist = (producto) => {
    setWishlistItems((prevItems) => {
      // Verificar si ya existe
      const exists = prevItems.find(item => item.id === producto.id);
      if (exists) {
        return prevItems; // Ya está en favoritos
      }
      return [...prevItems, producto];
    });
  };

  // Quitar producto de favoritos
  const removeFromWishlist = (productoId) => {
    setWishlistItems((prevItems) => 
      prevItems.filter(item => item.id !== productoId)
    );
  };

  // Verificar si un producto está en favoritos
  const isInWishlist = (productoId) => {
    return wishlistItems.some(item => item.id === productoId);
  };

  // Toggle: agregar o quitar según estado actual
  const toggleWishlist = (producto) => {
    if (isInWishlist(producto.id)) {
      removeFromWishlist(producto.id);
      return false; // Removido
    } else {
      addToWishlist(producto);
      return true; // Agregado
    }
  };

  // Limpiar toda la wishlist
  const clearWishlist = () => {
    setWishlistItems([]);
  };

  // Cantidad de items en wishlist
  const wishlistCount = wishlistItems.length;

  const value = {
    wishlistItems,
    wishlistCount,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    clearWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;