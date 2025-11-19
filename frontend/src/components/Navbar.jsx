// src/components/Navbar.jsx
// ✅ ACTUALIZADO con icono de Wishlist

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineShoppingCart, HiOutlineMenu, HiOutlineX, HiOutlineHeart } from 'react-icons/hi'; // <-- Agregado HiOutlineHeart
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext'; // <-- NUEVO
import logo from '../assets/ludoteka-logo.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist(); // <-- NUEVO

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="Ludoteka Logo" className="h-10 w-auto" />
              <span className="text-2xl font-bold text-brand-primary-700">Ludoteka</span>
            </Link>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link to="/" className="text-gray-500 hover:text-brand-primary-600 inline-flex items-center px-1 pt-1 text-sm font-medium">
              Inicio
            </Link>
            <Link to="/categoria/estrategia" className="text-gray-500 hover:text-brand-primary-600 inline-flex items-center px-1 pt-1 text-sm font-medium">
              Estrategia
            </Link>
            <Link to="/categoria/familiares" className="text-gray-500 hover:text-brand-primary-600 inline-flex items-center px-1 pt-1 text-sm font-medium">
              Familiares
            </Link>
            <Link to="/categoria/juegos-de-cartas" className="text-gray-500 hover:text-brand-primary-600 inline-flex items-center px-1 pt-1 text-sm font-medium">
              Cartas
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* NUEVO: Icono de Wishlist */}
            <Link to="/favoritos" className="group -m-2 p-2 flex items-center">
              <HiOutlineHeart className="flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-red-500 transition-colors" aria-hidden="true" />
              {wishlistCount > 0 && (
                <span className="ml-2 text-sm font-medium text-white bg-red-500 rounded-full px-2 py-0.5">
                  {wishlistCount}
                </span>
              )}
              <span className="sr-only">favoritos</span>
            </Link>

            {/* Icono de Carrito */}
            <Link to="/carrito" className="group -m-2 p-2 flex items-center">
              <HiOutlineShoppingCart className="flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
              {itemCount > 0 && (
                <span className="ml-2 text-sm font-medium text-white bg-brand-primary-600 rounded-full px-2 py-0.5">
                  {itemCount}
                </span>
              )}
              <span className="sr-only">items in cart, view bag</span>
            </Link>

            <div className="sm:hidden ml-3">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-primary-500"
              >
                <span className="sr-only">Abrir menú</span>
                {menuOpen ? (
                  <HiOutlineX className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <HiOutlineMenu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`sm:hidden ${menuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
        <div className="pt-2 pb-3 space-y-1">
          <Link to="/" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium">
            Inicio
          </Link>
          <Link to="/favoritos" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium">
            Favoritos ❤️ {wishlistCount > 0 && `(${wishlistCount})`}
          </Link>
          <Link to="/categoria/estrategia" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium">
            Estrategia
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;