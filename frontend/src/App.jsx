// src/App.jsx
// ✅ ACTUALIZADO con ruta de Wishlist

import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage'; // <-- NUEVO

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} /> 
        <Route path="producto/:slug" element={<ProductPage />} /> 
        <Route path="categoria/:slug" element={<CategoryPage />} /> 
        <Route path="carrito" element={<CartPage />} />
        <Route path="favoritos" element={<WishlistPage />} /> {/* <-- NUEVO */}
        <Route path="*" element={<div>404 - Página no encontrada</div>} />
      </Route>
    </Routes>
  );
}

export default App;