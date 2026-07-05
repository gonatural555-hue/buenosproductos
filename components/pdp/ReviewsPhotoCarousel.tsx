"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ReviewPhotoCard from "@/components/pdp/ReviewPhotoCard";
import { useTranslations } from "@/components/i18n/LocaleProvider";
import { isValidImageSrc } from "@/lib/image-src";
import type { ProductReviewRow } from "@/lib/pdp-supabase-types";

type Props = {
  reviews: ProductReviewRow[];
  verifiedLabel: string;
  anonymousLabel: string;
  locale: string;
  surface?: "dark" | "light";
};

function reviewHasPhotos(review: ProductReviewRow): boolean {
  return (review.images ?? []).some(isValidImageSrc);
}

function CarouselArrow({
  direction,
  onClick,
  label,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#111111] shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-colors hover:border-[#9CA3AF] hover:bg-[#FAFAFA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/30 focus-visible:ring-offset-2 motion-reduce:transition-none"
    >
      <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        className="h-4 w-4"
        aria-hidden
      >
        {direction === "prev" ? (
          <path d="M12.5 15 7.5 10l5-5" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M7.5 15 12.5 10l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}

export default function ReviewsPhotoCarousel({
  reviews,
  verifiedLabel,
  anonymousLabel,
  locale,
  surface = "light",
}: Props) {
  const t = useTranslations();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const photoReviews = reviews.filter(reviewHasPhotos);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollPrev(el.scrollLeft > 8);
    setCanScrollNext(el.scrollLeft < maxScroll - 8);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    return () => observer.disconnect();
  }, [photoReviews.length, updateScrollState]);

  const scrollByPage = useCallback((direction: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth, behavior: "smooth" });
  }, []);

  if (photoReviews.length === 0) return null;

  const showNav = photoReviews.length > 3;

  return (
    <div className="relative">
      {showNav ? (
        <div className="mb-4 flex items-center justify-end gap-2">
          <CarouselArrow
            direction="prev"
            onClick={() => scrollByPage(-1)}
            label={t("goodIdeas.pdp.phase3.reviewsCarouselPrev", "Anterior")}
          />
          <CarouselArrow
            direction="next"
            onClick={() => scrollByPage(1)}
            label={t("goodIdeas.pdp.phase3.reviewsCarouselNext", "Siguiente")}
          />
        </div>
      ) : null}

      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="region"
        aria-label={t(
          "goodIdeas.pdp.phase3.reviewsCarouselAria",
          "Reseñas con fotos"
        )}
        aria-roledescription="carousel"
      >
        {photoReviews.map((review) => (
          <div
            key={review.id}
            className="w-[min(85vw,360px)] shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]"
          >
            <ReviewPhotoCard
              review={review}
              verifiedLabel={verifiedLabel}
              anonymousLabel={anonymousLabel}
              locale={locale}
              surface={surface}
            />
          </div>
        ))}
      </div>

      {showNav && (canScrollPrev || canScrollNext) ? (
        <p className="sr-only" aria-live="polite">
          {t(
            "goodIdeas.pdp.phase3.reviewsCarouselHint",
            "Deslizá para ver más reseñas"
          )}
        </p>
      ) : null}
    </div>
  );
}
