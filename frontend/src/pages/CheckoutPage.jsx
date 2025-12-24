// src/pages/CheckoutPage.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { disminuirStockProducto } from "../services/api";
import { db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Datos de tarjeta
  const [cardType, setCardType] = useState("credito"); // "credito" | "debito"
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState(""); // MM/AA
  const [cardCVV, setCardCVV] = useState("");
  const [cardErrors, setCardErrors] = useState({});

  // Datos del formulario de envío / contacto
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    direccion: "",
  });

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ============================
  // Helpers para datos de tarjeta
  // ============================

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 16); // solo 16 dígitos
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const handleCardNumberChange = (e) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleCVVChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 3); // máx 3 dígitos
    setCardCVV(digits);
  };

  const validateCardData = () => {
    const errors = {};

    if (!cardName.trim()) {
      errors.cardName = "Ingresa el nombre tal como aparece en la tarjeta.";
    }

    const digitsNumber = cardNumber.replace(/\D/g, "");
    if (digitsNumber.length !== 16) {
      errors.cardNumber = "El número de tarjeta debe tener 16 dígitos.";
    }

    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      errors.cardExpiry = "Usa el formato MM/AA.";
    } else {
      const [mm, yy] = cardExpiry.split("/").map((v) => parseInt(v, 10));
      if (mm < 1 || mm > 12) {
        errors.cardExpiry = "El mes debe estar entre 01 y 12.";
      }
    }

    const cvvDigits = cardCVV.replace(/\D/g, "");
    if (cvvDigits.length !== 3) {
      errors.cardCVV = "El CVV debe tener exactamente 3 dígitos.";
    }

    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ============================
  // Submit del checkout
  // ============================

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("Debes iniciar sesión para completar la compra.");
      return;
    }

    if (!form.nombre || !form.correo || !form.direccion) {
      setError("Completa todos los campos para continuar.");
      return;
    }

    if (!validateCardData()) {
      return;
    }

    try {
      setProcessing(true);

      // 🧪 Simulamos pago
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // ✅ Actualizar stock en Django
      await Promise.all(
        cartItems.map((item) =>
          disminuirStockProducto(item.slug, item.quantity)
        )
      );

      // Snapshot de ítems para factura y para la pantalla de éxito
      const itemsSnapshot = cartItems.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        slug: item.slug,
        cantidad: item.quantity,
        precio: item.precio,
        subtotal: item.precio * item.quantity,
      }));

      // Crear factura en Firestore: users/{uid}/invoices
      const invoiceNumber = `FAC-${Math.floor(
        100000 + Math.random() * 900000
      )}`;

      await addDoc(collection(db, "users", user.uid, "invoices"), {
        number: invoiceNumber,
        total: cartTotal,
        createdAt: serverTimestamp(),
        items: itemsSnapshot,
        nombreCliente: form.nombre,
        correoCliente: form.correo,
        metodoPago:
          cardType === "credito" ? "Tarjeta de crédito" : "Tarjeta de débito",
      });

      clearCart();

      navigate("/checkout/success", {
        state: {
          nombre: form.nombre,
          total: cartTotal,
          items: itemsSnapshot,
          metodoPago:
            cardType === "credito" ? "Tarjeta de crédito" : "Tarjeta de débito",
        },
      });
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.detail ||
          "Hubo un problema al procesar el pago o guardar la factura."
      );
    } finally {
      setProcessing(false);
    }
  };

  // ============================
  // Si el carrito está vacío
  // ============================

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

  // ============================
  // Vista principal
  // ============================

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
          {/* Datos personales */}
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
              placeholder="Tu Nombre"
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

          {/* Método de pago: tarjeta */}
          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Método de pago
            </h3>

            {/* Tipo de tarjeta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de tarjeta
              </label>
              <select
                value={cardType}
                onChange={(e) => setCardType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary-500 focus:ring-brand-primary-500 text-sm"
              >
                <option value="credito">Tarjeta de crédito</option>
                <option value="debito">Tarjeta de débito</option>
              </select>
            </div>

            {/* Nombre en la tarjeta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre en la tarjeta
              </label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Nombre del propietario"
                className={`mt-1 block w-full rounded-md border ${
                  cardErrors.cardName ? "border-red-500" : "border-gray-300"
                } shadow-sm focus:border-brand-primary-500 focus:ring-brand-primary-500 text-sm`}
              />
              {cardErrors.cardName && (
                <p className="mt-1 text-xs text-red-600">
                  {cardErrors.cardName}
                </p>
              )}
            </div>

            {/* Número de tarjeta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de tarjeta
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                inputMode="numeric"
                className={`mt-1 block w-full rounded-md border ${
                  cardErrors.cardNumber ? "border-red-500" : "border-gray-300"
                } shadow-sm focus:border-brand-primary-500 focus:ring-brand-primary-500 text-sm`}
              />
              {cardErrors.cardNumber && (
                <p className="mt-1 text-xs text-red-600">
                  {cardErrors.cardNumber}
                </p>
              )}
            </div>

            {/* Fecha y CVV */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de vencimiento
                </label>
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="MM/AA"
                  maxLength={5}
                  className={`mt-1 block w-full rounded-md border ${
                    cardErrors.cardExpiry ? "border-red-500" : "border-gray-300"
                  } shadow-sm focus:border-brand-primary-500 focus:ring-brand-primary-500 text-sm`}
                />
                {cardErrors.cardExpiry && (
                  <p className="mt-1 text-xs text-red-600">
                    {cardErrors.cardExpiry}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  value={cardCVV}
                  onChange={handleCVVChange}
                  placeholder="123"
                  maxLength={3}
                  inputMode="numeric"
                  className={`mt-1 block w-full rounded-md border ${
                    cardErrors.cardCVV ? "border-red-500" : "border-gray-300"
                  } shadow-sm focus:border-brand-primary-500 focus:ring-brand-primary-500 text-sm`}
                />
                {cardErrors.cardCVV && (
                  <p className="mt-1 text-xs text-red-600">
                    {cardErrors.cardCVV}
                  </p>
                )}
              </div>
            </div>
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

        </p>
      </div>
    </div>
  );
};

export default CheckoutPage;
