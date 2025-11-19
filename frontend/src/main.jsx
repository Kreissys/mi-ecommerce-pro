// src/main.jsx
// Archivo completo para copiar y pegar (actualizado)

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext' // <-- 1. Importa el Proveedor
import { WishlistProvider } from './context/WishlistContext' // <-- 2. Importa WishlistProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Envuelve TODO con el CartProvider y WishlistProvider */}
    <CartProvider>
      <WishlistProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </WishlistProvider>
    </CartProvider>
  </React.StrictMode>,
)