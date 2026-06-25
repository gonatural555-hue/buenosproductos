"use client";

import { useState } from "react";
import SmartImage from "@/components/SmartImage";
import type { UISurface } from "@/lib/ui-surface";
import ProductImageLightbox from "@/components/pdp/ProductImageLightbox";
import {
  framingToImageStyle,
  resolvePdpGalleryColumns,
  resolvePdpImageFraming,
  type PdpGalleryLayout,
} from "@/lib/pdp-gallery-framing";

type Props = {
  images: string[];
  title: string;
  noImageLabel?: string;
  surface?: UISurface;
  galleryLayout?: PdpGalleryLayout | null;
  /** Override de columnas: 1 = hero + rejilla; 2 = rejilla uniforme 2 cols. */
  columns?: 1 | 2;
  /** Ancho fijo desktop (px). Go Natural: 998. Good Products: fluido. */
  galleryWidthPx?: number | null;
  debugHighlightIndex?: number | null;
};

/** Ancho fijo de la columna de galería en desktop (Go Natural). */
export const PDP_GALLERY_WIDTH_PX = 998;

/** Desplazamiento horizontal del bloque galería en desktop (px). */
export const PDP_GALLERY_OFFSET_X_PX = 170;

const REI_GAP = "gap-4 sm:gap-5";
/** Clases estáticas para que Tailwind las incluya en el build. */
const GALLERY_SHELL_FIXED =
  "w-full max-w-[998px] lg:w-[998px] lg:-translate-x-[170px]";
const GALLERY_SHELL_FLUID = "w-full";

export default function ProductGalleryRei({
  images,
  title,
  noImageLabel = "Sin imagen",
  surface = "light",
  galleryLayout = null,
  columns: columnsProp,
  galleryWidthPx = null,
  debugHighlightIndex = null,
}: Props) {
  const L = surface === "light";
  const columns = resolvePdpGalleryColumns(galleryLayout, columnsProp ?? 2);
  const twoColumnGrid = columns === 2;
  const fixedWidth = galleryWidthPx ?? null;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <div
        className={
          L
            ? "flex min-h-[320px] items-center justify-center text-neutral-500"
            : "flex min-h-[320px] items-center justify-center text-[rgba(232,236,241,0.72)]"
        }
      >
        {noImageLabel}
      </div>
    );
  }

  const [hero, ...rest] = images;

  const renderImageCell = (
    src: string,
    index: number,
    variant: "hero" | "grid",
    alt: string,
    priority?: boolean,
    loading?: "eager" | "lazy"
  ) => {
    const framing = resolvePdpImageFraming(galleryLayout, index);
    const imageStyle = framingToImageStyle(framing);
    const highlighted = debugHighlightIndex === index;

    const focusRing = L
      ? "focus-visible:ring-gn-forest/50 focus-visible:ring-offset-gn-page-bg"
      : "focus-visible:ring-[#3B82F6]/50 focus-visible:ring-offset-[#0B0F14]";

    const cellFrame = twoColumnGrid
      ? L
        ? "rounded-lg border border-neutral-200/80 bg-neutral-50/90"
        : "rounded-lg border border-white/[0.08] bg-[#151B24]/50"
      : "";

    return (
      <button
        key={`${src}-${index}`}
        type="button"
        onClick={() => setLightboxIndex(index)}
        className={[
          "group relative w-full cursor-zoom-in overflow-hidden text-left outline-none",
          twoColumnGrid ? cellFrame : "bg-transparent",
          "focus-visible:ring-2 focus-visible:ring-offset-2",
          focusRing,
          highlighted
            ? "ring-2 ring-[#D9A441] ring-offset-2 ring-offset-[rgba(18,22,26,0.9)]"
            : "",
        ].join(" ")}
        aria-label={`${title} — ${index + 1}, ampliar`}
      >
        <span
          className={[
            "relative block aspect-square w-full",
            twoColumnGrid ? "p-3 sm:p-4" : "",
          ].join(" ")}
        >
          <SmartImage
            src={src}
            alt={alt}
            fill
            priority={priority}
            loading={loading}
            sizes={
              variant === "hero"
                ? `(min-width: 1024px) ${PDP_GALLERY_WIDTH_PX}px, 100vw`
                : twoColumnGrid && fixedWidth
                  ? `(min-width: 1024px) ${fixedWidth / 2}px, 50vw`
                  : twoColumnGrid
                    ? "(min-width: 1024px) 28vw, 50vw"
                    : `(min-width: 1024px) ${PDP_GALLERY_WIDTH_PX / 2}px, 50vw`
            }
            className="object-contain motion-reduce:transition-none"
            style={imageStyle}
          />
        </span>
      </button>
    );
  };

  const shellClass = twoColumnGrid
    ? fixedWidth
      ? GALLERY_SHELL_FIXED
      : GALLERY_SHELL_FLUID
    : GALLERY_SHELL_FIXED;

  return (
    <>
      <div
        className={[
          twoColumnGrid ? `grid grid-cols-2 ${REI_GAP}` : `flex flex-col ${REI_GAP}`,
          shellClass,
        ].join(" ")}
      >
        {twoColumnGrid
          ? images.map((src, index) =>
              renderImageCell(
                src,
                index,
                "grid",
                index === 0 ? title : "",
                index < 2,
                index < 4 ? "eager" : "lazy"
              )
            )
          : (
            <>
              {renderImageCell(hero, 0, "hero", title, true, "eager")}
              {rest.length > 0 ? (
                <div className={`grid grid-cols-2 ${REI_GAP}`}>
                  {rest.map((src, index) => {
                    const globalIndex = index + 1;
                    return renderImageCell(
                      src,
                      globalIndex,
                      "grid",
                      "",
                      globalIndex < 3,
                      globalIndex < 4 ? "eager" : "lazy"
                    );
                  })}
                </div>
              ) : null}
            </>
          )}
      </div>

      {lightboxIndex !== null ? (
        <ProductImageLightbox
          open
          onClose={() => setLightboxIndex(null)}
          images={images}
          initialIndex={lightboxIndex}
          title={title}
        />
      ) : null}
    </>
  );
}
