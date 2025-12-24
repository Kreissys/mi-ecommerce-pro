// src/components/ProductCard.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { HiHeart, HiOutlineHeart } from "react-icons/hi";
import Badge from "./Badge";

const ProductCard = ({ producto }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isAnimating, setIsAnimating] = useState(false);

  const imageUrl = producto.imagen
    ? producto.imagen
    : "https://via.placeholder.com/400x400.png?text=Sin+Imagen";

  const handleAddToCart = () => {
    addToCart(producto);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    toggleWishlist(producto);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const esFavorito = isInWishlist(producto.id);

  // ✅ LÓGICA DINÁMICA DE BADGES
  const esNuevo = Boolean(producto.es_nuevo);
  const tieneDescuento = Boolean(producto.tiene_descuento);
  const porcentajeDesc = Number(producto.porcentaje_descuento) || 0;
  const esPopular =
    typeof producto.stock === "number" &&
    producto.stock > 0 &&
    producto.stock < 5;

  const precioNum = Number(producto.precio) || 0;
  const precioOriginal =
    tieneDescuento && porcentajeDesc > 0
      ? (precioNum / (1 - porcentajeDesc / 100)).toFixed(2)
      : null;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-shadow duration-300">
      {/* Botón de favoritos */}
      <button
        onClick={handleToggleWishlist}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:scale-110 transition-all duration-200 ${
          isAnimating ? "animate-bounce" : ""
        }`}
        aria-label={esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
      >
        {esFavorito ? (
          <HiHeart className="h-6 w-6 text-red-500 animate-pulse" />
        ) : (
          <HiOutlineHeart className="h-6 w-6 text-gray-600 hover:text-red-500 transition-colors" />
        )}
      </button>

      <Link to={`/producto/${producto.slug}`} className="block">
        {/* 🔁 CONTENEDOR DE IMAGEN AJUSTADO */}
        <div className="relative w-full h-72 bg-gray-50 flex items-center justify-center overflow-hidden">
          <img
            src={imageUrl}
            alt={producto.nombre}
            className="max-h-full max-w-full object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Overlay suave al hover */}
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300" />

          {/* BADGES DINÁMICOS */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {esNuevo && <Badge type="nuevo" />}
            {tieneDescuento && porcentajeDesc > 0 && (
              <Badge type="descuento" text={`-${porcentajeDesc}% OFF`} />
            )}
            {esPopular && <Badge type="popular" text="¡Últimos!" />}
            {producto.stock === 0 && <Badge type="agotado" />}
          </div>
        </div>

        {/* Información */}
        <div className="flex flex-1 flex-col space-y-2 p-4">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-brand-primary-600 transition-colors">
            {producto.nombre}
          </h3>
          <p className="text-sm text-gray-500">{producto.categoria}</p>

          <div className="flex flex-1 flex-col justify-end pt-2">
            {tieneDescuento && precioOriginal && (
              <p className="text-xs text-gray-400 line-through">
                S/ {precioOriginal}
              </p>
            )}
            <p className="text-xl font-bold text-gray-900">
              S/ {precioNum.toFixed(2)}
            </p>
            {tieneDescuento && precioOriginal && (
              <p className="text-xs text-green-600 font-semibold mt-1">
                ✓ ¡Ahorras S/{" "}
                {(parseFloat(precioOriginal) - precioNum).toFixed(2)}!
              </p>
            )}
          </div>
        </div>
      </Link>

      {/* Botón de agregar */}
      <div className="p-4 pt-0">
        <button
          onClick={handleAddToCart}
          disabled={producto.stock === 0}
          className="w-full rounded-md border border-transparent bg-brand-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-primary-700 focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md"
        >
          {producto.stock > 0 ? "Agregar al Carrito" : "Agotado"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
