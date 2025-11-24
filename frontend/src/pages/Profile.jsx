// src/pages/Profile.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "firebase/auth";
import { storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(user?.photoURL || "");
  const [message, setMessage] = useState("");
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Si no hay usuario logueado
  if (!user) {
    return (
      <div className="flex justify-center mt-16">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center space-y-4 max-w-md w-full">
          <h2 className="text-xl font-bold text-gray-800">Acceso denegado</h2>
          <p className="text-gray-600">
            Debes iniciar sesión para ver y editar tu perfil.
          </p>
          <Link
            to="/login"
            className="inline-flex justify-center rounded-lg bg-brand-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-primary-700 transition-colors"
          >
            Ir a iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  // Cuando seleccionas un archivo
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("📁 Archivo seleccionado:", file);
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file)); // vista previa local
    setMessage("");
  };

  // Subir foto a Storage y actualizar photoURL
  const handleUploadPhoto = async () => {
    if (!selectedFile) {
      setMessage("Primero selecciona una imagen.");
      return;
    }

    try {
      setLoadingPhoto(true);
      setMessage("Subiendo imagen...");

      const path = `avatars/${user.uid}/profile.jpg`;
      console.log("🚀 Subiendo a ruta:", path);

      const fileRef = ref(storage, path);

      const uploadResult = await uploadBytes(fileRef, selectedFile);
      console.log("✅ uploadBytes OK:", uploadResult);

      const url = await getDownloadURL(fileRef);
      console.log("🔗 URL obtenida:", url);

      await updateProfile(user, { photoURL: url });
      console.log("✅ updateProfile OK");

      setPhotoURL(url);
      setPreview(url);
      setMessage("Foto de perfil actualizada correctamente ✔");
    } catch (err) {
      console.error("❌ Error al subir la foto:", err);
      setMessage("Error al subir la foto. Revisa la consola para más detalles.");
    } finally {
      setLoadingPhoto(false);
    }
  };

  // Guardar nombre visible (displayName)
  const handleSaveProfile = async () => {
    try {
      setSavingProfile(true);
      setMessage("Guardando perfil...");

      await updateProfile(user, {
        displayName: displayName || null,
        photoURL: photoURL || user.photoURL || null,
      });

      console.log("✅ Perfil actualizado");
      setMessage("Perfil actualizado correctamente ✔");
    } catch (err) {
      console.error("❌ Error al actualizar el perfil:", err);
      setMessage("Error al actualizar el perfil.");
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="flex justify-center mt-10 mb-16 px-4">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8 md:p-10">
        {/* Encabezado */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Mi perfil
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Administra tu información y tu foto de perfil para Ludoteka.
          </p>
        </div>

        {/* Contenido en dos columnas en desktop */}
        <div className="mt-8 flex flex-col md:flex-row gap-8 md:gap-10">
          {/* Columna izquierda: avatar y botones */}
          <div className="flex flex-col items-center md:items-start gap-4 md:w-1/3">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden shadow">
              <img
                src={
                  preview ||
                  photoURL ||
                  "https://placehold.co/200x200?text=Sin+Foto"
                }
                alt="Foto de perfil"
                className="w-full h-full object-cover"
              />
            </div>

            <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300">
              Elegir imagen
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={handleUploadPhoto}
              disabled={loadingPhoto}
              className="inline-flex justify-center rounded-lg bg-brand-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loadingPhoto ? "Subiendo..." : "Subir foto de perfil"}
            </button>
          </div>

          {/* Columna derecha: datos de perfil */}
          <div className="md:w-2/3 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Nombre visible
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Ej: Alexander Alcocer"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Correo</label>
              <input
                type="text"
                value={user.email}
                disabled
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Mensaje y botones inferiores */}
        {message && (
          <p className="mt-6 text-center md:text-left text-sm text-brand-primary-600 font-semibold">
            {message}
          </p>
        )}

        <div className="mt-6 flex flex-col md:flex-row gap-3">
          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={savingProfile}
            className="w-full md:w-auto inline-flex justify-center rounded-lg bg-brand-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {savingProfile ? "Guardando..." : "Guardar cambios"}
          </button>

          <Link
            to="/facturas"
            className="w-full md:w-auto inline-flex justify-center items-center gap-2 rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-900 transition-colors"
          >
            <span>📄</span> <span>Ver mis facturas</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
