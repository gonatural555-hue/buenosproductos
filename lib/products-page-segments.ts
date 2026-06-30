import type { Product } from "@/lib/product-types";
import type { Locale } from "@/lib/i18n/config";

export function sortProductsList(
  products: Product[],
  sortKey: string | undefined,
  locale: Locale
): Product[] {
  const copy = [...products];
  const titleOf = (p: Product) =>
    p.translations?.[locale]?.title ?? p.title;

  switch (sortKey) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "name-asc":
      return copy.sort((a, b) =>
        titleOf(a).localeCompare(titleOf(b), locale, { sensitivity: "base" })
      );
    default:
      return copy;
  }
}
