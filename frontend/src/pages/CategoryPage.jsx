// src/pages/CategoryPage.jsx
// ✅ Con Breadcrumbs y diseño mejorado

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCategoria } from '../services/api';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/Breadcrumbs';

const CategoryPage = () => {
  const { slug } = useParams();
  const [categoria, setCategoria] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        setLoading(true);
        setError(null);
        setCategoria(null);
        const response = await getCategoria(slug);
        setCategoria(response.data);
      } catch (err) {
        console.error("Error al obtener la categoría:", err);
        setError("No se pudo encontrar la categoría.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoria();
  }, [slug]);

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Skeleton loader */}
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-96"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !categoria) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar</h3>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Breadcrumbs
  const breadcrumbItems = [
    { name: categoria.nombre, path: `/categoria/${slug}` }
  ];

  return (
    <div>
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header de la categoría */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">
          {categoria.nombre}
        </h1>
        <p className="text-gray-600">
          {categoria.productos.length} {categoria.productos.length === 1 ? 'producto' : 'productos'} disponibles
        </p>
      </div>

      {/* Grid de productos */}
      {categoria.productos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 mb-4">
            <span className="text-3xl">📦</span>
          </div>
          <p className="text-gray-500 text-lg">
            No hay productos en esta categoría por el momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {categoria.productos.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;