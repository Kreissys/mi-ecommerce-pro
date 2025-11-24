// src/pages/CheckoutSuccess.jsx

import { useLocation, Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Firebase
import { auth, storage, db } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

// Logo (Vite/React lo resuelve correctamente)
import logo from "../assets/ludoteka-logo.png";

const CheckoutSuccess = () => {
  const location = useLocation();

  const nombre = location.state?.nombre || "Cliente";
  const total = location.state?.total || 0;
  const items = location.state?.items || [];

  // Helper para convertir imagen a dataURL
  const loadImageAsDataURL = async (url) => {
    const blob = await fetch(url).then((res) => res.blob());
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  const handleDownloadInvoice = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Debes iniciar sesión para guardar facturas.");
      return;
    }

    const invoiceNumber = "FAC-" + Math.floor(Math.random() * 900000 + 100000);
    const fecha = new Date().toLocaleString("es-PE");

    const doc = new jsPDF();

    // ================= LOGO =================
    try {
      const logoDataUrl = await loadImageAsDataURL(logo);
      doc.addImage(logoDataUrl, "PNG", 14, 10, 40, 40);
    } catch (e) {
      console.warn("No se pudo cargar el logo para el PDF:", e);
    }

    // ================= ENCABEZADO =================
    doc.setFontSize(18);
    doc.text("Factura de Compra - Ludoteka", 60, 20);

    doc.setFontSize(11);
    doc.text(`N° de factura: ${invoiceNumber}`, 60, 30);
    doc.text(`Fecha: ${fecha}`, 60, 37);

    // ================= DATOS DEL CLIENTE =================
    doc.setFontSize(13);
    doc.text("Datos del Cliente", 14, 60);

    doc.setFontSize(11);
    doc.text(`Nombre: ${nombre}`, 14, 68);

    // ================= TABLA DE PRODUCTOS =================
    const columns = ["Producto", "Cantidad", "Precio", "Subtotal"];

    const rows = items.map((item) => {
      const price = Number(item.precio);
      const subtotal = price * item.quantity;

      return [
        item.nombre,
        item.quantity,
        `S/ ${price.toFixed(2)}`,
        `S/ ${subtotal.toFixed(2)}`,
      ];
    });

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 80,
      styles: { fontSize: 10 },
      headStyles: {
        fillColor: [60, 60, 60],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 10, left: 14, right: 14 },
    });

    const finalY = doc.lastAutoTable.finalY;

    // ================= TOTAL =================
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total a pagar: S/ ${total.toFixed(2)}`, 14, finalY + 12);

    // ================= PIE =================
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Gracias por tu compra en Ludoteka.", 14, finalY + 20);
    doc.text("Factura generada automáticamente.", 14, finalY + 26);

    // ================= DESCARGAR SIEMPRE EL PDF =================
    doc.save(`${invoiceNumber}.pdf`);

    // ================= GUARDAR EN FIREBASE (best effort) =================
    try {
      const pdfBlob = doc.output("blob");
      const pdfRef = ref(storage, `invoices/${user.uid}/${invoiceNumber}.pdf`);

      await uploadBytes(pdfRef, pdfBlob);
      const url = await getDownloadURL(pdfRef);

      await addDoc(collection(db, "users", user.uid, "invoices"), {
        invoiceId: invoiceNumber,
        total,
        items,
        date: new Date().toISOString(),
        url,
      });

      console.log("Factura guardada en Storage + Firestore");
    } catch (err) {
      console.error("Error guardando factura en Firebase:", err);
      // Si falla, igual el usuario ya descargó su PDF
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-16 bg-white shadow-lg rounded-xl p-8 text-center space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">¡Pago exitoso! 🎉</h2>
      <p className="text-gray-600">
        Gracias por tu compra, <span className="font-semibold">{nombre}</span>.
      </p>
      <p className="text-gray-700">
        Monto total:{" "}
          <span className="font-bold text-brand-primary-600">
            S/ {total.toFixed(2)}
          </span>
      </p>

      {items.length > 0 && (
        <button
          onClick={handleDownloadInvoice}
          className="inline-flex justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
        >
          Descargar factura en PDF
        </button>
      )}

      <Link
        to="/"
        className="inline-flex justify-center mt-4 rounded-lg bg-brand-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-primary-700"
      >
        Volver a la tienda
      </Link>
    </div>
  );
};

export default CheckoutSuccess;
