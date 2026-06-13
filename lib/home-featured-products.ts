import type { Product } from "@/lib/products";

export const HOME_ESSENTIAL_PRODUCT_IDS = [
  "gn-ski-snow-001-sk7a1",
  "gn-cycling-011",
  "gn-cycling-eq-001",
  "gn-cycling-jacket-003",
  "gn-water-007",
  "gn-outdoor-009",
] as const;

export function pickHomeEssentialProducts(products: Product[]): Product[] {
  return HOME_ESSENTIAL_PRODUCT_IDS.map((id) =>
    products.find((p) => p.id === id)
  ).filter((p): p is Product => Boolean(p));
}
