// src/pages/InvoicesPage.jsx

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { Link } from "react-router-dom";

const InvoicesPage = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadInvoices = async () => {
      try {
        // 👇 Debe coincidir EXACTO con lo que usas en CheckoutSuccess
        // collection(db, "users", user.uid, "invoices")
        const invoicesRef = collection(db, "users", user.uid, "invoices");
        const q = query(invoicesRef, orderBy("date", "desc"));
        const snap = await getDocs(q);

        const list = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("📄 Facturas cargadas:", list);
        setInvoices(list);
      } catch (err) {
        console.error("❌ Error cargando facturas:", err);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, [user]);

  if (!user) {
    return (
      <div className="flex justify-center mt-16">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center space-y-4 max-w-md w-full">
          <h2 className="text-xl font-bold text-gray-800">Debes iniciar sesión</h2>
          <p className="text-gray-600">
            Inicia sesión para ver el historial de tus facturas.
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

  if (loading) {
    return (
      <div className="flex justify-center mt-16">
        <p className="text-gray-600">Cargando facturas...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-12 mb-16">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span role="img" aria-label="invoice">📄</span> Mis Facturas
      </h1>

      {invoices.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-600">
          Aún no tienes facturas disponibles.
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((f) => (
            <div
              key={f.id}
              className="bg-white rounded-xl shadow p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-gray-800">
                  {f.invoiceId || "Factura"}
                </p>
                <p className="text-sm text-gray-500">
                  {f.date ? new Date(f.date).toLocaleString("es-PE") : ""}
                </p>
                <p className="mt-1 text-sm font-medium text-gray-800">
                  Total:{" "}
                  <span className="text-brand-primary-600">
                    S/ {Number(f.total || 0).toFixed(2)}
                  </span>
                </p>
              </div>

              {f.url && (
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center rounded-lg bg-brand-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-primary-700 transition-colors"
                >
                  Descargar PDF
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoicesPage;
