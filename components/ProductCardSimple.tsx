"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type MouseEvent } from "react";
import { Product } from "@/lib/products";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { useCart } from "@/context/CartContext";
import { PRODUCT_BLUR_DATA_URL } from "@/lib/product-image-helper";
import { trackSelectItem } from "@/lib/analytics/ga4";
import type { UISurface } from "@/lib/ui-surface";
import {
  getProductBrandLabel,
  getProductColorSwatches,
  getProductReviewAverage,
  getPatagoniaCardBadges,
  getProductCompareAtPrice,
} from "@/lib/plp-card-meta";
import { plpPatagoniaClasses } from "@/lib/ui/plp-patagonia";
import { useTranslations } from "@/components/i18n/LocaleProvider";

type Props = {
  product: Product;
  locale?: Locale;
  labels?: {
    viewProduct?: string;
    noImage?: string;
    addToCart?: string;
    quickAdd?: string;
    saveProduct?: string;
    freeShippingBadge?: string;
    newColor?: string;
    /** Plantilla serializable, p. ej. "{pct}% OFF" */
    salePercentTemplate?: string;
  };
  analyticsListId?: string;
  analyticsListName?: string;
  surface?: UISurface;
  editorial?: boolean;
  /** Listado PLP: layout Huckberry o Patagonia. */
  variant?: "default" | "plp" | "patagonia";
};

function isValidImageSrc(src?: string | null) {
  if (!src) return false;
  if (src.startsWith("http")) return true;
  if (src.startsWith("/")) return true;
  return false;
}

function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}

