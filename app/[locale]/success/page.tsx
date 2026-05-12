"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useCart } from "@/context/CartContext";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Limpiar el carrito después de una compra exitosa
    if (sessionId) {
      clearCart();
    }
  }, [sessionId, clearCart]);

  if (!mounted) {
    return null;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <div className="text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="font-sans text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          ¡Pago exitoso!
        </h1>

        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Gracias por tu compra. Tu pedido ha sido procesado correctamente y
          recibirás un email de confirmación en breve.
        </p>

        {sessionId && (
          <p className="text-sm text-gray-500 mb-8">
            ID de sesión: {sessionId}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="inline-flex justify-center rounded-md bg-black px-8 py-4 text-base font-medium text-white hover:bg-gray-900 transition"
          >
            Seguir comprando
          </Link>
          <Link
            href="/"
            className="inline-flex justify-center rounded-md border border-gray-300 px-8 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
          <div className="text-center">
            <p className="text-gray-600">Cargando...</p>
          </div>
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}

