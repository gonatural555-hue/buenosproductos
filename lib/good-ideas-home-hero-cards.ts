import type { Product } from "@/lib/product-types";
import { getGoodIdeasProducts } from "@/lib/good-ideas-products";
import { resolveGoodIdeasProductCardImage } from "@/lib/good-ideas-product-images";
import { resolveGoodIdeasHomeHeroShowcase } from "@/lib/good-ideas-home-showcase";
import type { Locale } from "@/lib/i18n/config";

export type GoodIdeasHomeHeroCardEntry = {
  product: Product;
  cardImage: string;
};

/** Tres productos del hero home — misma curación que `resolveGoodIdeasHomeHeroShowcase`. */
export function resolveGoodIdeasHomeHeroCardEntries(
  locale: Locale,
  limit = 3
): GoodIdeasHomeHeroCardEntry[] {
  const showcase = resolveGoodIdeasHomeHeroShowcase(locale, limit);
  const byId = new Map(getGoodIdeasProducts().map((p) => [p.id, p]));

  return showcase
    .map((item) => {
      const product = byId.get(item.id);
      if (!product) return null;
      const cardImage = resolveGoodIdeasProductCardImage(product.id) ?? item.image;
      return { product, cardImage };
    })
    .filter((entry): entry is GoodIdeasHomeHeroCardEntry => Boolean(entry));
}
