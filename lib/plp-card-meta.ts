import type { Product, ProductVariants } from "@/lib/products";
import { REVIEWS_SEED } from "@/lib/reviews-data";

const COLOR_HEX: Record<string, string> = {
  black: "#1a1a1a",
  negro: "#1a1a1a",
  white: "#f5f5f0",
  blanco: "#f5f5f0",
  navy: "#2A2E4B",
  azul: "#3d5a80",
  blue: "#3d5a80",
  red: "#6E1F28",
  rojo: "#6E1F28",
  green: "#2E4A36",
  verde: "#2E4A36",
  brown: "#6b4f3a",
  marron: "#6b4f3a",
  gray: "#8a8a8a",
  grey: "#8a8a8a",
  gris: "#8a8a8a",
  gold: "#D9A441",
  orange: "#C9622B",
  beige: "#d4c4a8",
  cream: "#F4EBDD",
};

function normalizeVariants(
  variants?: ProductVariants | ProductVariants[]
): ProductVariants[] {
  if (!variants) return [];
  return Array.isArray(variants) ? variants : [variants];
}

export function getProductReviewAverage(product: Product): number | null {
  const slug = product.slug ?? product.id;
  const reviews = REVIEWS_SEED.filter(
    (r) => r.productSlug === slug || r.productSlug === product.id
  );
  if (reviews.length === 0) return null;
  const total = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}

export function getProductColorSwatches(product: Product): {
  label: string;
  hex: string;
}[] {
  const variants = normalizeVariants(product.variants);
  const colorVariant = variants.find(
    (v) =>
      v.type.toLowerCase().includes("color") ||
      v.label.toLowerCase().includes("color") ||
      v.label.toLowerCase().includes("colour")
  );
  if (!colorVariant) return [];

  return colorVariant.options.slice(0, 6).map((opt) => {
    const key = (opt.value ?? opt.label).toLowerCase().trim();
    return {
      label: opt.label,
      hex: COLOR_HEX[key] ?? "#8a8a8a",
    };
  });
}

export function getProductBrandLabel(product: Product): string {
  return product.category?.trim() || "Go Natural";
}

export function getProductBadges(product: Product): string[] {
  const badges: string[] = [];
  if (product.freeShipping) badges.push("freeShipping");
  return badges;
}
