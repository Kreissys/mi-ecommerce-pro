// src/components/Navbar.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineShoppingCart,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineHeart
} from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';   // <-- IMPORTANTE
import logo from '../assets/ludoteka-logo.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, logout } = useAuth();   // usuario + logout

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="Ludoteka Logo" className="h-10 w-auto" />
              <span className="text-2xl font-bold text-brand-primary-700">Ludoteka</span>
            </Link>
          </div>

          {/* Categorías (solo desktop) */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link to="/" className="text-gray-500 hover:text-brand-primary-600 px-1 pt-1 text-sm font-medium">
              Inicio
            </Link>
            <Link to="/categoria/estrategia" className="text-gray-500 hover:text-brand-primary-600 px-1 pt-1 text-sm font-medium">
              Estrategia
            </Link>
            <Link to="/categoria/familiares" className="text-gray-500 hover:text-brand-primary-600 px-1 pt-1 text-sm font-medium">
              Familiares
            </Link>
            <Link to="/categoria/juegos-de-cartas" className="text-gray-500 hover:text-brand-primary-600 px-1 pt-1 text-sm font-medium">
              Cartas
            </Link>
          </div>

          {/* Iconos y login */}
          <div className="flex items-center gap-4">

            {/* Wishlist */}
            <Link to="/favoritos" className="group -m-2 p-2 flex items-center">
              <HiOutlineHeart className="h-6 w-6 text-gray-400 group-hover:text-red-500 transition-colors" />
              {wishlistCount > 0 && (
                <span className="ml-2 text-sm font-medium text-white bg-red-500 rounded-full px-2 py-0.5">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Carrito */}
            <Link to="/carrito" className="group -m-2 p-2 flex items-center">
              <HiOutlineShoppingCart className="h-6 w-6 text-gray-400 group-hover:text-gray-500" />
              {itemCount > 0 && (
                <span className="ml-2 text-sm font-medium text-white bg-brand-primary-600 rounded-full px-2 py-0.5">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* LOGIN / PERFIL / LOGOUT */}
            <div className="hidden sm:flex items-center gap-3">
              {user ? (
                <>
                  {/* Enlace al perfil */}
                  <Link
                    to="/perfil"
                    className="text-sm font-medium text-gray-700 hover:text-brand-primary-600"
                  >
                    Mi perfil
                  </Link>

                  {/* Correo truncado */}
                  <span className="text-sm text-gray-600 max-w-[140px] truncate">
                    {user.email}
                  </span>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="text-sm text-white bg-brand-primary-600 hover:bg-brand-primary-700 px-3 py-1 rounded"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-sm text-white bg-brand-primary-600 hover:bg-brand-primary-700 px-3 py-1 rounded"
                >
                  Iniciar sesión
                </Link>
              )}
            </div>

            {/* Botón menú móvil */}
            <div className="sm:hidden ml-3">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {menuOpen ? (
                  <HiOutlineX className="h-6 w-6" />
                ) : (
                  <HiOutlineMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div className={`sm:hidden ${menuOpen ? "block" : "hidden"}`}>
        <div className="pt-2 pb-3 space-y-1">

          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block pl-3 pr-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            Inicio
          </Link>

          <Link
            to="/favoritos"
            onClick={() => setMenuOpen(false)}
            className="block pl-3 pr-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            Favoritos ❤️ {wishlistCount > 0 && `(${wishlistCount})`}
          </Link>

          <Link
            to="/categoria/estrategia"
            onClick={() => setMenuOpen(false)}
            className="block pl-3 pr-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            Estrategia
          </Link>

          {/* LOGIN / LOGOUT MOVIL */}
          {user ? (
            <>
              <Link
                to="/perfil"
                onClick={() => setMenuOpen(false)}
                className="block pl-3 pr-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                Mi perfil
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full text-left pl-3 pr-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                Cerrar sesión ({user.email})
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block pl-3 pr-4 py-2 text-gray-600 hover:bg-gray-100"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
