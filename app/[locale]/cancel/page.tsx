"use client";

import Link from "next/link";

export default function CancelPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <div className="text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        <h1 className="font-sans text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Pago cancelado
        </h1>

        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Tu pago fue cancelado. No se realizó ningún cargo. Podés volver a
          intentar cuando estés listo.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/checkout"
            className="inline-flex justify-center rounded-md bg-black px-8 py-4 text-base font-medium text-white hover:bg-gray-900 transition"
          >
            Intentar nuevamente
          </Link>
          <Link
            href="/cart"
            className="inline-flex justify-center rounded-md border border-gray-300 px-8 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Volver al carrito
          </Link>
        </div>
      </div>
    </main>
  );
}






