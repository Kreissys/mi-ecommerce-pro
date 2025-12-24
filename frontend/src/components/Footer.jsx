// src/components/Footer.jsx
// Footer limpio SIN enlaces de GitHub/LinkedIn ni créditos de terceros

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Columna izquierda */}
        <div>
          <h3 className="text-white text-xl font-semibold mb-3">Ludoteka 🎲</h3>
          <p className="text-gray-400 text-sm">
            Tu tienda de confianza para juegos de mesa. Desde clásicos familiares hasta estrategias complejas.
          </p>
        </div>

        {/* Categorías */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Categorías</h3>
          <ul className="space-y-2 text-sm">
            <li>Estrategia</li>
            <li>Familiares</li>
            <li>Juegos de Cartas</li>
            <li>Rol (RPG)</li>
            <li>Juegos de Fiesta</li>
          </ul>
        </div>

        {/* Columna derecha vacía */}
        <div>
          {/* Dejamos vacío porque tú NO quieres enlaces */}
        </div>

      </div>

      <div className="mt-10 text-center text-gray-500 text-sm">
        © 2025 Ludoteka. Todos los derechos reservados.
      </div>
    </footer>
  );
}
