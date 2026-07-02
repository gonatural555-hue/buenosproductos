import {
  getGoodIdeasProducts,
  localizeGoodIdeasProduct,
} from "@/lib/good-ideas-products";
import { resolveGoodIdeasProductCardImage } from "@/lib/good-ideas-product-images";
import { buildGoodIdeasProductsListHref } from "@/lib/good-ideas-plp-segments";
import type { Locale } from "@/lib/i18n/config";

export type GoodIdeasHomePromoProductVisual = {
  id: string;
  image: string;
  title: string;
};

const PREFERRED_PROMO_IDS = [
  "gi-hogar-003",
  "gi-regalos-001",
  "gi-lifestyle-004",
  "gi-tech-003",
] as const;

/**
 * Productos con `salesBadge` e imagen de card — decoración del banner.
 * Sin badge en catálogo → array vacío (banner sin imágenes).
 */
export function resolveGoodIdeasHomePromoProducts(
  locale: Locale,
  limit = 3
): GoodIdeasHomePromoProductVisual[] {
  const catalog = getGoodIdeasProducts();
  const byId = new Map(catalog.map((p) => [p.id, p]));
  const picked: GoodIdeasHomePromoProductVisual[] = [];
  const seen = new Set<string>();

  const tryAdd = (id: string) => {
    if (picked.length >= limit || seen.has(id)) return;
    const product = byId.get(id);
    if (!product?.salesBadge) return;
    const image = resolveGoodIdeasProductCardImage(id);
    if (!image) return;
    seen.add(id);
    picked.push({
      id,
      image,
      title: localizeGoodIdeasProduct(product, locale).title,
    });
  };

  for (const id of PREFERRED_PROMO_IDS) {
    tryAdd(id);
  }

  if (picked.length < limit) {
    for (const product of catalog) {
      if (!product.salesBadge) continue;
      tryAdd(product.id);
      if (picked.length >= limit) break;
    }
  }

  return picked;
}

/** PLP — no hay query `onSale`; productos con oferta usan `salesBadge` en catálogo. */
export function resolveGoodIdeasHomePromoCtaHref(locale: Locale): string {
  return buildGoodIdeasProductsListHref(locale);
}

export function hasGoodIdeasHomePromoOffers(): boolean {
  return resolveGoodIdeasHomePromoProducts("en", 1).length > 0;
}
