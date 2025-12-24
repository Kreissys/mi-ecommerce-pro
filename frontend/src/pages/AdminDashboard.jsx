// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getProductos,
  createProductoConImagen,
  updateProductoConImagen,
  deleteProducto,
} from "../services/api";

const AdminDashboard = () => {
  const { user } = useAuth();

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Modo crear vs editar
  const [isEditing, setIsEditing] = useState(false);
  const [editingSlug, setEditingSlug] = useState(null);

  // Form tipo Django admin
  const [formData, setFormData] = useState({
    categoria: "",
    nombre: "",
    slug: "",
    descripcion: "",
    precio: "",
    stock: "",
    disponible: true,
    es_nuevo: false,
    tiene_descuento: false,
    porcentaje_descuento: "0",
    imagen: null,
  });

  const resetForm = () => {
    setFormData({
      categoria: "",
      nombre: "",
      slug: "",
      descripcion: "",
      precio: "",
      stock: "",
      disponible: true,
      es_nuevo: false,
      tiene_descuento: false,
      porcentaje_descuento: "0",
      imagen: null,
    });
    setIsEditing(false);
    setEditingSlug(null);
  };

  // Traer productos
  const cargarProductos = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getProductos();
      setProductos(res.data);
    } catch (err) {
      console.error("Error cargando productos:", err);
      setError("No se pudieron cargar los productos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // Inputs texto/number/checkbox
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Input archivo
  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      imagen: file,
    }));
  };

  // Click en "Crear producto / Cancelar"
  const handleToggleForm = () => {
    if (showForm) {
      // Si estaba abierto, reseteamos todo
      resetForm();
      setShowForm(false);
      setError("");
    } else {
      setShowForm(true);
    }
  };

  // Click en "Editar" de la tabla
  const handleEditClick = (producto) => {
    setIsEditing(true);
    setEditingSlug(producto.slug);
    setShowForm(true);
    setError("");

    setFormData({
      categoria: "", // opcional, solo si quieres cambiarla
      nombre: producto.nombre || producto.name || producto.title || "",
      slug: producto.slug || "",
      descripcion: producto.descripcion || "",
      precio: producto.precio || producto.price || "",
      stock:
        producto.stock !== undefined && producto.stock !== null
          ? String(producto.stock)
          : "",
      disponible:
        producto.disponible !== undefined ? producto.disponible : true,
      es_nuevo: producto.es_nuevo ?? false,
      tiene_descuento: producto.tiene_descuento ?? false,
      porcentaje_descuento:
        producto.porcentaje_descuento !== undefined &&
        producto.porcentaje_descuento !== null
          ? String(producto.porcentaje_descuento)
          : "0",
      imagen: null, // no podemos precargar archivos
    });
  };

  // Crear / actualizar producto (misma función)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const fd = new FormData();

      // Solo mandamos categoria si el admin escribió algo
      if (formData.categoria.trim() !== "") {
        fd.append("categoria", formData.categoria.trim());
      }

      fd.append("nombre", formData.nombre);
      fd.append("slug", formData.slug);
      fd.append("descripcion", formData.descripcion);
      fd.append("precio", formData.precio);
      fd.append("stock", formData.stock || "0");
      fd.append("disponible", formData.disponible ? "true" : "false");
      fd.append("es_nuevo", formData.es_nuevo ? "true" : "false");
      fd.append(
        "tiene_descuento",
        formData.tiene_descuento ? "true" : "false"
      );
      fd.append(
        "porcentaje_descuento",
        formData.porcentaje_descuento || "0"
      );

      if (formData.imagen) {
        fd.append("imagen", formData.imagen);
      }

      if (isEditing && editingSlug) {
        // EDITAR (PATCH)
        await updateProductoConImagen(editingSlug, fd);
      } else {
        // CREAR (POST)
        await createProductoConImagen(fd);
      }

      await cargarProductos();
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("Error guardando producto:", err.response || err);
      setError(
        "No se pudo guardar el producto. Revisa los campos obligatorios."
      );
    }
  };

  // Eliminar
  const handleDelete = async (slug) => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;

    try {
      await deleteProducto(slug);
      setProductos((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err) {
      console.error("Error eliminando producto:", err);
      alert("No se pudo eliminar el producto.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Panel de administración</h1>
        <p className="text-gray-600">
          Administra los productos y el contenido de Ludoteka.
        </p>
      </div>

      {/* Info admin */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">
          Información del administrador
        </h2>
        <p className="text-gray-700">
          Correo: <span className="font-medium">{user?.email}</span>
        </p>
      </div>

      {/* Gestión de productos */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Gestión de productos</h2>
          <button
            onClick={handleToggleForm}
            className="px-4 py-2 rounded-md bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition"
          >
            {showForm
              ? isEditing
                ? "Cancelar edición"
                : "Cerrar formulario"
              : "+ Crear producto"}
          </button>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </div>
        )}

        {/* Formulario crear / editar */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Categoría */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría (slug)
                {!isEditing && " *"}
              </label>
              <input
                type="text"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                required={!isEditing}
                className="w-full border rounded-md px-3 py-2 text-sm"
                placeholder={isEditing ? "Dejar vacío para no cambiarla" : ""}
              />
              <p className="text-xs text-gray-400 mt-1">
                Usa el slug de la categoría (ej: &quot;estrategia&quot;,
                &quot;familiares&quot;).
              </p>
            </div>

            {/* Nombre */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>

            {/* Slug */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>

            {/* Descripción */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={3}
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>

            {/* Precio */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio *
              </label>
              <input
                type="number"
                step="0.01"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                required
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>

            {/* Stock */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>

            {/* Imagen */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagen
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm"
              />
              {formData.imagen && (
                <p className="text-xs text-gray-500 mt-1">
                  Archivo seleccionado: {formData.imagen.name}
                </p>
              )}
              {isEditing && !formData.imagen && (
                <p className="text-xs text-gray-400 mt-1">
                  Si no seleccionas una nueva imagen, se mantendrá la actual.
                </p>
              )}
            </div>

            {/* Checkboxes */}
            <div className="col-span-1 flex items-center gap-2">
              <input
                id="disponible"
                type="checkbox"
                name="disponible"
                checked={formData.disponible}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <label
                htmlFor="disponible"
                className="text-sm font-medium text-gray-700"
              >
                Disponible
              </label>
            </div>

            <div className="col-span-1 flex items-center gap-2">
              <input
                id="es_nuevo"
                type="checkbox"
                name="es_nuevo"
                checked={formData.es_nuevo}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <label
                htmlFor="es_nuevo"
                className="text-sm font-medium text-gray-700"
              >
                Es nuevo
              </label>
            </div>

            <div className="col-span-1 flex items-center gap-2">
              <input
                id="tiene_descuento"
                type="checkbox"
                name="tiene_descuento"
                checked={formData.tiene_descuento}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <label
                htmlFor="tiene_descuento"
                className="text-sm font-medium text-gray-700"
              >
                Tiene descuento
              </label>
            </div>

            {/* Porcentaje descuento */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Porcentaje descuento
              </label>
              <input
                type="number"
                name="porcentaje_descuento"
                value={formData.porcentaje_descuento}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>

            {/* Botón guardar */}
            <div className="col-span-1 md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition"
              >
                {isEditing ? "Guardar cambios" : "Guardar producto"}
              </button>
            </div>
          </form>
        )}

        {/* Tabla de productos */}
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">
                    Nombre
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">
                    Precio
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">
                    Stock
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">
                    Slug
                  </th>
                  <th className="px-4 py-2 text-right font-medium text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      Cargando productos...
                    </td>
                  </tr>
                ) : productos.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No hay productos registrados.
                    </td>
                  </tr>
                ) : (
                  productos.map((p) => {
                    const nombre = p.nombre || p.name || p.title;
                    const precio = p.precio || p.price;
                    const stock = p.stock ?? p.inventario ?? "-";

                    return (
                      <tr key={p.slug} className="border-t">
                        <td className="px-4 py-2">{nombre}</td>
                        <td className="px-4 py-2">
                          {precio !== undefined ? `S/ ${precio}` : "-"}
                        </td>
                        <td className="px-4 py-2">{stock}</td>
                        <td className="px-4 py-2">{p.slug}</td>
                        <td className="px-4 py-2 text-right space-x-2">
                          <button
                            onClick={() => handleEditClick(p)}
                            className="px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(p.slug)}
                            className="px-3 py-1 text-xs rounded bg-red-500 text-white hover:bg-red-600"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
