"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import SmartImage from "@/components/SmartImage";
import type { Product } from "@/lib/product-types";
import type { Locale } from "@/lib/i18n/config";
import { productPath } from "@/lib/routing/paths";
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
  const { addItemAndOpenDrawer } = useGoodIdeasCart();
  const imageSrc = isValidImageSrc(cardImage) ? cardImage : null;

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

  return (
    <Link
      href={productPath(locale, product.id)}
      className={giPlpClasses.card}
    >
      <div className={giPlpClasses.cardImageBg}>
        {imageSrc ? (
          <SmartImage
            src={imageSrc}
            alt={localized.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className={giPlpClasses.cardNoImage}>
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
        <p className={giPlpClasses.cardCategory}>
          {product.category}
        </p>
        <h2 className={giPlpClasses.cardTitle}>
          {localized.title}
        </h2>
        <p className={giPlpClasses.cardPrice}>
          {formatMoney(localized.price)}
        </p>
        <span className={giPlpClasses.cardCta}>
          {viewProductLabel} →
        </span>
      </div>
    </Link>
  );
}
