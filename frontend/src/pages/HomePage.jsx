// src/pages/HomePage.jsx
// ✅ CON FILTROS AVANZADOS: Categoría + Precio + Ordenamiento

import React, { useState, useEffect } from 'react';
import { getProductos, getCategorias } from '../services/api';
import ProductCard from '../components/ProductCard';
import Hero from '../components/Hero';
import { HiSearch, HiX, HiFilter } from 'react-icons/hi';

const HomePage = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [ordenamiento, setOrdenamiento] = useState('reciente');
  const [showFilters, setShowFilters] = useState(false);

  // Cargar productos y categorías
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productosRes, categoriasRes] = await Promise.all([
          getProductos(),
          getCategorias()
        ]);
        setProductos(productosRes.data);
        setCategorias(categoriasRes.data);
        setError(null);
      } catch (err) {
        console.error("Error al obtener datos:", err);
        setError("No se pudieron cargar los productos. Asegúrate de que el servidor de Django esté corriendo.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ============================================
  // LÓGICA DE FILTRADO Y ORDENAMIENTO
  // ============================================
  const filteredProductos = productos
    .filter(producto => {
      // Filtro por nombre
      const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro por categoría
      const matchesCategoria = selectedCategoria === '' || producto.categoria === selectedCategoria;
      
      // Filtro por precio
      const precio = parseFloat(producto.precio);
      const matchesPrecioMin = precioMin === '' || precio >= parseFloat(precioMin);
      const matchesPrecioMax = precioMax === '' || precio <= parseFloat(precioMax);
      
      return matchesSearch && matchesCategoria && matchesPrecioMin && matchesPrecioMax;
    })
    .sort((a, b) => {
      // Ordenamiento
      switch (ordenamiento) {
        case 'precio-asc':
          return parseFloat(a.precio) - parseFloat(b.precio);
        case 'precio-desc':
          return parseFloat(b.precio) - parseFloat(a.precio);
        case 'nombre-asc':
          return a.nombre.localeCompare(b.nombre);
        case 'nombre-desc':
          return b.nombre.localeCompare(a.nombre);
        case 'reciente':
        default:
          return b.id - a.id; // Los más nuevos primero
      }
    });

  // Limpiar todos los filtros
  const limpiarFiltros = () => {
    setSearchTerm('');
    setSelectedCategoria('');
    setPrecioMin('');
    setPrecioMax('');
    setOrdenamiento('reciente');
  };

  // Verificar si hay filtros activos
  const hayFiltrosActivos = searchTerm || selectedCategoria || precioMin || precioMax || ordenamiento !== 'reciente';

  if (loading) {
    return <div className="text-center text-xl">Cargando productos... 🌀</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 bg-red-100 p-4 rounded-md">{error}</div>;
  }

  return (
    <div>
      {/* Hero */}
      <Hero />

      {/* ============================================ */}
      {/* SECCIÓN DE FILTROS */}
      {/* ============================================ */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        
        {/* Barra de búsqueda principal */}
        <div className="mb-6">
          <label htmlFor="search" className="sr-only">Buscar juegos</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="focus:ring-brand-primary-500 focus:border-brand-primary-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-lg py-3"
              placeholder="Buscar por nombre de juego..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <HiX className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Botón para mostrar/ocultar filtros avanzados (móvil) */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden w-full mb-4 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <HiFilter className="h-5 w-5" />
          {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros Avanzados'}
        </button>

        {/* Filtros avanzados */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${showFilters ? 'block' : 'hidden lg:grid'}`}>
          
          {/* Filtro por categoría */}
          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              id="categoria"
              value={selectedCategoria}
              onChange={(e) => setSelectedCategoria(e.target.value)}
              className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-brand-primary-500 focus:border-brand-primary-500 sm:text-sm py-2"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.nombre}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro precio mínimo */}
          <div>
            <label htmlFor="precioMin" className="block text-sm font-medium text-gray-700 mb-2">
              Precio Mínimo
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm">
                S/
              </span>
              <input
                type="number"
                id="precioMin"
                min="0"
                step="10"
                placeholder="0"
                value={precioMin}
                onChange={(e) => setPrecioMin(e.target.value)}
                className="block w-full pl-8 border-gray-300 rounded-lg shadow-sm focus:ring-brand-primary-500 focus:border-brand-primary-500 sm:text-sm py-2"
              />
            </div>
          </div>

          {/* Filtro precio máximo */}
          <div>
            <label htmlFor="precioMax" className="block text-sm font-medium text-gray-700 mb-2">
              Precio Máximo
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm">
                S/
              </span>
              <input
                type="number"
                id="precioMax"
                min="0"
                step="10"
                placeholder="1000"
                value={precioMax}
                onChange={(e) => setPrecioMax(e.target.value)}
                className="block w-full pl-8 border-gray-300 rounded-lg shadow-sm focus:ring-brand-primary-500 focus:border-brand-primary-500 sm:text-sm py-2"
              />
            </div>
          </div>

          {/* Ordenamiento */}
          <div>
            <label htmlFor="ordenamiento" className="block text-sm font-medium text-gray-700 mb-2">
              Ordenar por
            </label>
            <select
              id="ordenamiento"
              value={ordenamiento}
              onChange={(e) => setOrdenamiento(e.target.value)}
              className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-brand-primary-500 focus:border-brand-primary-500 sm:text-sm py-2"
            >
              <option value="reciente">Más recientes</option>
              <option value="precio-asc">Precio: Menor a Mayor</option>
              <option value="precio-desc">Precio: Mayor a Menor</option>
              <option value="nombre-asc">Nombre: A-Z</option>
              <option value="nombre-desc">Nombre: Z-A</option>
            </select>
          </div>
        </div>

        {/* Botón para limpiar filtros */}
        {hayFiltrosActivos && (
          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <p className="text-sm text-gray-600">
              Mostrando <span className="font-semibold text-brand-primary-600">{filteredProductos.length}</span> de {productos.length} productos
            </p>
            <button
              onClick={limpiarFiltros}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <HiX className="h-4 w-4" />
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* TÍTULO Y RESULTADOS */}
      {/* ============================================ */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          {searchTerm ? `Resultados para "${searchTerm}"` : "Nuestros Juegos de Mesa"}
        </h2>
        <p className="text-gray-500">
          {filteredProductos.length} {filteredProductos.length === 1 ? 'producto' : 'productos'}
        </p>
      </div>

      {/* ============================================ */}
      {/* GRID DE PRODUCTOS */}
      {/* ============================================ */}
      {filteredProductos.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {filteredProductos.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <HiSearch className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron productos
          </h3>
          <p className="text-gray-500 mb-6">
            Intenta ajustar los filtros o realiza una búsqueda diferente.
          </p>
          <button
            onClick={limpiarFiltros}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 transition-colors"
          >
            <HiX className="h-5 w-5" />
            Limpiar todos los filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;