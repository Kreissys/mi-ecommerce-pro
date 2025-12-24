// src/pages/ProductPage.jsx
// ✅ CON BADGES, BREADCRUMBS Y URL DE IMAGEN CORREGIDA

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProducto } from '../services/api';
import { HiCheck, HiExclamation, HiHeart, HiOutlineHeart } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Breadcrumbs from '../components/Breadcrumbs';
import Badge from '../components/Badge';

// ✅ URL base del backend (ajústala si usas otra)
const BACKEND_URL =
  import.meta.env?.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

// ✅ Función para resolver correctamente la URL de la imagen
const resolveImageUrl = (imagen) => {
  // Sin imagen ➜ placeholder
  if (!imagen) {
    return 'https://via.placeholder.com/600x600.png?text=Sin+Imagen';
  }

  // Si ya viene con http/https ➜ la usamos tal cual
  if (imagen.startsWith('http://') || imagen.startsWith('https://')) {
    return imagen;
  }

  // Si viene comenzando con "/" ➜ la pegamos al backend
  if (imagen.startsWith('/')) {
    return `${BACKEND_URL}${imagen}`;
  }

  // Si viene tipo "media/productos/catan.jpg" ➜ le agregamos "/" delante
  return `${BACKEND_URL}/${imagen}`;
};

