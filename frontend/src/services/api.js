// src/services/api.js
import axios from "axios";

// Cliente Axios apuntando a la API de Django
const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

// ------------ PRODUCTOS ------------

// Obtener todos los productos
export const getProductos = () => {
  return apiClient.get("/productos/");
};

// Obtener un producto por slug
export const getProducto = (slug) => {
  return apiClient.get(`/productos/${slug}/`);
};

// Crear producto con imagen (multipart/form-data)
export const createProductoConImagen = (formData) => {
  return apiClient.post("/productos/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Actualizar producto con imagen (PATCH, parcial)
export const updateProductoConImagen = (slug, formData) => {
  return apiClient.patch(`/productos/${slug}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Eliminar producto por slug
export const deleteProducto = (slug) => {
  return apiClient.delete(`/productos/${slug}/`);
};

// ------------ CATEGORÍAS ------------

// Obtener todas las categorías
export const getCategorias = () => {
  return apiClient.get("/categorias/");
};

// Obtener una categoría por slug
export const getCategoria = (slug) => {
  return apiClient.get(`/categorias/${slug}/`);
};
// ✅ Disminuir stock de un producto según su slug
export const disminuirStockProducto = (slug, cantidad) => {
  return apiClient.post(`/productos/${slug}/disminuir_stock/`, {
    cantidad,
  });
};
export const crearPedido = (data) =>
  apiClient.post('/pedidos/', data);