// src/pages/Login.jsx
import { useState } from "react";
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
} from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Login = () => {
  const { user } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegister) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err) {
      console.error(err);
      setError("Hubo un problema al autenticar. Revisa tus datos.");
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
      setError("No se pudo iniciar sesión con Google.");
    }
  };

  // Si ya está logueado, mostramos un mensajito bonito
  if (user) {
    return (
      <div className="flex justify-center">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Ya has iniciado sesión
          </h2>
          <p className="text-gray-600">
            Estás conectado como{" "}
            <span className="font-semibold text-brand-primary-600">
              {user.email}
            </span>
            .
          </p>
          <Link
            to="/"
            className="inline-flex justify-center rounded-lg bg-brand-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-primary-700 transition-colors"
          >
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        {/* Título */}
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {isRegister ? "Crear cuenta" : "Iniciar sesión"}
          </h1>
          <p className="text-sm text-gray-500">
            {isRegister
              ? "Regístrate para guardar tus juegos favoritos y tu carrito."
              : "Ingresa para guardar tu carrito y tus juegos favoritos."}
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              type="email"
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500"
              placeholder="tu_correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full inline-flex justify-center rounded-lg bg-brand-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary-700 transition-colors"
          >
            {isRegister ? "Crear cuenta" : "Entrar"}
          </button>
        </form>

        {/* Separador */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs uppercase text-gray-400">o</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Botón Google */}
        <button
          type="button"
          onClick={handleGoogle}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="h-5 w-5"
          />
          Iniciar sesión con Google
        </button>

        {/* Cambio entre login y registro */}
        <p className="text-center text-sm text-gray-600">
          {isRegister ? "¿Ya tienes cuenta?" : "¿Aún no tienes cuenta?"}{" "}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="font-semibold text-brand-primary-600 hover:text-brand-primary-700"
          >
            {isRegister ? "Inicia sesión" : "Crear una cuenta"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
