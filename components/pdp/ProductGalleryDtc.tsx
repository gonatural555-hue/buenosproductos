"use client";

import { useState } from "react";
import SmartImage from "@/components/SmartImage";
import ProductImageLightbox from "@/components/pdp/ProductImageLightbox";

type Props = {
  images: string[];
  title: string;
  noImageLabel?: string;
};

/** Galería PDP estilo DTC: imagen principal + miniaturas horizontales. */
export default function ProductGalleryDtc({
  images,
  title,
  noImageLabel = "Sin imagen",
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <div className="flex min-h-[320px] items-center justify-center bg-white text-[#6B7280]">
        {noImageLabel}
      </div>
    );
  }

  const activeSrc = images[activeIndex] ?? images[0]!;

  return (
    <>
      <div className="flex flex-col gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => setLightboxIndex(activeIndex)}
          className="relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-sm bg-white outline-none focus-visible:ring-2 focus-visible:ring-[#111111]/20 focus-visible:ring-offset-2"
          aria-label={`${title} — ampliar`}
        >
          <SmartImage
            src={activeSrc}
            alt={title}
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-contain p-4 sm:p-6"
          />
        </button>

        {images.length > 1 ? (
          <div
            className="flex gap-2 overflow-x-auto pb-1 scrollbar-rail-premium"
            role="list"
            aria-label="Miniaturas del producto"
          >
            {images.map((src, index) => {
              const selected = index === activeIndex;
              return (
                <button
                  key={`${src}-${index}`}
                  type="button"
                  role="listitem"
                  onClick={() => setActiveIndex(index)}
                  className={[
                    "relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-sm border bg-white transition-colors sm:h-20 sm:w-20",
                    selected
                      ? "border-[#111111] ring-1 ring-[#111111]"
                      : "border-[#E5E7EB] hover:border-[#9CA3AF]",
                  ].join(" ")}
                  aria-label={`Imagen ${index + 1}`}
                  aria-current={selected ? "true" : undefined}
                >
                  <SmartImage
                    src={src}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-contain p-1.5"
                    loading={index < 4 ? "eager" : "lazy"}
                  />
                </button>
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
