"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import ProductImageLightbox from "@/components/pdp/ProductImageLightbox";
import { PRODUCT_BLUR_DATA_URL } from "@/lib/image-src";
import type { UISurface } from "@/lib/ui-surface";

type Props = {
  featured: string | null;
  gallery: string[];
  title: string;
  noImageLabel?: string;
  featuredContainerClassName?: string;
  featuredImageClassName?: string;
  surface?: UISurface;
  /**
   * Stage más ancho y ratio horizontal (16:10), sin tope 520px en lg;
   * para productos en `PDP_HERO_WIDE_PRODUCT_IDS`.
   */
  heroWide?: boolean;
  /** Menos margen bajo el stage y las miniaturas (PDP con vídeo justo debajo). */
  compactVerticalSpacing?: boolean;
};

export default function ProductImageGallery({
  featured,
  gallery,
  title,
  noImageLabel = "No image",
  featuredContainerClassName,
  featuredImageClassName,
  surface = "dark",
  heroWide = false,
  compactVerticalSpacing = false,
}: Props) {
  const light = surface === "light";
  const heroMb =
    compactVerticalSpacing && heroWide ? "mb-2" : "mb-4";
  const allImages = useMemo(() => {
    return featured
      ? [featured, ...gallery.filter((img) => img !== featured)]
      : gallery;
  }, [featured, gallery]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const startXRef = useRef(0);

  useEffect(() => {
    setCurrentIndex(0);
    setDragOffset(0);
    setIsDragging(false);
  }, [featured, gallery]);

  const selectedImage = allImages[currentIndex] || "";
  const canSwipe = allImages.length > 1;
  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!canSwipe) return;
    setIsDragging(true);
    startXRef.current = event.touches[0]?.clientX ?? 0;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !canSwipe) return;
    const currentX = event.touches[0]?.clientX ?? 0;
    setDragOffset(currentX - startXRef.current);
  };

  const handleTouchEnd = () => {
    if (!isDragging || !canSwipe) return;
    const threshold = 60;
    const delta = dragOffset;
    setIsDragging(false);
    setDragOffset(0);

    if (delta <= -threshold && currentIndex < allImages.length - 1) {
      setCurrentIndex(currentIndex + 1);
      return;
    }
    if (delta >= threshold && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (allImages.length === 0) {
    return (
      <div
        className={
          heroWide
            ? light
              ? "aspect-[16/10] max-h-[min(560px,72vh)] bg-neutral-100 rounded-2xl overflow-hidden flex items-center justify-center border border-neutral-200"
              : "aspect-[16/10] max-h-[min(560px,72vh)] bg-dark-surface rounded-2xl overflow-hidden flex items-center justify-center border border-white/10"
            : light
              ? "aspect-square bg-neutral-100 rounded-2xl overflow-hidden flex items-center justify-center border border-neutral-200"
              : "aspect-square bg-dark-surface rounded-2xl overflow-hidden flex items-center justify-center border border-white/10"
        }
      >
        <span className={light ? "text-neutral-500" : "text-text-muted"}>
          {noImageLabel}
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-x-hidden">
      {/* Featured / Main Image */}
      <div
        className={[
          heroWide
            ? light
              ? `relative w-full max-w-full aspect-[16/10] max-h-[min(560px,72vh)] bg-neutral-100 rounded-2xl overflow-hidden ${heroMb} border border-neutral-200`
              : `relative w-full max-w-full aspect-[16/10] max-h-[min(560px,72vh)] bg-dark-surface rounded-2xl overflow-hidden ${heroMb} border border-white/10`
            : light
              ? `relative w-full max-w-full aspect-square bg-neutral-100 rounded-2xl overflow-hidden ${heroMb} border border-neutral-200`
              : `relative w-full max-w-full aspect-square bg-dark-surface rounded-2xl overflow-hidden ${heroMb} border border-white/10`,
          heroWide
            ? "mx-auto w-full max-w-full md:mx-0 lg:mx-0 lg:max-w-full"
            : "mx-auto max-w-[80vw] max-h-[80vw] md:mx-0 md:max-w-none md:max-h-none lg:mx-auto lg:max-w-[520px] lg:max-h-[520px]",
          featuredContainerClassName,
        ]
          .filter(Boolean)
          .join(" ")}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        {heroWide && allImages.length > 0 && (
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className={
              light
                ? "absolute right-3 top-3 z-10 rounded-full border border-neutral-200/90 bg-white/90 p-2.5 text-neutral-700 shadow-sm backdrop-blur-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/70"
                : "absolute right-3 top-3 z-10 rounded-full border border-white/15 bg-black/45 p-2.5 text-white/95 shadow-sm backdrop-blur-sm transition hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/70"
            }
            aria-label={`${title} — ampliar imagen`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.6}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          </button>
        )}
        <div
          className={[
            "flex h-full w-full",
            isDragging ? "" : "transition-transform duration-300 ease-out",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{
            transform: `translateX(calc(${-currentIndex * 100}% + ${dragOffset}px))`,
          }}
        >
          {allImages.map((img, index) => (
            <div key={img} className="relative h-full w-full flex-shrink-0">
              <Image
                src={img}
                alt={`${title} - Vista ${index + 1}`}
                fill
                priority={index === 0}
                loading={index === currentIndex ? "eager" : "lazy"}
                placeholder="blur"
                blurDataURL={PRODUCT_BLUR_DATA_URL}
                className={[
                  "object-contain w-full h-full",
                  featuredImageClassName,
                ]
                  .filter(Boolean)
                  .join(" ")}
                sizes={
                  heroWide
                    ? "(max-width: 1024px) 100vw, 55vw"
                    : "(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 60vw"
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* Gallery Thumbnails */}
      {allImages.length > 1 && (
        <div
          className={
            compactVerticalSpacing && heroWide
              ? "flex gap-3 max-w-full overflow-x-auto pb-0.5 scrollbar-rail-premium md:justify-center"
              : "flex gap-3 max-w-full overflow-x-auto pb-2 scrollbar-rail-premium md:justify-center"
          }
        >
          {allImages.map((img, index) => (
            <button
              key={img}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl border overflow-hidden transition-all duration-200 ease-out hover:-translate-y-0.5 ${
                selectedImage === img
                  ? "border-accent-gold ring-1 ring-accent-gold/60"
                  : light
                    ? "border-neutral-200 hover:border-neutral-400"
                    : "border-white/15 hover:border-white/30"
              }`}
            >
              <Image
                src={img}
                alt={`${title} - Vista ${index + 1}`}
                width={80}
                height={80}
                loading="lazy"
                placeholder="blur"
                blurDataURL={PRODUCT_BLUR_DATA_URL}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {heroWide && allImages.length > 0 && (
        <ProductImageLightbox
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          images={allImages}
          initialIndex={currentIndex}
          title={title}
        />
      )}
    </div>
  );
}

