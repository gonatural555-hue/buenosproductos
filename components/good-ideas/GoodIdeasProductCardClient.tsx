"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import SmartImage from "@/components/SmartImage";
import type { Product } from "@/lib/products";
import type { Locale } from "@/lib/i18n/config";
import { goodIdeasProductPath } from "@/lib/routing/brands";
import { localizeGoodIdeasProduct } from "@/lib/good-ideas-products";
import { useGoodIdeasCart } from "@/context/GoodIdeasCartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { isValidImageSrc } from "@/lib/image-src";
import { giPlpClasses } from "@/lib/ui/good-ideas-plp";

export type GoodIdeasProductCardClientProps = {
  product: Product;
  locale: Locale;
  viewProductLabel: string;
  noImageLabel: string;
  addNowLabel: string;
  cardImage: string;
};

export default function GoodIdeasProductCardClient({
  product,
  locale,
  viewProductLabel,
  noImageLabel,
  addNowLabel,
  cardImage,
}: GoodIdeasProductCardClientProps) {
  const localized = localizeGoodIdeasProduct(product, locale);
  const { formatMoney } = useCurrency();
  const { addItem } = useGoodIdeasCart();
  const imageSrc = isValidImageSrc(cardImage) ? cardImage : null;

  const handleAddNow = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    addItem({
      id: product.id,
      title: localized.title,
      price: localized.price,
      image: imageSrc ?? undefined,
    });
  };

  return (
    <Link
      href={goodIdeasProductPath(locale, product.id)}
      className="group block overflow-hidden rounded-2xl border border-white/[0.08] bg-[#151B24] transition duration-300 hover:-translate-y-0.5 hover:border-[#3B82F6]/35 hover:shadow-[0_20px_48px_rgba(0,0,0,0.35)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#0B0F14]">
        {imageSrc ? (
          <SmartImage
            src={imageSrc}
            alt={localized.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-inter text-[13px] text-[rgba(232,236,241,0.45)]">
            {noImageLabel}
          </div>
        )}
        {imageSrc ? (
          <div className={giPlpClasses.addNowWrap}>
            <button
              type="button"
              onClick={handleAddNow}
              className={giPlpClasses.addNowBtn}
              aria-label={addNowLabel}
            >
              {addNowLabel}
            </button>
          </div>
        ) : null}
      </div>
      <div className="space-y-2 p-5">
        <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.18em] text-[#3B82F6]">
          {product.category}
        </p>
        <h2 className="font-display text-[1.15rem] leading-snug tracking-[-0.02em] text-[#E8ECF1]">
          {localized.title}
        </h2>
        {localized.shortDescription ? (
          <p className="line-clamp-2 font-inter text-[14px] leading-relaxed text-[rgba(232,236,241,0.65)]">
            {localized.shortDescription}
          </p>
        ) : null}
        <p className="font-inter text-[15px] font-semibold text-white">
          {formatMoney(localized.price)}
        </p>
        <span className="inline-flex font-inter text-[11px] font-semibold uppercase tracking-[0.14em] text-[rgba(232,236,241,0.55)] transition group-hover:text-[#3B82F6]">
          {viewProductLabel} →
        </span>
      </div>
    </Link>
  );
}
