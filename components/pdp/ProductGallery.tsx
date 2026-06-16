"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SmartImage from "@/components/SmartImage";
import ProductImageLightbox from "@/components/pdp/ProductImageLightbox";
import type { UISurface } from "@/lib/ui-surface";

type AspectMode = "square" | "cinematic";

type Props = {
  images: string[];
  title: string;
  noImageLabel?: string;
  surface?: UISurface;
  /** Productos con franja más ancha (gafas, etc.) */
  aspectMode?: AspectMode;
  /** Fotos 1:1 → `contain` evita recorte; `cover` solo si hiciera falta llenar el marco */
  imageFit?: "cover" | "contain";
};

/**
 * Galería PDP: miniaturas + imagen principal con marco estable (aspect-ratio).
 * - Móvil: ancho máximo razonable; desktop (`lg+`): el hero usa todo el ancho de la columna (`max-w-none`).
 * - `fill` solo dentro de un contenedor `relative` con altura definida por aspect-ratio.
 */
export default function ProductGallery({
  images,
  title,
  noImageLabel = "Sin imagen",
  surface = "dark",
  aspectMode = "square",
  imageFit = "contain",
}: Props) {
  const light = surface === "light";
  const list = useMemo(() => images.filter(Boolean), [images]);

  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [mainError, setMainError] = useState(false);
  const startXRef = useRef(0);

  useEffect(() => {
    setIndex(0);
    setDragOffset(0);
    setIsDragging(false);
    setMainError(false);
  }, [list]);

  const safeIndex = Math.min(index, Math.max(0, list.length - 1));
  const canSwipe = list.length > 1;
  const currentSrc = list[safeIndex] ?? list[0] ?? "";

  useEffect(() => {
    setMainError(false);
  }, [safeIndex, currentSrc]);

  const go = useCallback(
    (next: number) => {
      if (list.length === 0) return;
      setIndex((i) => Math.min(Math.max(0, next), list.length - 1));
    },
    [list.length]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!canSwipe) return;
    setIsDragging(true);
    startXRef.current = e.touches[0]?.clientX ?? 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !canSwipe) return;
    const x = e.touches[0]?.clientX ?? 0;
    setDragOffset(x - startXRef.current);
  };

  const handleTouchEnd = () => {
    if (!isDragging || !canSwipe) return;
    const threshold = 50;
    const d = dragOffset;
    setIsDragging(false);
    setDragOffset(0);
    if (d <= -threshold) go(safeIndex + 1);
    else if (d >= threshold) go(safeIndex - 1);
  };

  /** Contenedor principal: móvil fondo oscuro (sin bandas blancas); desktop marco editorial. */
  const stageShell = light
    ? "rounded-xl border border-neutral-800/70 bg-black shadow-[0_10px_32px_-18px_rgba(0,0,0,0.28)] ring-1 ring-black/[0.2] max-lg:border-neutral-800/80 lg:rounded-2xl lg:border-neutral-200/70 lg:bg-neutral-100/95 lg:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.1)] lg:ring-black/[0.04]"
    : "rounded-xl border border-white/[0.1] bg-[#0a0a0a] shadow-[0_14px_40px_-22px_rgba(0,0,0,0.5)] ring-1 ring-white/[0.07] max-lg:bg-black lg:rounded-2xl lg:border-white/[0.12] lg:bg-dark-surface/72 lg:bg-[linear-gradient(168deg,rgba(255,255,255,0.07)_0%,rgba(18,24,22,0.96)_42%,#0b0f0e_100%)] lg:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_22px_56px_-30px_rgba(0,0,0,0.58)] lg:ring-white/[0.09]";

  /** Móvil: ancho completo del contenedor; desktop sin tope artificial. */
  const squareMobileWidthCap =
    light && aspectMode === "square"
      ? "w-full max-w-none lg:max-w-none"
      : "w-full max-w-none lg:max-w-[min(100%,560px)]";

  /**
   * Móvil: sin aspect-ratio fijo — la imagen define altura (sin bandas laterales).
   * Desktop: marco square / cinematic estable.
   */
  const stageFrameClass =
    aspectMode === "cinematic"
      ? `relative w-full max-w-none overflow-hidden ${stageShell} max-lg:aspect-auto max-lg:max-h-none aspect-[16/10] max-h-[min(380px,62vh)] sm:max-h-[min(420px,68vh)] lg:max-w-[min(100%,560px)] lg:max-h-[min(520px,82vh)] xl:max-h-[min(560px,85vh)]`
      : `relative w-full ${squareMobileWidthCap} overflow-hidden ${stageShell} max-lg:aspect-auto aspect-square lg:max-w-none`;

  const imgObject =
    imageFit === "contain"
      ? "object-contain object-center"
      : "object-cover object-center";

  const imgMotion =
    imageFit === "contain"
      ? "transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:group-hover:scale-100"
      : "transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:group-hover:scale-100";

  if (list.length === 0) {
    return (
      <div
        className={`flex min-h-[280px] w-full max-w-[560px] items-center justify-center rounded-xl border border-dashed lg:max-w-none ${
          light
            ? "border-neutral-300 bg-neutral-100 text-neutral-500"
            : "border-white/15 bg-dark-surface/40 text-text-muted"
        }`}
      >
        <span>{noImageLabel}</span>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-full flex-col gap-3 sm:gap-4 lg:w-full lg:flex-row lg:items-start lg:gap-7 xl:gap-8">
      {/* Miniaturas: debajo en móvil; desktop: columna más ancha + hit area claro */}
      {list.length > 1 ? (
        <div
          className={
            "order-2 -mx-1 flex shrink-0 gap-2.5 overflow-x-auto overflow-y-hidden px-1 pb-1 scrollbar-rail-premium sm:mx-0 sm:gap-3 lg:order-1 lg:mx-0 lg:w-[4.75rem] lg:flex-col lg:gap-3 lg:overflow-y-auto lg:overflow-x-hidden lg:px-0 lg:pb-0 " +
            "lg:max-h-[min(720px,88vh)] xl:w-20"
          }
          aria-label="Miniaturas"
        >
          {list.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${title} — ${i + 1} / ${list.length}`}
              aria-current={i === safeIndex ? "true" : undefined}
              className={[
                "relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-lg border transition-all duration-200 ease-out sm:h-20 sm:w-20",
                "lg:h-[4.75rem] lg:w-[4.75rem] lg:rounded-xl xl:h-20 xl:w-20",
                i === safeIndex
                  ? "border-accent-gold ring-2 ring-accent-gold/45 scale-[1.03] z-[1] lg:ring-[3px] lg:ring-accent-gold/50 lg:shadow-[0_0_28px_-6px_rgba(212,175,55,0.45)]"
                  : light
                    ? "border-neutral-200 hover:border-neutral-400 hover:scale-[1.02] lg:hover:border-neutral-500"
                    : "border-white/15 hover:border-white/40 hover:scale-[1.02] lg:border-white/18 lg:hover:border-white/45 lg:hover:shadow-[0_0_20px_-8px_rgba(255,255,255,0.12)]",
              ].join(" ")}
            >
              <SmartImage
                src={src}
                alt=""
                width={64}
                height={64}
                loading={i < 4 ? "eager" : "lazy"}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}

      {/* Columna principal: ocupa el resto del ancho en la fila; en desktop sin max-width que encoja el hero */}
      <div className="order-1 flex min-h-0 w-full min-w-0 flex-1 flex-col items-stretch lg:order-2 lg:max-w-none">
        <div
          className={`group mx-auto w-full max-w-full lg:mx-0 ${stageFrameClass}`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          {/* Fondo + viñeta: móvil plano negro; desktop editorial */}
          <div
            className={
              light
                ? "pointer-events-none absolute inset-0 bg-black max-lg:bg-black lg:bg-neutral-100"
                : "pointer-events-none absolute inset-0 bg-black max-lg:bg-black lg:bg-dark-surface/35"
            }
            aria-hidden
          />
          {!light ? (
            <div
              className="pointer-events-none absolute inset-0 z-[1] hidden bg-[radial-gradient(ellipse_85%_70%_at_50%_42%,rgba(255,255,255,0.07)_0%,transparent_58%)] opacity-90 lg:block lg:opacity-100"
              aria-hidden
            />
          ) : (
            <div
              className="pointer-events-none absolute inset-0 z-[1] hidden bg-[radial-gradient(ellipse_80%_65%_at_50%_45%,rgba(255,255,255,0.35)_0%,transparent_55%)] opacity-70 lg:block"
              aria-hidden
            />
          )}

          {mainError || !currentSrc ? (
            <div
              className={
                "absolute inset-0 z-[2] flex items-center justify-center px-4 text-center text-sm " +
                (light ? "text-neutral-500" : "text-text-muted")
              }
            >
              {noImageLabel}
            </div>
          ) : (
            <>
              {/* Móvil: ancho completo, altura intrínseca — imagen completa sin bandas */}
              <div
                key={`${currentSrc}-${safeIndex}-mobile`}
                className="animate-fade-in relative z-[2] w-full lg:hidden"
              >
                <SmartImage
                  src={currentSrc}
                  alt={`${title} — ${safeIndex + 1}`}
                  width={1400}
                  height={1400}
                  priority={safeIndex === 0}
                  loading={safeIndex === 0 ? "eager" : "lazy"}
                  sizes="100vw"
                  onError={() => setMainError(true)}
                  className="block h-auto w-full object-contain object-center"
                />
              </div>
              {/* Desktop: marco fijo con fill */}
              <div
                key={`${currentSrc}-${safeIndex}-desktop`}
                className="animate-fade-in absolute inset-0 z-[2] hidden p-1.5 lg:block xl:p-2"
              >
                <SmartImage
                  src={currentSrc}
                  alt={`${title} — ${safeIndex + 1}`}
                  fill
                  priority={safeIndex === 0}
                  loading={safeIndex === 0 ? "eager" : "lazy"}
                  sizes="min(960px, 58vw)"
                  onError={() => setMainError(true)}
                  className={`${imgObject} ${imgMotion}`}
                />
              </div>
            </>
          )}

          <button
            type="button"
            className="absolute inset-0 z-[5] m-0 cursor-zoom-in border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-gold/70"
            onClick={() => setLightboxOpen(true)}
            aria-label={`${title} — ampliar galería`}
          />

          <div
            className={
              light
                ? "pointer-events-none absolute right-3 top-3 z-20 rounded-full border border-neutral-200/80 bg-white/92 px-2.5 py-1 text-[11px] font-medium tabular-nums tracking-wide text-neutral-800 backdrop-blur-sm lg:right-4 lg:top-4"
                : "pointer-events-none absolute right-3 top-3 z-20 rounded-full border border-white/12 bg-black/50 px-2.5 py-1 text-[11px] font-medium tabular-nums tracking-wide text-white/92 backdrop-blur-md lg:right-4 lg:top-4"
            }
          >
            {String(safeIndex + 1).padStart(2, "0")} /{" "}
            {String(list.length).padStart(2, "0")}
          </div>

          <div className="absolute left-3 top-3 z-20 lg:left-auto lg:right-4 lg:top-auto lg:bottom-4">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxOpen(true);
              }}
              className={
                light
                  ? "rounded-full border border-neutral-200/90 bg-white/92 p-2 text-neutral-700 shadow-sm backdrop-blur-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/70 lg:p-2.5"
                  : "rounded-full border border-white/16 bg-black/55 p-2 text-white/95 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.5)] backdrop-blur-md transition hover:border-white/25 hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/70 lg:p-2.5"
              }
              aria-label={`${title} — pantalla completa`}
            >
              <svg
                className="h-4 w-4 lg:h-[1.05rem] lg:w-[1.05rem]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.6}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <ProductImageLightbox
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={list}
        initialIndex={safeIndex}
        title={title}
      />
    </div>
  );
}
