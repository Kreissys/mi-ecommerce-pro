// src/pages/WishlistPage.jsx
// ✅ Página dedicada para la lista de deseos

import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { HiOutlineHeart, HiShoppingCart, HiTrash } from 'react-icons/hi';
import ProductCard from '../components/ProductCard';

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist, wishlistCount } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (producto) => {
    addToCart(producto);
  };

  const handleRemove = (id) => {
    if (window.confirm('¿Quitar este producto de favoritos?')) {
      removeFromWishlist(id);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('¿Vaciar toda tu lista de deseos?')) {
      clearWishlist();
    }
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
          <HiOutlineHeart className="h-10 w-10 text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Tu lista de deseos está vacía
        </h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Explora nuestro catálogo y guarda tus juegos favoritos para verlos después.
        </p>
        <Link
          to="/"
          className="inline-block rounded-md border border-transparent bg-brand-primary-600 px-8 py-3 text-base font-medium text-white hover:bg-brand-primary-700 transition-colors"
        >
          Explorar Productos
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Mi Lista de Deseos ❤️
          </h1>
          <p className="text-gray-500 mt-2">
            {wishlistCount} {wishlistCount === 1 ? 'producto guardado' : 'productos guardados'}
          </p>
        </div>
        {wishlistItems.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
          >
            Vaciar lista
          </button>
        )}
      </div>

      {/* Grid de productos favoritos: reutilizamos ProductCard para consistencia */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {wishlistItems.map((producto) => (
          <div key={producto.id} className="relative">
            {/* Botón de eliminar (overlay) */}
            <button
              onClick={() => handleRemove(producto.id)}
              className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-red-50 hover:scale-110 transition-all duration-200"
              aria-label="Quitar de favoritos"
            >
              <HiTrash className="h-5 w-5 text-red-500" />
            </button>

            <ProductCard producto={producto} />
          </div>
        ))}
      </div>

      {/* Botón adicional para seguir comprando */}
      <div className="mt-12 text-center">
        <Link
          to="/"
          className="inline-block rounded-md border-2 border-brand-primary-600 px-8 py-3 text-base font-medium text-brand-primary-600 hover:bg-brand-primary-50 transition-colors"
        >
          Seguir Explorando
        </Link>
      </div>
    </div>
  );
};

export default WishlistPage;