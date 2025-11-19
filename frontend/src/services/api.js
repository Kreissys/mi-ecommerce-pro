// src/services/api.js
// Archivo completo para copiar y pegar

import axios from 'axios';

// Creamos una instancia de Axios con la URL base de nuestra API de Django
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1/',
  headers: {
    'Content-Type': 'application/json'
  }
});

// --- Funciones para interactuar con la API ---

// Obtener todos los productos
export const getProductos = () => {
  return apiClient.get('/productos/');
};

// Obtener un solo producto por su slug
export const getProducto = (slug) => {
  return apiClient.get(`/productos/${slug}/`);
};

// Obtener todas las categorías (con sus productos)
export const getCategorias = () => {
  return apiClient.get('/categorias/');
};

// Obtener una sola categoría por su slug
export const getCategoria = (slug) => {
  return apiClient.get(`/categorias/${slug}/`);
};