const ProductPage = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setLoading(true);
        const response = await getProducto(slug);
        setProducto(response.data);
        setError(null);
      } catch (err) {
        console.error('Error al obtener el producto:', err);
        setError('No se pudo encontrar el producto.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducto();
  }, [slug]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(producto);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(producto);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  if (loading) {
    return <div className="text-center text-xl">Cargando producto... 🌀</div>;
  }

  if (error || !producto) {
    return (
      <div className="text-center text-red-500 bg-red-100 p-4 rounded-md">
        {error}
      </div>
    );
  }

  // ✅ Ahora usamos la función que corrige la URL
  const imageUrl = resolveImageUrl(producto.imagen);

  const esFavorito = isInWishlist(producto.id);

  // Breadcrumbs dinámicos
  const breadcrumbItems = [
    { name: producto.categoria, path: `/categoria/${producto.categoria}` },
    { name: producto.nombre, path: `/producto/${producto.slug}` },
  ];

  // Lógica de badges: usar los campos que vienen desde la API
  const esNuevo = producto.es_nuevo || false;
  const tieneDescuento = producto.tiene_descuento || false;
  const porcentajeDescuento = producto.porcentaje_descuento || 0;
  const esPopular = producto.stock > 0 && producto.stock < 5;

  // Cálculo del precio original (si hay descuento) y ahorro
  const precioOriginal =
    tieneDescuento && porcentajeDescuento > 0
      ? (
          parseFloat(producto.precio) /
          (1 - porcentajeDescuento / 100)
        ).toFixed(2)
      : null;

  const ahorro = precioOriginal
    ? (parseFloat(precioOriginal) - parseFloat(producto.precio)).toFixed(2)
    : null;

  // DEBUG (si ya usabas esto y no te da error lo dejamos)
  if (process.env.NODE_ENV === 'development') {
    console.debug('ProductPage:', producto.slug, {
      esNuevo,
      tieneDescuento,
      porcentajeDescuento,
      precioOriginal,
      ahorro,
    });
  }

  return (
    <div>
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Columna izquierda: Imagen */}
          <div className="p-4 sm:p-6 lg:p-8 relative">
            {/* Botón de favoritos flotante */}
            <button
              onClick={handleToggleWishlist}
              className={`absolute top-8 right-8 z-10 p-3 rounded-full bg-white shadow-lg hover:scale-110 transition-all duration-200 ${
                isAnimating ? 'animate-bounce' : ''
              }`}
              aria-label={
                esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'
              }
            >
              {esFavorito ? (
                <HiHeart className="h-8 w-8 text-red-500 animate-pulse" />
              ) : (
                <HiOutlineHeart className="h-8 w-8 text-gray-600 hover:text-red-500 transition-colors" />
              )}
            </button>

            {/* Badges en la imagen */}
            <div className="absolute top-8 left-8 z-10 flex flex-col gap-2">
              {esNuevo && <Badge type="nuevo" />}
              {tieneDescuento && porcentajeDescuento > 0 && (
                <Badge
                  type="descuento"
                  text={`-${porcentajeDescuento}% OFF`}
                />
              )}
              {esPopular && <Badge type="popular" text="¡Últimas unidades!" />}
              {producto.stock === 0 && <Badge type="agotado" />}
            </div>

            <img
              src={imageUrl}
              alt={producto.nombre}
              className="w-full h-full object-center object-contain rounded-lg shadow-lg"
            />
          </div>

          {/* Columna derecha: Información */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Categoría */}
            <p className="text-sm font-semibold text-brand-primary-600 mb-2">
              {producto.categoria}
            </p>

            {/* Nombre del producto */}
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-4">
              {producto.nombre}
            </h1>

            {/* Precio */}
            <div className="mt-3 bg-gray-50 rounded-lg p-4">
              {tieneDescuento && precioOriginal && (
                <p className="text-lg text-gray-500 line-through">
                  S/ {precioOriginal}
                </p>
              )}
              <p className="text-4xl font-bold text-gray-900">
                S/ {producto.precio}
              </p>
              {tieneDescuento && ahorro && (
                <p className="text-sm text-green-600 font-semibold mt-1">
                  ✓ ¡Ahorras S/ {ahorro}!
                </p>
              )}
            </div>

            {/* Descripción */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Descripción
              </h3>
              <div className="text-base text-gray-700 space-y-4">
                <p>
                  {producto.descripcion ||
                    'Este producto no tiene descripción disponible.'}
                </p>
              </div>
            </div>

            {/* Stock */}
            <div className="mt-6 border-t pt-6">
              <div className="flex items-center mb-6">
                {producto.stock > 0 ? (
                  <>
                    <HiCheck className="h-6 w-6 text-green-500" />
                    <p className="ml-2 text-base text-gray-700">
                      <span className="font-semibold text-green-600">
                        {producto.stock}
                      </span>{' '}
                      unidades disponibles
                    </p>
                  </>
                ) : (
                  <>
                    <HiExclamation className="h-6 w-6 text-red-500" />
                    <p className="ml-2 text-base text-red-600 font-semibold">
                      Agotado
                    </p>
                  </>
                )}
              </div>

              {/* Botones de acción */}
              <form className="space-y-3" onSubmit={handleAddToCart}>
                {/* Botón principal: Agregar al carrito */}
                <button
                  type="submit"
                  disabled={producto.stock === 0}
                  className="w-full bg-brand-primary-600 border border-transparent rounded-lg py-4 px-8 flex items-center justify-center text-base font-semibold text-white shadow-lg hover:bg-brand-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-xl"
                >
                  {producto.stock > 0 ? 'Agregar al Carrito' : 'No disponible'}
                </button>

                {/* Botón secundario: Agregar a favoritos */}
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className={`w-full border-2 rounded-lg py-4 px-8 flex items-center justify-center text-base font-semibold transition-all duration-200 ${
                    esFavorito
                      ? 'border-red-500 text-red-500 bg-red-50 hover:bg-red-100'
                      : 'border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-500'
                  }`}
                >
                  {esFavorito ? (
                    <>
                      <HiHeart className="h-5 w-5 mr-2" />
                      En tu lista de deseos
                    </>
                  ) : (
                    <>
                      <HiOutlineHeart className="h-5 w-5 mr-2" />
                      Agregar a favoritos
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Información adicional */}
            <div className="mt-8 border-t pt-8">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Información del producto
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span className="font-medium">Categoría:</span>
                  <span>{producto.categoria}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Stock:</span>
                  <span
                    className={
                      producto.stock > 0
                        ? 'text-green-600 font-semibold'
                        : 'text-red-600 font-semibold'
                    }
                  >
                    {producto.stock > 0
                      ? `${producto.stock} disponibles`
                      : 'Agotado'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Precio:</span>
                  <span className="font-bold text-gray-900">
                    S/ {producto.precio}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
