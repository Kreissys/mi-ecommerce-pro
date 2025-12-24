// src/components/AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();

  // Si no está logueado -> login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si está logueado pero no es admin -> home
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Es admin -> muestra el contenido
  return children;
};

export default AdminRoute;
