// src/main.jsx
// Archivo completo actualizado con Firebase AuthProvider

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { AuthProvider } from './context/AuthContext'   // <-- IMPORTANTE

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Se envuelve TODO con AuthProvider */}
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
)
