"use client";

import { useState } from "react";
import SmartImage from "@/components/SmartImage";
import ProductImageLightbox from "@/components/pdp/ProductImageLightbox";

type Props = {
  images: string[];
  title: string;
  noImageLabel?: string;
};

export default function GoodIdeasPdpGallery({
  images,
  title,
  noImageLabel = "Sin imagen",
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-2xl bg-[#151B24]/60 font-body text-sm text-[var(--gi-text-muted-on-dark)] lg:min-h-[480px]">
        {noImageLabel}
      </div>
    );
  }

  const activeSrc = images[activeIndex] ?? images[0]!;

  return (
    <>
      <div className="flex gap-4 lg:gap-5">
        {images.length > 1 ? (
          <div
            className="hidden shrink-0 flex-col gap-3 sm:flex"
            role="tablist"
            aria-label={title}
          >
            {images.map((src, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={`${src}-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`${title} — ${index + 1}`}
                  onClick={() => setActiveIndex(index)}
                  className={[
                    "relative h-[72px] w-[72px] overflow-hidden rounded-xl border bg-[#151B24]/80 p-1.5 transition-colors",
                    isActive
                      ? "border-[var(--gi-primary)] ring-1 ring-[var(--gi-primary)]/30"
                      : "border-white/[0.1] hover:border-white/25",
                  ].join(" ")}
                >
                  <SmartImage
                    src={src}
                    alt=""
                    fill
                    sizes="72px"
                    className="object-contain"
                  />
                </button>
              );
            })}
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setLightboxIndex(activeIndex)}
          className="group relative min-h-[320px] w-full flex-1 cursor-zoom-in overflow-hidden rounded-2xl border border-white/[0.08] bg-[#151B24]/50 p-4 outline-none focus-visible:ring-2 focus-visible:ring-[var(--gi-primary)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F14] sm:min-h-[400px] lg:min-h-[520px] xl:min-h-[600px]"
          aria-label={`${title} — ampliar`}
        >
          <SmartImage
            src={activeSrc}
            alt={title}
            fill
            priority
            sizes="(min-width: 1280px) 42vw, (min-width: 1024px) 45vw, 100vw"
            className="object-contain transition-transform duration-300 ease-out group-hover:scale-[1.01] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </button>
      </div>

      {images.length > 1 ? (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 sm:hidden">
          {images.map((src, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={`m-${src}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={[
                  "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-[#151B24]/80 p-1",
                  isActive
                    ? "border-[var(--gi-primary)]"
                    : "border-white/[0.1]",
                ].join(" ")}
              >
                <SmartImage src={src} alt="" fill sizes="64px" className="object-contain" />
              </button>
            );
          })}
        </div>
      ) : null}

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
