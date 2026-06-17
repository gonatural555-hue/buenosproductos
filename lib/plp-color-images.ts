import type { ProductImages } from "@/lib/product-images";
import type { Product, ProductVariants } from "@/lib/products";
import { getProductColorSwatches } from "@/lib/plp-card-meta";
import {
  getColorVariantDefinition,
  resolveColorFeaturedImage as resolveColorFeaturedImageFromUtils,
} from "@/lib/variant-image-utils";

function normalizeVariants(
  variants?: ProductVariants | ProductVariants[]
): ProductVariants[] {
  if (!variants) return [];
  return Array.isArray(variants) ? variants : [variants];
}

function getColorVariant(product: Product) {
  const variants = normalizeVariants(product.variants);
  if (variants.length === 0) return undefined;
  return getColorVariantDefinition({ variants });
}

export function resolveColorFeaturedImage(
  productImages: ProductImages,
  colorValue: string,
  product?: Product
): string | null {
  const productVariants = product?.variants
    ? {
        variants: normalizeVariants(product.variants),
      }
    : null;

  return resolveColorFeaturedImageFromUtils(
    productImages,
    colorValue,
    productVariants
  );
}

export function buildProductColorImageMap(
  product: Product,
  productImages: ProductImages
): Record<string, string> {
  const colorVariant = getColorVariant(product);
  if (!colorVariant) return {};

  const fallback = product.images[0] ?? productImages.featured ?? null;
  const map: Record<string, string> = {};
  const productVariants = {
    variants: normalizeVariants(product.variants),
  };

  for (const opt of colorVariant.options) {
    const value = opt.value ?? opt.label;
    const resolved = resolveColorFeaturedImageFromUtils(
      productImages,
      value,
      productVariants
    );
    if (resolved) {
      map[value] = resolved;
    } else if (fallback) {
      map[value] = fallback;
    }
  }

  return map;
}

export function getDefaultColorSwatchIndex(product: Product): number {
  const swatches = getProductColorSwatches(product);
  if (swatches.length === 0) return 0;

  const colorVariant = getColorVariant(product);
  const defaultValue = colorVariant?.default;
  if (!defaultValue) return 0;

  const idx = swatches.findIndex(
    (swatch) => swatch.value === defaultValue || swatch.label === defaultValue
  );
  return idx >= 0 ? idx : 0;
}
