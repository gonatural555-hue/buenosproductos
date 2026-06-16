"use client";

import { useState } from "react";
import SmartImage from "@/components/SmartImage";
import type { UISurface } from "@/lib/ui-surface";
import ProductImageLightbox from "@/components/pdp/ProductImageLightbox";

type Props = {
  images: string[];
  title: string;
  noImageLabel?: string;
  surface?: UISurface;
};

/**
 * Galería desktop estilo editorial: rejilla 2 columnas, varias imágenes visibles.
 */
export default function ProductGalleryGrid({
  images,
  title,
  noImageLabel = "Sin imagen",
  surface = "dark",
}: Props) {
  const L = surface === "light";
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <div
        className={
          L
            ? "flex min-h-[280px] items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-100 text-neutral-500"
            : "flex min-h-[280px] items-center justify-center rounded-2xl border border-white/10 bg-dark-surface/40 text-text-muted"
        }
      >
        {noImageLabel}
      </div>
    );
  }

  const cellBorder = L
    ? "border border-neutral-200/80 bg-neutral-100/90"
    : "border border-white/[0.09] bg-dark-surface/30";

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:gap-5 xl:gap-6">
        {images.map((src, index) => (
          <button
            key={`${src}-${index}`}
            type="button"
            onClick={() => setLightboxIndex(index)}
            className={[
              "group relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-lg text-left outline-none transition-[box-shadow] duration-200 focus-visible:ring-2 focus-visible:ring-accent-gold/60 focus-visible:ring-offset-2",
              L
                ? "focus-visible:ring-offset-neutral-100"
                : "focus-visible:ring-offset-dark-base",
              cellBorder,
            ].join(" ")}
            aria-label={`${title} — ${index + 1}, ampliar`}
          >
            <span className="relative block h-full w-full p-3 sm:p-4 xl:p-5">
              <span className="relative block h-full w-full overflow-hidden rounded-md">
                <SmartImage
                  src={src}
                  alt=""
                  fill
                  priority={index < 2}
                  loading={index < 4 ? "eager" : "lazy"}
                  sizes="(min-width: 1280px) 28vw, (min-width: 1024px) 32vw, 100vw"
                  className="object-contain object-center transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.025] motion-reduce:transition-none"
                />
              </span>
            </span>
          </button>
        ))}
      </div>
      {lightboxIndex !== null && (
        <ProductImageLightbox
          open
          onClose={() => setLightboxIndex(null)}
          images={images}
          initialIndex={lightboxIndex}
          title={title}
        />
      )}
    </>
  );
}
