import { buildGoodIdeasProductsListHref } from "@/lib/good-ideas-plp-segments";
import type { GoodIdeasListPreserveParams } from "@/lib/good-ideas-plp-price";
import type { Product } from "@/lib/product-types";
import type { Locale } from "@/lib/i18n/config";

const BLOCKED_BRAND_LABELS = new Set(["good products"]);

function brandToSlug(brand: string): string {
  return brand
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isGoodIdeasFilterableBrand(
  brand: string | undefined
): brand is string {
  const trimmed = brand?.trim();
  if (!trimmed) return false;
  return !BLOCKED_BRAND_LABELS.has(trimmed.toLowerCase());
}

export function goodIdeasProductMatchesBrand(
  product: Product,
  brandSlug: string | null
): boolean {
  if (!brandSlug) return true;
  if (!isGoodIdeasFilterableBrand(product.brand)) return false;
  return brandToSlug(product.brand) === brandSlug;
}

export type GoodIdeasFilterBrandOption = {
  slug: string;
  label: string;
  href: string;
};

export function getGoodIdeasCatalogBrands(
  products: Product[]
): Array<{ slug: string; label: string }> {
  const bySlug = new Map<string, string>();
  for (const product of products) {
    if (!isGoodIdeasFilterableBrand(product.brand)) continue;
    const slug = brandToSlug(product.brand);
    if (!bySlug.has(slug)) bySlug.set(slug, product.brand.trim());
  }
  return [...bySlug.entries()]
    .map(([slug, label]) => ({ slug, label }))
    .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" }));
}

export function resolveGoodIdeasBrandParam(
  raw: string | undefined,
  products: Product[]
): string | null {
  if (!raw?.trim()) return null;
  const slug = raw.trim().toLowerCase();
  return getGoodIdeasCatalogBrands(products).some((b) => b.slug === slug)
    ? slug
    : null;
}

export function getGoodIdeasBrandLabel(
  brandSlug: string,
  products: Product[]
): string {
  return (
    getGoodIdeasCatalogBrands(products).find((b) => b.slug === brandSlug)
      ?.label ?? brandSlug
  );
}

export function resolveGoodIdeasProductBrandLink(
  product: Product,
  locale: Locale
): { label: string; href: string } | null {
  if (!isGoodIdeasFilterableBrand(product.brand)) return null;
  const slug = brandToSlug(product.brand);
  return {
    label: product.brand.trim(),
    href: buildGoodIdeasProductsListHref(locale, { brand: slug }),
  };
}

export function buildGoodIdeasFilterBrandOptions(
  locale: Locale,
  products: Product[],
  preserve: GoodIdeasListPreserveParams
): GoodIdeasFilterBrandOption[] {
  return getGoodIdeasCatalogBrands(products).map(({ slug, label }) => ({
    slug,
    label,
    href: buildGoodIdeasProductsListHref(locale, {
      ...preserve,
      brand: slug,
    }),
  }));
}
