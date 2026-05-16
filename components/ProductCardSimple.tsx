"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Product } from "@/lib/products";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { useCart } from "@/context/CartContext";
import { PRODUCT_BLUR_DATA_URL } from "@/lib/product-image-helper";
import { trackSelectItem } from "@/lib/analytics/ga4";
import type { UISurface } from "@/lib/ui-surface";

type Props = {
  product: Product;
  locale?: Locale;
  labels?: {
    viewProduct?: string;
    noImage?: string;
    addToCart?: string;
  };
  /** Origen del listado para GA4 `select_item` (p. ej. categoría, destacados). */
  analyticsListId?: string;
  analyticsListName?: string;
  /** Tarjeta sobre fondo claro (p. ej. cross-sell en PDP). */
  surface?: UISurface;
  /** Listado editorial (/productos): imagen dominante, menos chrome. */
  editorial?: boolean;
};

function isValidImageSrc(src?: string | null) {
  if (!src) return false;
  if (src.startsWith("http")) return true;
  if (src.startsWith("/")) return true;
  return false;
}

export default function ProductCardSimple({
  product,
  locale = defaultLocale,
  labels,
  analyticsListId,
  analyticsListName = "product_list",
  surface = "light",
  editorial = false,
}: Props) {
  const L = surface === "light";
  const E = editorial && !L;
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
  const activeImage = imageList[activeIndex] || imageList[0];
  const hasValidImage = Boolean(activeImage);
  const isExternal = hasValidImage && activeImage!.startsWith("http");
  const isLocal = hasValidImage && activeImage!.startsWith("/");
  const viewProductLabel = labels?.viewProduct || "View product";
  const noImageLabel = labels?.noImage || "No image";
  const addToCartLabel = labels?.addToCart || "Agregar al carrito";
  const { addItem } = useCart();

  return (
    <Link
      href={`/${locale}/products/${product.id}`}
      className={L ? "block text-dark-base" : "block text-white"}
      onClick={() => {
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
      }}
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
        {/* IMAGE */}
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
            isExternal ? (
              <img
                src={activeImage!}
                alt={title}
                loading="lazy"
                decoding="async"
                className={
                  E
                    ? "absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[520ms] ease-out group-hover:scale-[1.05]"
                    : "block w-full h-auto object-contain object-center transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                }
              />
            ) : isLocal ? (
              E ? (
                <Image
                  src={activeImage!}
                  alt={title}
                  fill
                  className="object-cover object-center transition-transform duration-[520ms] ease-out group-hover:scale-[1.05]"
                  placeholder="blur"
                  blurDataURL={PRODUCT_BLUR_DATA_URL}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              ) : (
                <Image
                  src={activeImage!}
                  alt={title}
                  width={1200}
                  height={900}
                  className="block w-full h-auto object-contain object-center transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                  placeholder="blur"
                  blurDataURL={PRODUCT_BLUR_DATA_URL}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              )
            ) : (
              <div
                className={
                  L
                    ? "flex items-center justify-center h-full text-sm text-neutral-500"
                    : "flex items-center justify-center h-full text-sm text-text-muted"
                }
              >
                {noImageLabel}
              </div>
            )
          ) : (
            <div
              className={
                L
                  ? "flex items-center justify-center h-full text-sm text-neutral-500"
                  : "flex items-center justify-center h-full text-sm text-text-muted"
              }
            >
              {noImageLabel}
            </div>
          )}
          <div className="absolute inset-0 pointer-events-none">
            {E ? (
              <div className="absolute inset-0 bg-gradient-to-t from-black/58 via-black/10 to-black/18" />
            ) : null}
            <div
              className={
                L
                  ? "absolute inset-0 bg-gradient-to-t from-neutral-900/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
                  : E
                    ? "absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
                    : "absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
              }
            />
            <div className="absolute inset-x-0 bottom-4 flex items-center justify-center">
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  addItem({
                    id: product.id,
                    title,
                    price: product.price,
                    image: activeImage,
                  });
                }}
                className={
                  L
                    ? "pointer-events-auto rounded-full border border-earth-brown/25 bg-white/95 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-dark-base opacity-0 shadow-[0_8px_22px_-10px_rgba(17,23,19,0.15)] backdrop-blur-sm transition-all duration-300 ease-out translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 hover:border-accent-gold/55 hover:text-accent-gold active:scale-[0.98]"
                    : "pointer-events-auto rounded-full border border-white/28 bg-black/55 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/95 shadow-[0_8px_22px_-8px_rgba(0,0,0,0.45)] backdrop-blur-md opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 hover:border-accent-gold/55 hover:text-accent-gold/95 active:scale-[0.98]"
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
            className="px-4 md:px-5 pb-4 md:pb-5"
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

        {/* INFO */}
        <div className={E ? "space-y-2 p-4 md:p-5" : "p-4 md:p-5 space-y-2"}>
          <h2
            className={
              E
                ? "text-[0.95rem] font-semibold leading-snug tracking-tight text-white line-clamp-2 md:text-base"
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
                ? "text-[0.7rem] leading-relaxed text-white/[0.78] line-clamp-2 md:text-xs"
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
              ${product.price.toFixed(2)}
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
