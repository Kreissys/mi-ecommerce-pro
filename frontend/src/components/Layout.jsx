// src/components/Layout.jsx
// Archivo completo para copiar y pegar (actualizado)

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // <-- Importamos el Navbar real
import Footer from './Footer'; // <-- Importamos el Footer real

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      {/* 1. Navbar real */}
      <Navbar />

      {/* 2. Outlet renderiza la página actual (HomePage, etc.) */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* 3. Footer real */}
      <Footer />
    </div>
  );
};

export default Layout;