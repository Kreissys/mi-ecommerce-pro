// src/App.jsx

import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import Login from './pages/Login'; // <-- AGREGADO
import Profile from './pages/Profile';  // <-- NUEVO
import CheckoutPage from './pages/CheckoutPage'; // <-- NUEVO
import CheckoutSuccess from './pages/CheckoutSuccess'; // arriba
import InvoicesPage from "./pages/InvoicesPage";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="producto/:slug" element={<ProductPage />} />
        <Route path="categoria/:slug" element={<CategoryPage />} />
        <Route path="carrito" element={<CartPage />} />
        <Route path="favoritos" element={<WishlistPage />} />
        <Route path="login" element={<Login />} /> {/* <-- NUEVA RUTA */}
        <Route path="*" element={<div>404 - Página no encontrada</div>} />
        <Route path="perfil" element={<Profile />} />
        <Route path="checkout" element={<CheckoutPage />} />  {/* NUEVO */}
<Route path="checkout/success" element={<CheckoutSuccess />} />
<Route path="/facturas" element={<InvoicesPage />} />

      </Route>
    </Routes>
  );
}

export default App;
