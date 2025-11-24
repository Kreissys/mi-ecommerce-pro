// src/pages/CheckoutPage.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    direccion: "",
    metodoPago: "tarjeta",
  });

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

 // src/pages/CheckoutPage.jsx

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!form.nombre || !form.correo || !form.direccion) {
    setError("Completa todos los campos para continuar.");
    return;
  }

  try {
    setProcessing(true);

    // 🧪 Simulamos pago
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 👉 Guardamos una copia de los productos ANTES de vaciar el carrito
    const itemsSnapshot = cartItems.map(item => ({ ...item }));

    clearCart();

    navigate("/checkout/success", {
      state: {
        nombre: form.nombre,
        total: cartTotal,
        items: itemsSnapshot,    // 👈 aquí van los productos para la factura
      },
    });
  } catch (err) {
    console.error(err);
    setError("Hubo un problema al procesar el pago. Intenta de nuevo.");
  } finally {
    setProcessing(false);
  }
};

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto mt-10 bg-white shadow rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
        <p className="mb-4 text-gray-600">
          Agrega algunos juegos antes de ir al checkout.
        </p>
        <Link
          to="/"
          className="inline-flex justify-center rounded-lg bg-brand-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-primary-700"
        >
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 grid gap-8 md:grid-cols-3">
      {/* Resumen del pedido */}
      <div className="md:col-span-1 bg-white shadow rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Resumen del pedido
        </h2>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center text-sm"
            >
              <span className="text-gray-700">
                {item.nombre} x {item.quantity}
              </span>
              <span className="font-semibold">
                S/ {(item.precio * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t pt-4 flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>S/ {cartTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Formulario de pago */}
      <div className="md:col-span-2 bg-white shadow rounded-xl p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Información de pago
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre completo
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
              placeholder="Ej: Alexander Alcocer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
              placeholder="tucorreo@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Dirección de envío
            </label>
            <textarea
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
              placeholder="Calle, número, distrito, ciudad"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Método de pago
            </label>
            <select
              name="metodoPago"
              value={form.metodoPago}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
            >
              <option value="tarjeta">Tarjeta de crédito / débito</option>
              <option value="yape">Yape / Plin </option>
              <option value="contraentrega">Pago contra entrega</option>
            </select>
          </div>

          {error && (
            <p className="text-sm text-red-500 font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={processing}
            className="w-full inline-flex justify-center rounded-lg bg-brand-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {processing
              ? "Procesando pago..."
              : `Pagar S/ ${cartTotal.toFixed(2)}`}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center">
          Esta es una pasarela de pago simulada para fines académicos. No se
          realiza ningún cobro real.
        </p>
      </div>
    </div>
  );
};

export default CheckoutPage;
