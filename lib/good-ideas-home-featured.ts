import type { Product } from "@/lib/product-types";
import { getGoodIdeasProducts } from "@/lib/good-ideas-products";
import { resolveGoodIdeasProductCardImage } from "@/lib/good-ideas-product-images";

export type GoodIdeasHomeFeaturedEntry = {
  product: Product;
  cardImage: string;
};

function normalizeCategory(category: string): string {
  return category.trim().toLowerCase();
}

/**
 * Productos destacados home: prioriza `salesBadge`, imagen JSON `featured`,
 * diversidad de categoría; fallback al catálogo con imagen.
 */
export function resolveGoodIdeasHomeFeaturedProducts(
  limit = 4
): GoodIdeasHomeFeaturedEntry[] {
  const catalog = getGoodIdeasProducts();
  const withImage = catalog
    .map((product) => ({
      product,
      cardImage: resolveGoodIdeasProductCardImage(product.id),
    }))
    .filter((entry) => Boolean(entry.cardImage));

  const picked: GoodIdeasHomeFeaturedEntry[] = [];
  const pickedIds = new Set<string>();
  const pickedCategories = new Set<string>();

  const tryPick = (entry: GoodIdeasHomeFeaturedEntry) => {
    if (picked.length >= limit || pickedIds.has(entry.product.id)) return;
    picked.push(entry);
    pickedIds.add(entry.product.id);
    pickedCategories.add(normalizeCategory(entry.product.category));
  };

  const withBadge = withImage.filter((e) => Boolean(e.product.salesBadge));

  for (const entry of withBadge) {
    if (picked.length >= limit) break;
    const cat = normalizeCategory(entry.product.category);
    if (!pickedCategories.has(cat) || picked.length >= limit - 1) {
      tryPick(entry);
    }
  }

  for (const entry of withBadge) {
    if (picked.length >= limit) break;
    tryPick(entry);
  }

  for (const entry of withImage) {
    if (picked.length >= limit) break;
    tryPick(entry);
  }

  return picked;
}
