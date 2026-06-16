"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import SmartImage from "@/components/SmartImage";

type Props = {
  open: boolean;
  onClose: () => void;
  images: string[];
  initialIndex: number;
  title: string;
};

/**
 * Visor fullscreen tipo editorial: overlay oscuro, flechas, puntos, slide suave.
 * Solo debe montarse en cliente (portal a document.body).
 */
export default function ProductImageLightbox({
  open,
  onClose,
  images,
  initialIndex,
  title,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setIndex(Math.min(Math.max(0, initialIndex), Math.max(0, images.length - 1)));
    }
  }, [open, initialIndex, images.length]);

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => {
        const n = images.length;
        if (n <= 0) return 0;
        return (i + delta + n) % n;
      });
    },
    [images.length]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      }
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, go]);

  if (!mounted || !open || images.length === 0) return null;

  const content = (
    <div
      className="fixed inset-0 z-[200] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-black/93 backdrop-blur-md"
        onClick={onClose}
        aria-hidden
      />
      <div className="pointer-events-none relative z-10 flex min-h-0 w-full flex-1 flex-col items-center justify-center pt-14 pb-6">
      <button
        type="button"
        className="pointer-events-auto absolute right-4 top-4 z-20 rounded-full p-2.5 text-white/90 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/70"
        onClick={onClose}
        aria-label="Cerrar"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
        <div className="pointer-events-auto relative w-full flex-1 overflow-hidden">
          <div
            className="flex h-full transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] motion-reduce:transition-none"
            style={{ transform: `translateX(-${index * 100}vw)` }}
          >
            {images.map((src, i) => (
              <div
                key={`lb-${i}-${src}`}
                className="relative flex h-full w-screen max-w-[100vw] flex-shrink-0 items-center justify-center px-3 sm:px-8"
              >
                <div className="relative mx-auto h-[min(78vh,900px)] w-full max-w-5xl">
                  <SmartImage
                    src={src}
                    alt={`${title} — ${i + 1} / ${images.length}`}
                    fill
                    priority={i === index}
                    className="object-contain"
                    sizes="100vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              className="pointer-events-auto absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-black/40 p-3 text-white/95 backdrop-blur-sm transition hover:bg-black/55 hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/60 sm:left-4"
              onClick={() => go(-1)}
              aria-label="Imagen anterior"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              className="pointer-events-auto absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-black/40 p-3 text-white/95 backdrop-blur-sm transition hover:bg-black/55 hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/60 sm:right-4"
              onClick={() => go(1)}
              aria-label="Imagen siguiente"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {images.length > 1 && (
          <div className="pointer-events-auto mt-4 flex shrink-0 items-center justify-center gap-2 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            {images.map((_, i) => (
              <button
                key={`dot-${i}`}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-6 bg-accent-gold"
                    : "w-2 bg-white/35 hover:bg-white/55"
                }`}
                aria-label={`Imagen ${i + 1} de ${images.length}`}
                aria-current={i === index ? "true" : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
