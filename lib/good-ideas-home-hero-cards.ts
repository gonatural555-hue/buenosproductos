import type { Product } from "@/lib/product-types";
import { getGoodIdeasProducts } from "@/lib/good-ideas-products";
import { resolveGoodIdeasProductCardImage } from "@/lib/good-ideas-product-images";
import type { Locale } from "@/lib/i18n/config";

export type GoodIdeasHomeHeroCardEntry = {
  product: Product;
  cardImage: string;
};

/** Curación del carrusel 3D del hero home — orden fijo. */
export const HERO_CAROUSEL_PRODUCT_IDS = [
  "gi-tech-001",
  "gi-hogar-008",
  "gi-hogar-002",
  "gi-lifestyle-002",
] as const;

/**
 * Hasta 4 productos del hero con imagen `featured` válida.
 * Usa IDs reales del catálogo; omite entradas sin producto o sin imagen.
 */
export function resolveGoodIdeasHomeHeroCardEntries(
  locale: Locale,
  limit = 4
): GoodIdeasHomeHeroCardEntry[] {
  void locale;
  const byId = new Map(getGoodIdeasProducts().map((p) => [p.id, p]));
  const entries: GoodIdeasHomeHeroCardEntry[] = [];

  for (const id of HERO_CAROUSEL_PRODUCT_IDS) {
    if (entries.length >= limit) break;
    const product = byId.get(id);
    if (!product) continue;
    const cardImage = resolveGoodIdeasProductCardImage(id);
    if (!cardImage) continue;
    entries.push({ product, cardImage });
  }

  return entries;
}
