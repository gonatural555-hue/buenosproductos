"use client";

import { useState } from "react";
import SmartImage from "@/components/SmartImage";
import type { UISurface } from "@/lib/ui-surface";
import ProductImageLightbox from "@/components/pdp/ProductImageLightbox";
import {
  framingToImageStyle,
  resolvePdpImageFraming,
  type PdpGalleryLayout,
} from "@/lib/pdp-gallery-framing";

type Props = {
  images: string[];
  title: string;
  noImageLabel?: string;
  surface?: UISurface;
  galleryLayout?: PdpGalleryLayout | null;
  debugHighlightIndex?: number | null;
};

/** Ancho fijo de la columna de galería en desktop (REI-style). */
export const PDP_GALLERY_WIDTH_PX = 1000;

/** Desplazamiento horizontal del bloque galería en desktop (px). */
export const PDP_GALLERY_OFFSET_X_PX = 170;

const REI_GAP = "gap-4 sm:gap-5";
const GALLERY_SHELL =
  "w-full max-w-[1000px] lg:w-[1000px] lg:-translate-x-[170px]";

export default function ProductGalleryRei({
  images,
  title,
  noImageLabel = "Sin imagen",
  surface = "light",
  galleryLayout = null,
  debugHighlightIndex = null,
}: Props) {
  const L = surface === "light";
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <div
        className={
          L
            ? "flex min-h-[320px] items-center justify-center text-neutral-500"
            : "flex min-h-[320px] items-center justify-center text-text-muted"
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

    return (
      <button
        key={`${src}-${index}`}
        type="button"
        onClick={() => setLightboxIndex(index)}
        className={[
          "group relative w-full cursor-zoom-in overflow-hidden bg-transparent text-left outline-none",
          "focus-visible:ring-2 focus-visible:ring-gn-forest/50 focus-visible:ring-offset-2",
          L ? "focus-visible:ring-offset-gn-page-bg" : "focus-visible:ring-offset-dark-base",
          highlighted ? "ring-2 ring-[#D9A441] ring-offset-2 ring-offset-[rgba(18,22,26,0.9)]" : "",
        ].join(" ")}
        aria-label={`${title} — ${index + 1}, ampliar`}
      >
        <span className="relative block aspect-square w-full">
          <SmartImage
            src={src}
            alt={alt}
            fill
            priority={priority}
            loading={loading}
            sizes={
              variant === "hero"
                ? `(min-width: 1024px) ${PDP_GALLERY_WIDTH_PX}px, 100vw`
                : `(min-width: 1024px) ${PDP_GALLERY_WIDTH_PX / 2}px, 50vw`
            }
            className="object-contain motion-reduce:transition-none"
            style={imageStyle}
          />
        </span>
      </button>
    );
  };

  return (
    <>
      <div className={`flex flex-col ${REI_GAP} ${GALLERY_SHELL}`}>
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
