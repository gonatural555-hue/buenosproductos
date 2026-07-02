import {
  getGoodIdeasProducts,
  localizeGoodIdeasProduct,
} from "@/lib/good-ideas-products";
import { resolveGoodIdeasProductCardImage } from "@/lib/good-ideas-product-images";
import type { Locale } from "@/lib/i18n/config";

export type GoodIdeasHomeHeroShowcaseItem = {
  id: string;
  image: string;
  title: string;
};

/** Curación visual — solo IDs con `featured` en JSON (mix tech / hogar / lifestyle). */
const PREFERRED_SHOWCASE_IDS = [
  "gi-tech-001",
  "gi-hogar-004",
  "gi-lifestyle-003",
  "gi-tech-003",
  "gi-hogar-001",
  "gi-lifestyle-001",
] as const;

/**
 * Hasta 3 productos con imagen `featured` válida para el montaje del hero home.
 */
export function resolveGoodIdeasHomeHeroShowcase(
  locale: Locale,
  limit = 3
): GoodIdeasHomeHeroShowcaseItem[] {
  const catalog = getGoodIdeasProducts();
  const byId = new Map(catalog.map((p) => [p.id, p]));
  const picked: GoodIdeasHomeHeroShowcaseItem[] = [];
  const seen = new Set<string>();

  const tryAdd = (id: string) => {
    if (picked.length >= limit || seen.has(id)) return;
    const image = resolveGoodIdeasProductCardImage(id);
    if (!image) return;
    const product = byId.get(id);
    if (!product) return;
    seen.add(id);
    picked.push({
      id,
      image,
      title: localizeGoodIdeasProduct(product, locale).title,
    });
  };

  for (const id of PREFERRED_SHOWCASE_IDS) {
    tryAdd(id);
  }

  if (picked.length < limit) {
    for (const product of catalog) {
      tryAdd(product.id);
      if (picked.length >= limit) break;
    }
  }

  return picked;
}
