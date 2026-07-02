"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import SmartImage from "@/components/SmartImage";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import { useGoodIdeasCart } from "@/context/GoodIdeasCartContext";
import { useCurrency } from "@/context/CurrencyContext";
import type { ProductReviewStatsSnapshot } from "@/lib/good-ideas-product-review-stats";
import { localizeGoodIdeasProduct } from "@/lib/good-ideas-products";
import { isValidImageSrc } from "@/lib/image-src";
import type { Product } from "@/lib/product-types";
import { productPath } from "@/lib/routing/paths";

type Props = {
  product: Product;
  cardImage: string;
  reviewStats?: ProductReviewStatsSnapshot;
  viewProductLabel: string;
  addNowLabel: string;
  noImageLabel: string;
};

function StarRating({ value }: { value: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-hidden
      style={{ color: "#FBBF24" }}
    >
      {Array.from({ length: 5 }, (_, i) => {
        const filled = value >= i + 0.75;
        return (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            className="h-3.5 w-3.5"
            fill={filled ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={1.2}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
          </svg>
        );
      })}
    </div>
  );
}

export default function GoodIdeasHomeFeaturedProductCard({
  product,
  cardImage,
  reviewStats,
  viewProductLabel,
  addNowLabel,
  noImageLabel,
}: Props) {
  const locale = useLocale();
  const t = useTranslations();
  const localized = localizeGoodIdeasProduct(product, locale);
  const { formatMoney } = useCurrency();
  const { addItemAndOpenDrawer } = useGoodIdeasCart();
  const imageSrc = isValidImageSrc(cardImage) ? cardImage : null;
  const salesBadge = localized.salesBadge?.trim();

  const handleAddNow = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    addItemAndOpenDrawer({
      id: product.id,
      title: localized.title,
      price: localized.price,
      image: imageSrc ?? undefined,
    });
  };

  const reviewsLabel =
    reviewStats && reviewStats.totalReviews > 0
      ? t("goodIdeas.featured.reviewsCount").replace(
          "{count}",
          String(reviewStats.totalReviews)
        )
      : null;

  return (
    <Link
      href={productPath(locale, product.id)}
      className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#151B24] transition duration-300 hover:border-[rgba(59,130,246,0.35)] hover:shadow-[0_20px_48px_rgba(59,130,246,0.12)] motion-reduce:transition-none"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#0B0F14]/80">
        {salesBadge ? (
          <span className="absolute left-3 top-3 z-[2] rounded-full bg-[#3B82F6] px-2.5 py-1 font-body text-[11px] font-semibold uppercase tracking-wide text-white shadow-[0_8px_20px_rgba(59,130,246,0.35)]">
            {salesBadge}
          </span>
        ) : null}

        {imageSrc ? (
          <SmartImage
            src={imageSrc}
            alt={localized.title}
            fill
            sizes="(max-width: 640px) 82vw, (max-width: 1024px) 45vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-body text-sm text-[rgba(232,236,241,0.55)]">
            {noImageLabel}
          </div>
        )}

        {imageSrc ? (
          <div className="absolute inset-x-3 bottom-3 z-[2] translate-y-1 opacity-100 transition duration-300 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 motion-reduce:md:translate-y-0 motion-reduce:md:opacity-100">
            <button
              type="button"
              onClick={handleAddNow}
              className="w-full rounded-full border border-[#3B82F6] bg-[#3B82F6] px-4 py-2.5 font-body text-xs font-semibold text-white shadow-[0_8px_24px_rgba(59,130,246,0.35)] transition hover:border-[#2563EB] hover:bg-[#2563EB]"
              aria-label={addNowLabel}
            >
              {addNowLabel}
            </button>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <h3 className="line-clamp-2 font-body text-sm font-semibold leading-snug text-[#E8ECF1] sm:text-[15px]">
          {localized.title}
        </h3>

        <div className="mt-auto space-y-2">
          <p className="font-body text-lg font-bold tabular-nums text-[#3B82F6] sm:text-xl">
            {formatMoney(localized.price)}
          </p>

          {reviewStats && reviewStats.totalReviews > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <StarRating value={reviewStats.averageRating} />
              <span className="font-body text-xs text-[rgba(232,236,241,0.55)]">
                {reviewsLabel}
              </span>
            </div>
          ) : null}

          <span className="inline-block font-body text-xs font-medium text-[rgba(232,236,241,0.55)] transition group-hover:text-[#3B82F6] md:hidden">
            {viewProductLabel} →
          </span>
        </div>
      </div>
    </Link>
  );
}
