// src/components/Hero.jsx
// ✅ CARRUSEL + COUNTDOWN + VIDEO + DESCUENTOS DINÁMICOS

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HiArrowRight,
  HiShoppingCart,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";
import { useCart } from "../context/CartContext";
import { getProductos } from "../services/api";

const Hero = () => {
  const { addToCart } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [useVideo, setUseVideo] = useState(true); // Cambiar a true para usar video

  // Countdown timer (ejemplo: termina en 24 horas)
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  // ============================================
  // 4. Integración con API para productos destacados
  // ============================================
  useEffect(() => {
    const fetchProductosDestacados = async () => {
      try {
        setLoading(true);
        const response = await getProductos();
        // Toma los primeros 3 productos como destacados
        const destacados = response.data.slice(0, 3);
        setProductosDestacados(destacados);
      } catch (error) {
        console.error("Error al cargar productos destacados:", error);
        // Fallback: productos de ejemplo
        setProductosDestacados([
          {
            id: 1,
            nombre: "Producto Destacado 1",
            slug: "producto-1",
            precio: "100.00",
            imagen:
              "https://via.placeholder.com/400x400.png?text=Producto+1",
            descripcion: "Descripción del producto destacado 1",
            stock: 10,
            categoria: "Categoría",
            tiene_descuento: false,
            porcentaje_descuento: 0,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductosDestacados();
  }, []);

  // ============================================
  // 1. Carrusel automático (cada 5 segundos)
  // ============================================
  useEffect(() => {
    if (productosDestacados.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === productosDestacados.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [productosDestacados]);

  // ============================================
  // 2. Countdown timer
  // ============================================
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return {
            hours: prev.hours,
            minutes: prev.minutes - 1,
            seconds: 59,
          };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reinicia el contador cuando llega a 0
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  // Animación de entrada
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Navegación manual del carrusel
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? productosDestacados.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === productosDestacados.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleAddToCart = () => {
    if (productosDestacados[currentIndex]) {
      addToCart(productosDestacados[currentIndex]);
    }
  };

  if (loading) {
    return (
      <div className="relative bg-gray-900 rounded-2xl shadow-2xl overflow-hidden mb-12 h-96 flex items-center justify-center">
        <div className="text-white text-xl">
          Cargando productos destacados...
        </div>
      </div>
    );
  }

  const productoActual = productosDestacados[currentIndex];
  if (!productoActual) return null;

  // ✅ LÓGICA DE DESCUENTO DINÁMICA PARA EL HERO
  const tieneDescuento = Boolean(productoActual.tiene_descuento);
  const porcentajeDescuento =
    Number(productoActual.porcentaje_descuento) || 0;
  const precioNum = Number(productoActual.precio) || 0;

  const precioOriginal =
    tieneDescuento && porcentajeDescuento > 0
      ? (precioNum / (1 - porcentajeDescuento / 100)).toFixed(2)
      : null;

  return (
    <div className="relative bg-gray-900 rounded-2xl shadow-2xl overflow-hidden mb-12">
      {/* ============================================ */}
      {/* 3. Fondo: Video o Imagen */}
      {/* ============================================ */}
      <div className="absolute inset-0">
        {useVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-50"
          >
            <source src="hero.mp4" type="video/mp4" />
            Tu navegador no soporta videos HTML5.
          </video>
        ) : (
          <img
            src="https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=2071&auto=format&fit=crop"
            alt="Juegos de mesa"
            className="w-full h-full object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-transparent"></div>
      </div>

      {/* Contenido */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Columna izquierda: Texto */}
          <div
            className={`text-white transition-all duration-1000 transform ${
              isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
            }`}
          >
            {/* COUNTDOWN TIMER */}
            <div className="inline-block mb-6 bg-red-600 rounded-xl px-4 py-3 shadow-lg">
              <p className="text-xs font-bold uppercase tracking-wide mb-1">
                ¡Oferta Especial Termina En!
              </p>
              <div className="flex gap-3 items-center">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </div>
                  <div className="text-xs opacity-80">Horas</div>
                </div>
                <div className="text-2xl font-bold">:</div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </div>
                  <div className="text-xs opacity-80">Min</div>
                </div>
                <div className="text-2xl font-bold">:</div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </div>
                  <div className="text-xs opacity-80">Seg</div>
                </div>
              </div>
            </div>

            <div className="inline-block mb-4">
              <span className="bg-brand-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Producto Destacado {currentIndex + 1} de{" "}
                {productosDestacados.length}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              Vive la Aventura
              <span className="block text-brand-primary-400 mt-2">
                Más Épica
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-xl">
              Descubre los mejores juegos de mesa del mundo. Desde estrategia
              hasta rol, tenemos todo lo que necesitas para tus partidas
              inolvidables.
            </p>

            {/* Botones CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/categoria/juegos-de-rol-rpg"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg text-base font-semibold text-white bg-brand-primary-600 hover:bg-brand-primary-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Explorar Catálogo
                <HiArrowRight className="ml-2 h-5 w-5" />
              </Link>

              <a
                href="#productos"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg text-base font-semibold text-white bg-gray-800 hover:bg-gray-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Ver Novedades
              </a>
            </div>

            {/* Estadísticas */}
            <div className="flex gap-8 mt-12 pt-8 border-t border-gray-700">
              <div>
                <p className="text-3xl font-bold text-white">
                  {productosDestacados.length}+
                </p>
                <p className="text-sm text-gray-400">Productos Destacados</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">15+</p>
                <p className="text-sm text-gray-400">Categorías</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">100%</p>
                <p className="text-sm text-gray-400">Envío Seguro</p>
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* 1. CARRUSEL DE PRODUCTOS */}
          {/* ============================================ */}
          <div
            className={`relative transition-all duration-1000 delay-300 transform ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-10 opacity-0"
            }`}
          >
            {/* Botones de navegación */}
            {productosDestacados.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200"
                  aria-label="Producto anterior"
                >
                  <HiChevronLeft className="h-6 w-6" />
                </button>

                <button
                  onClick={goToNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200"
                  aria-label="Producto siguiente"
                >
                  <HiChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Tarjeta del producto */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
              {/* Imagen del producto */}
              <div className="relative bg-gray-100 aspect-square">
                <img
                  key={productoActual.id}
                  src={
                    productoActual.imagen ||
                    "https://via.placeholder.com/400x400.png?text=Sin+Imagen"
                  }
                  alt={productoActual.nombre}
                  className="w-full h-full object-contain p-8 animate-fade-in"
                />
                {/* Badge de stock */}
                <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  ✓ {productoActual.stock} en stock
                </div>
                {/* ✅ Badge de descuento dinámico */}
                {tieneDescuento && porcentajeDescuento > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    -{porcentajeDescuento}% OFF
                  </div>
                )}
              </div>

              {/* Info del producto */}
              <div className="p-6">
                <p className="text-sm text-brand-primary-600 font-semibold mb-2">
                  {productoActual.categoria}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {productoActual.nombre}
                </h3>
                <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                  {productoActual.descripcion || "Descripción no disponible"}
                </p>

                {/* Precio */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    {/* Precio original tachado solo si hay descuento real */}
                    {tieneDescuento && precioOriginal && (
                      <p className="text-sm text-gray-500 line-through">
                        S/ {precioOriginal}
                      </p>
                    )}
                    <p className="text-3xl font-bold text-gray-900">
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

                {/* Botones */}
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-brand-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-primary-700 transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <HiShoppingCart className="h-5 w-5" />
                    Agregar
                  </button>

                  <Link
                    to={`/producto/${productoActual.slug}`}
                    className="px-6 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:border-brand-primary-600 hover:text-brand-primary-600 transition-colors duration-200"
                  >
                    Ver Detalles
                  </Link>
                </div>
              </div>
            </div>

            {/* Indicadores del carrusel */}
            {productosDestacados.length > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {productosDestacados.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "w-8 bg-brand-primary-600"
                        : "w-2 bg-gray-400 hover:bg-gray-500"
                    }`}
                    aria-label={`Ir al producto ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decoración: Círculos de fondo */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-brand-primary-600 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-10 translate-x-1/2 translate-y-1/2"></div>

      {/* CSS para animación de fade-in */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Hero;
