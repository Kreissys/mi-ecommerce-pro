// src/App.jsx
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import CheckoutPage from "./pages/CheckoutPage";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import InvoicesPage from "./pages/InvoicesPage";

import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    // Layout es el “marco” (Navbar, Footer, etc.)
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Home */}
        <Route index element={<HomePage />} />

        {/* Productos / categorías */}
        <Route path="producto/:slug" element={<ProductPage />} />
        <Route path="categoria/:slug" element={<CategoryPage />} />

        {/* Carrito / favoritos */}
        <Route path="carrito" element={<CartPage />} />
        <Route path="favoritos" element={<WishlistPage />} />

        {/* Auth */}
        <Route path="login" element={<Login />} />
        <Route path="perfil" element={<Profile />} />

        {/* Checkout */}
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="checkout/success" element={<CheckoutSuccess />} />

        {/* Facturas */}
        <Route path="facturas" element={<InvoicesPage />} />

        {/* 🔒 Panel admin SOLO para admins */}
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* 404 dentro del Layout */}
        <Route path="*" element={<div>404 - Página no encontrada</div>} />
      </Route>
    </Routes>
  );
}

export default App;
