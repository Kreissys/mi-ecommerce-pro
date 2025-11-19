// src/pages/CartPage.jsx
// ✅ CORREGIDO

import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { HiOutlineTrash, HiMinus, HiPlus } from 'react-icons/hi';

const CartPage = () => {
  const {
    cartItems,
    cartTotal,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount
  } = useCart();

  const handleRemove = (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este producto?")) {
      removeFromCart(id);
    }
  };

  const handleUpdateQuantity = (id, newQuantity, stock) => {
    if (newQuantity <= 0) {
      handleRemove(id);
    } else if (newQuantity > stock) {
      alert(`No puedes agregar más de ${stock} unidades.`);
      updateQuantity(id, stock);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h1>
        <p className="text-gray-500 mb-6">Parece que aún no has agregado ningún juego.</p>
        <Link
          to="/"
          className="inline-block rounded-md border border-transparent bg-brand-primary-600 px-8 py-3 text-base font-medium text-white hover:bg-brand-primary-700"
        >
          ¡Ver juegos!
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-lg overflow-hidden">
      <h1 className="text-3xl font-bold text-gray-900 p-6 border-b">Tu Carrito ({itemCount} {itemCount === 1 ? 'item' : 'items'})</h1>
      
      <div className="divide-y divide-gray-200">
        {cartItems.map((item) => (
          <div key={item.id} className="flex flex-col sm:flex-row items-center p-4">
            
            {/* ✅ CORRECCIÓN: Ya NO concatenamos nada */}
            <img
              src={item.imagen || 'https://via.placeholder.com/100x100.png?text=Sin+Imagen'}
              alt={item.nombre}
              className="h-24 w-24 rounded-md object-cover mb-4 sm:mb-0 sm:mr-6"
            />
            
            <div className="flex-1 min-w-0">
              <Link to={`/producto/${item.slug}`} className="text-lg font-medium text-gray-900 hover:text-brand-primary-600">
                {item.nombre}
              </Link>
              <p className="text-sm text-gray-500">S/ {item.precio}</p>
            </div>
            
            <div className="flex items-center my-4 sm:my-0 sm:mx-6">
              <button
                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item.stock)}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
              >
                <HiMinus className="h-5 w-5" />
              </button>
              <span className="mx-4 w-10 text-center">{item.quantity}</span>
              <button
                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item.stock)}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
              >
                <HiPlus className="h-5 w-5" />
              </button>
            </div>

            <p className="font-medium text-lg text-gray-900 w-24 text-right">
              S/ {(item.precio * item.quantity).toFixed(2)}
            </p>
            
            <button
              onClick={() => handleRemove(item.id)}
              className="ml-4 p-2 text-gray-400 hover:text-red-600"
            >
              <HiOutlineTrash className="h-6 w-6" />
            </button>
          </div>
        ))}
      </div>
      
      <div className="p-6 border-t">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium text-gray-900">Total:</span>
          <span className="text-2xl font-bold text-gray-900">S/ {cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <button
            onClick={() => {
              if (window.confirm("¿Vaciar todo el carrito?")) clearCart();
            }}
            className="text-sm font-medium text-red-600 hover:text-red-500 mb-4 sm:mb-0"
          >
            Vaciar Carrito
          </button>
          <button
            className="w-full sm:w-auto rounded-md border border-transparent bg-brand-primary-600 px-8 py-3 text-base font-medium text-white shadow-sm hover:bg-brand-primary-700"
          >
            Proceder al Pago
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;