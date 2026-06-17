import type { Product } from "@/lib/products";
import { getProductBrandLabel } from "@/lib/plp-card-meta";

/** Slug URL-safe para rutas de marca. */
export function brandToSlug(brand: string): string {
  return brand
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Marca visible en PDP: campo opcional `brand`, token inicial del título, o categoría.
 */
export function resolveProductBrand(product: Pick<Product, "title" | "category"> & { brand?: string }): string {
  const explicit = product.brand?.trim();
  if (explicit) return explicit;

  const titleBrand = product.title.match(/^([A-Z][A-Za-z0-9&.'-]+(?:\s+[A-Z][a-z]+)?)\b/);
  if (titleBrand?.[1] && titleBrand[1].length >= 3) {
    const token = titleBrand[1];
    if (!/^(GN|ABS|USB|LED|GPS|UV|EU|IPX)$/i.test(token)) {
      return token;
    }
  }

  return getProductBrandLabel(product as Product);
}

export function getBrandPageHref(locale: string, brand: string): string {
  return `/${locale}/brands/${brandToSlug(brand)}`;
}

export function productMatchesBrandSlug(
  product: Pick<Product, "title" | "category"> & { brand?: string },
  slug: string
): boolean {
  return brandToSlug(resolveProductBrand(product)) === slug;
}