function ProductImage({
  src,
  title,
  cover,
  containFill,
  sizes,
}: {
  src: string;
  title: string;
  cover: boolean;
  containFill?: boolean;
  sizes: string;
}) {
  const isExternal = src.startsWith("http");
  if (isExternal) {
    return (
      <img
        src={src}
        alt={title}
        loading="lazy"
        decoding="async"
        className={
          cover
            ? "absolute inset-0 h-full w-full object-cover object-center"
            : containFill
              ? "absolute inset-0 h-full w-full object-contain object-center p-4"
              : "block h-auto w-full object-contain object-center"
        }
      />
    );
  }

  if (cover) {
    return (
      <Image
        src={src}
        alt={title}
        fill
        className="object-cover object-center"
        placeholder="blur"
        blurDataURL={PRODUCT_BLUR_DATA_URL}
        sizes={sizes}
      />
    );
  }

  if (containFill) {
    return (
      <Image
        src={src}
        alt={title}
        fill
        className="object-contain object-center"
        placeholder="blur"
        blurDataURL={PRODUCT_BLUR_DATA_URL}
        sizes={sizes}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={title}
      width={1200}
      height={900}
      className="block h-auto w-full object-contain object-center"
      placeholder="blur"
      blurDataURL={PRODUCT_BLUR_DATA_URL}
      sizes={sizes}
    />
  );
}

export default function ProductCardSimple({
  product,
  locale = defaultLocale,
  labels,
  analyticsListId,
  analyticsListName = "product_list",
  surface = "light",
  editorial = false,
  variant = "default",
}: Props) {
  const t = useTranslations();
  const localized = product.translations?.[locale];
  const title = localized?.title || product.title;
  const description =
    localized?.shortDescription ||
    localized?.description ||
    product.shortDescription ||
    product.description;
  const imageList = useMemo(
    () => (product.images || []).filter((src) => isValidImageSrc(src)),
    [product.images]
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeSwatch, setActiveSwatch] = useState(0);
  const activeImage = imageList[activeIndex] || imageList[0];
  const hasValidImage = Boolean(activeImage);
  const viewProductLabel = labels?.viewProduct || "View product";
  const noImageLabel = labels?.noImage || "No image";
  const addToCartLabel = labels?.addToCart || "Agregar al carrito";
  const quickAddLabel = labels?.quickAdd || addToCartLabel;
  const saveProductLabel = labels?.saveProduct || "Guardar producto";
  const freeShippingBadge =
    labels?.freeShippingBadge || "Envío gratis";
  const { addItem } = useCart();

  const handleAddToCart = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    addItem({
      id: product.id,
      title,
      price: product.price,
      image: activeImage,
    });
  };

  const trackClick = () => {
    trackSelectItem({
      item: {
        item_id: product.id,
        item_name: title,
        price: product.price,
        item_category: product.category,
      },
      itemListId: analyticsListId,
      itemListName: analyticsListName,
    });
  };

  if (variant === "patagonia") {
    const swatches = getProductColorSwatches(product);
    const badges = getPatagoniaCardBadges(product, {
      newColor: labels?.newColor ?? t("productsPage.badgeNewColor"),
      salePercentTemplate:
        labels?.salePercentTemplate ?? t("productsPage.badgeSalePercent"),
    });
    const compareAt = getProductCompareAtPrice(product);
    const visibleSwatches = swatches.slice(0, 5);
    const displayBadge = badges[0];

    return (
      <Link
        href={`/${locale}/products/${product.id}`}
        className="group block"
        onClick={trackClick}
      >
        <article>
          <div className={plpPatagoniaClasses.imageBox}>
            {displayBadge ? (
              <span className={plpPatagoniaClasses.badge}>{displayBadge.label}</span>
            ) : null}
            <div className={plpPatagoniaClasses.imageInner}>
              {hasValidImage ? (
                <ProductImage
                  src={activeImage!}
                  title={title}
                  cover={false}
                  containFill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <span className="font-inter text-xs text-[#666666]">
                  {noImageLabel}
                </span>
              )}
            </div>
          </div>

          {visibleSwatches.length > 0 ? (
            <div
              className="mt-2 flex flex-wrap items-center gap-1.5"
              onClick={(e) => e.preventDefault()}
            >
              {visibleSwatches.map((swatch, index) => {
                const isActive = index === activeSwatch;
                return (
                  <button
                    key={`${product.id}-pg-swatch-${index}`}
                    type="button"
                    aria-label={swatch.label}
                    aria-pressed={isActive}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveSwatch(index);
                      if (imageList[index]) setActiveIndex(index);
                    }}
                    className={`${plpPatagoniaClasses.swatch} ${
                      isActive ? plpPatagoniaClasses.swatchActive : ""
                    }`}
                    style={{ backgroundColor: swatch.hex }}
                  >
                    {isActive ? (
                      <span
                        className="absolute inset-0 flex items-center justify-center text-[10px] text-white drop-shadow"
                        aria-hidden
                      >
                        ✓
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : null}

          <h2 className={plpPatagoniaClasses.title}>{title}</h2>
          <div className="mt-1 flex flex-wrap items-baseline gap-2">
            {compareAt != null ? (
              <>
                <span className={plpPatagoniaClasses.priceSale}>
                  {formatPrice(product.price)}
                </span>
                <span className={plpPatagoniaClasses.priceCompare}>
                  {formatPrice(compareAt)}
                </span>
              </>
            ) : (
              <span className={plpPatagoniaClasses.price}>
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </article>
      </Link>
    );
  }

  if (variant === "plp") {
    const brand = getProductBrandLabel(product);
    const rating = getProductReviewAverage(product);
    const swatches = getProductColorSwatches(product);
    const badges = product.freeShipping ? [freeShippingBadge] : [];
    const extraSwatches =
      swatches.length > 4 ? swatches.length - 4 : 0;
    const visibleSwatches = swatches.slice(0, 4);

    return (
      <Link
        href={`/${locale}/products/${product.id}`}
        className="group block text-dark-base"
        onClick={trackClick}
      >
        <article>
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-soft-stone">
            {hasValidImage ? (
              <ProductImage
                src={activeImage!}
                title={title}
                cover
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center font-inter text-xs text-forest/50">
                {noImageLabel}
              </div>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-sm bg-[#F4EBDD]/90 font-inter text-dark-base lg:right-3 lg:top-3"
              aria-label={saveProductLabel}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden
              >
                <path d="M7 4h10a1 1 0 0 1 1 1v16l-8-4-8 4V5a1 1 0 0 1 1-1z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={handleAddToCart}
              className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-sm bg-[#F4EBDD]/95 font-inter text-lg leading-none text-dark-base lg:hidden"
              aria-label={quickAddLabel}
            >
              +
            </button>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden lg:block">
              <button
                type="button"
                onClick={handleAddToCart}
                className="pointer-events-auto w-full translate-y-full bg-[#F4EBDD]/95 px-3 py-2.5 font-inter text-xs text-dark-base opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
              >
                {quickAddLabel}
              </button>
            </div>
          </div>

          <div className="mt-2 space-y-1 font-inter">
            {/* Mobile */}
            <div className="space-y-1 lg:hidden">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[0.7rem] text-forest/70">{brand}</span>
                <span className="shrink-0 text-[0.7rem] tabular-nums text-dark-base">
                  {formatPrice(product.price)}
                </span>
              </div>
              <h2 className="line-clamp-2 text-xs leading-snug text-dark-base">
                {title}
              </h2>
              {rating != null ? (
                <p className="text-[0.65rem] text-forest/75">
                  <span aria-hidden>★</span> {rating.toFixed(1)}
                </p>
              ) : null}
              {badges.length > 0 ? (
                <p className="text-[0.65rem] text-forest/70">
                  {badges.join(", ")}
                </p>
              ) : null}
              {visibleSwatches.length > 0 ? (
                <div className="flex items-center gap-1 pt-0.5">
                  {visibleSwatches.map((swatch, index) => (
                    <span
                      key={`${product.id}-sw-${index}`}
                      className="h-2.5 w-4 border border-forest/15"
                      style={{ backgroundColor: swatch.hex }}
                      title={swatch.label}
                    />
                  ))}
                  {extraSwatches > 0 ? (
                    <span className="text-[0.6rem] text-forest/60">
                      +{extraSwatches}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>

            {/* Desktop */}
            <div className="hidden space-y-1 lg:block">
              <span className="block text-xs text-forest/70">{brand}</span>
              <div className="flex items-start justify-between gap-2">
                <h2 className="line-clamp-2 text-sm leading-snug text-dark-base">
                  {title}
                </h2>
                <span className="shrink-0 text-sm tabular-nums text-dark-base">
                  {formatPrice(product.price)}
                </span>
              </div>
              {(rating != null || badges.length > 0) && (
                <div className="flex flex-wrap items-center gap-2 text-xs text-forest/75">
                  {rating != null ? (
                    <span>
                      <span aria-hidden>★</span> {rating.toFixed(1)}
                    </span>
                  ) : null}
                  {badges.map((badge) => (
                    <span key={badge}>{badge}</span>
                  ))}
                </div>
              )}
              {visibleSwatches.length > 0 ? (
                <div className="flex items-center gap-1.5 pt-0.5">
                  {visibleSwatches.map((swatch, index) => (
                    <span
                      key={`${product.id}-sw-d-${index}`}
                      className="h-3 w-5 border border-forest/15"
                      style={{ backgroundColor: swatch.hex }}
                      title={swatch.label}
                    />
                  ))}
                  {extraSwatches > 0 ? (
                    <span className="text-xs text-forest/60">
                      +{extraSwatches}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </article>
      </Link>
    );
  }

  const L = surface === "light";
  const E = editorial && !L;

  return (
    <Link
      href={`/${locale}/products/${product.id}`}
      className={L ? "block text-dark-base" : "block text-white"}
      onClick={trackClick}
    >
      <article
        className={
          E
            ? "group overflow-hidden rounded-sm border border-earth-brown/18 bg-dark-base/92 transition-all duration-300 ease-out motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 hover:-translate-y-1 hover:scale-[1.02] hover:border-earth-brown/30 hover:shadow-[0_28px_56px_-24px_rgba(17,23,19,0.35)]"
            : L
              ? "group overflow-hidden rounded-xl border border-earth-brown/15 bg-soft-stone shadow-[0_8px_28px_-14px_rgba(17,23,19,0.12)] transition-all duration-300 ease-out motion-reduce:transition-none motion-reduce:hover:translate-y-0 hover:-translate-y-0.5 hover:border-earth-brown/25 hover:shadow-[0_14px_36px_-18px_rgba(17,23,19,0.16)]"
              : "group overflow-hidden rounded-xl border border-earth-brown/22 bg-dark-surface shadow-[0_10px_28px_-14px_rgba(17,23,19,0.45)] transition-all duration-300 ease-out motion-reduce:transition-none motion-reduce:hover:translate-y-0 hover:-translate-y-1 hover:border-earth-brown/35 hover:shadow-xl"
        }
      >
        <div
          className={
            E
              ? "relative aspect-[4/5] w-full overflow-hidden bg-dark-base"
              : L
                ? "relative w-full overflow-hidden bg-soft-stone"
                : "relative w-full overflow-hidden bg-dark-surface"
          }
        >
          {hasValidImage ? (
            <ProductImage
              src={activeImage!}
              title={title}
              cover={E}
              sizes={
                E
                  ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              }
            />
          ) : (
            <div
              className={
                L
                  ? "flex h-full items-center justify-center text-sm text-neutral-500"
                  : "flex h-full items-center justify-center text-sm text-text-muted"
              }
            >
              {noImageLabel}
            </div>
          )}
          <div className="pointer-events-none absolute inset-0">
            {E ? (
              <div className="absolute inset-0 bg-gradient-to-t from-black/58 via-black/10 to-black/18" />
            ) : null}
            <div
              className={
                L
                  ? "absolute inset-0 bg-gradient-to-t from-neutral-900/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
                  : E
                    ? "absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
                    : "absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
              }
            />
            <div className="absolute inset-x-0 bottom-4 flex items-center justify-center">
              <button
                type="button"
                onClick={handleAddToCart}
                className={
                  L
                    ? "pointer-events-auto translate-y-2 rounded-full border border-earth-brown/25 bg-white/95 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-dark-base opacity-0 shadow-[0_8px_22px_-10px_rgba(17,23,19,0.15)] backdrop-blur-sm transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 hover:border-accent-gold/55 hover:text-accent-gold active:scale-[0.98]"
                    : "pointer-events-auto translate-y-2 rounded-full border border-white/28 bg-black/55 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/95 opacity-0 shadow-[0_8px_22px_-8px_rgba(0,0,0,0.45)] backdrop-blur-md transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 hover:border-accent-gold/55 hover:text-accent-gold/95 active:scale-[0.98]"
                }
                aria-label={addToCartLabel}
              >
                {addToCartLabel}
              </button>
            </div>
          </div>
        </div>

        {imageList.length > 1 && !E && (
          <div
            className="px-4 pb-4 md:px-5 md:pb-5"
            onClick={(event) => event.preventDefault()}
          >
            <div className="flex items-center gap-2">
              {imageList.slice(0, 5).map((_, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={`${product.id}-dot-${index}`}
                    type="button"
                    aria-label={`Preview ${title} ${index + 1}`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    className={[
                      "h-2.5 w-2.5 rounded-full border transition-colors",
                      isActive
                        ? "border-accent-gold bg-accent-gold"
                        : L
                          ? "border-earth-brown/30 bg-transparent hover:border-earth-brown/55"
                          : "border-white/25 bg-transparent hover:border-white/45",
                    ].join(" ")}
                  />
                );
              })}
            </div>
          </div>
        )}

        <div className={E ? "space-y-2 p-4 md:p-5" : "space-y-2 p-4 md:p-5"}>
          <h2
            className={
              E
                ? "line-clamp-2 text-[0.95rem] font-semibold leading-snug tracking-tight text-white md:text-base"
                : L
                  ? "line-clamp-2 text-base font-semibold text-dark-base"
                  : "line-clamp-2 text-base font-semibold text-white"
            }
          >
            {title}
          </h2>
          <p
            className={
              E
                ? "line-clamp-2 text-[0.7rem] leading-relaxed text-white/[0.78] md:text-xs"
                : L
                  ? "line-clamp-2 text-xs text-muted-gray"
                  : "line-clamp-2 text-xs text-white/75"
            }
          >
            {description}
          </p>
          <div className="flex items-center justify-between pt-1.5">
            <span
              className={
                E
                  ? "text-sm font-medium tabular-nums text-white"
                  : L
                    ? "text-sm font-medium tabular-nums text-dark-base"
                    : "text-sm font-medium tabular-nums text-white"
              }
            >
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-accent-gold transition-colors duration-200 ease-out group-hover:text-accent-gold/90">
              {viewProductLabel}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
