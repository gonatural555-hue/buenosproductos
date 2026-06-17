import type { Product, ProductVariants } from "@/lib/products";
import { resolveSwatchHex } from "@/lib/color-swatch";
import { REVIEWS_SEED } from "@/lib/reviews-data";

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

export type ProductColorSwatch = {
  label: string;
  hex: string;
  value: string;
};

export function getProductColorSwatches(product: Product): ProductColorSwatch[] {
  const variants = normalizeVariants(product.variants);
  const colorVariant = variants.find(
    (v) =>
      v.type.toLowerCase().includes("color") ||
      v.label.toLowerCase().includes("color") ||
      v.label.toLowerCase().includes("colour")
  );
  if (!colorVariant) return [];

  return colorVariant.options.slice(0, 6).map((opt) => {
    const value = opt.value ?? opt.label;
    const explicitHex =
      typeof opt.swatchHex === "string" ? opt.swatchHex : null;
    return {
      label: opt.label,
      value,
      hex: resolveSwatchHex(value, opt.label, explicitHex),
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

export type PatagoniaCardBadge = {
  id: string;
  label: string;
};

export function getPatagoniaCardBadges(
  product: Product,
  labels: { newColor?: string; salePercentTemplate?: string }
): PatagoniaCardBadge[] {
  const badges: PatagoniaCardBadge[] = [];
  const swatches = getProductColorSwatches(product);
  if (swatches.length > 1 && labels.newColor) {
    badges.push({ id: "new-color", label: labels.newColor });
  }
  const compareAt = (product as Product & { compareAtPrice?: number })
    .compareAtPrice;
  if (
    typeof compareAt === "number" &&
    compareAt > product.price &&
    labels.salePercentTemplate
  ) {
    const pct = Math.round((1 - product.price / compareAt) * 100);
    if (pct > 0) {
      badges.push({
        id: "sale",
        label: labels.salePercentTemplate.replace("{pct}", String(pct)),
      });
    }
  }
  return badges;
}

export function getProductCompareAtPrice(product: Product): number | null {
  const compareAt = (product as Product & { compareAtPrice?: number })
    .compareAtPrice;
  if (typeof compareAt === "number" && compareAt > product.price) {
    return compareAt;
  }
  return null;
}
