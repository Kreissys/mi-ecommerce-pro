// src/components/Footer.jsx
// Archivo completo para copiar y pegar

import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin } from 'react-icons/fa'; // Iconos sociales

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Columna 1: Acerca de */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Ludoteka 🎲</h3>
            <p className="text-sm">
              Tu tienda de confianza para juegos de mesa. Desde clásicos familiares hasta
              estrategias complejas.
            </p>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Categorías</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/categoria/estrategia" className="hover:text-white">Estrategia</Link></li>
              <li><Link to="/categoria/familiares" className="hover:text-white">Familiares</Link></li>
              <li><Link to="/categoria/juegos-de-cartas" className="hover:text-white">Juegos de Cartas</Link></li>
              <li><Link to="/categoria/juegos-de-rol-rpg" className="hover:text-white">Rol (RPG)</Link></li>
              <li><Link to="/categoria/juegos-de-fiesta-party" className="hover:text-white">Juegos de Fiesta</Link></li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Sígueme</h3>
            <p className="text-sm mb-3">
              Este es un proyecto de portafolio de Carlos Llano.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">GitHub</span>
                <FaGithub className="h-6 w-6" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <FaLinkedin className="h-6 w-6" />
              </a>
            </div>
          </div>

        </div>
        
        {/* Línea inferior */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Ludoteka. Creado para el Laboratorio 13 de Tecsup.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;