import {
  GOOD_IDEAS_CATEGORIES,
  getGoodIdeasCategoryBySlug,
  getGoodIdeasCategoryPath,
  type GoodIdeasCategory,
} from "@/lib/good-ideas-categories";
import { buildGoodIdeasProductsListHref } from "@/lib/good-ideas-plp-segments";
import type { Locale } from "@/lib/i18n/config";

export type GoodIdeasFilterCategoryNode = {
  slug: string;
  label: string;
  href: string;
  children?: GoodIdeasFilterCategoryNode[];
};

/** Slug de categoría hoja o padre asignado a un producto GI. */
export const GOOD_IDEAS_PRODUCT_CATEGORY_MAP: Record<string, string> = {
  "gi-tech-001": "robots-ia",
  "gi-tech-002": "accesorios-para-auto",
  "gi-tech-003": "accesorios-para-auto",
  "gi-tech-004": "herramientas-limpieza-celulares",
  "gi-hogar-001": "home",
  "gi-hogar-002": "hervidores-electricos",
  "gi-hogar-003": "hervidores-electricos",
  "gi-hogar-004": "home",
  "gi-hogar-005": "cocina",
  "gi-hogar-006": "cocina",
  "gi-hogar-007": "cocina",
  "gi-hogar-008": "cocina",
  "gi-lifestyle-001": "auriculares",
  "gi-lifestyle-002": "auriculares",
  "gi-lifestyle-003": "cuidado-personal",
  "gi-lifestyle-004": "cuidado-personal",
  "gi-regalos-001": "robots-ia",
};

/** `product.category` en catálogo → slug raíz GI. */
export const GI_PRODUCT_CATEGORY_TO_ROOT_SLUG: Record<string, string> = {
  Tech: "tech",
  Hogar: "home",
  Lifestyle: "lifestyle",
  tech: "tech",
  home: "home",
  lifestyle: "lifestyle",
};

export function getGoodIdeasProductLeafCategorySlug(
  productId: string,
  productCategory: string
): string {
  const mapped = GOOD_IDEAS_PRODUCT_CATEGORY_MAP[productId];
  if (mapped) return mapped;
  return (
    GI_PRODUCT_CATEGORY_TO_ROOT_SLUG[productCategory.trim()] ??
    productCategory.trim().toLowerCase()
  );
}

export function getGoodIdeasCategoryLabel(
  slug: string,
  t: (key: string, fallback?: string) => string
): string {
  const cat = getGoodIdeasCategoryBySlug(slug);
  return t(`goodIdeas.products.categories.names.${slug}`, cat?.name ?? slug);
}

function buildCategoryNode(
  category: GoodIdeasCategory,
  locale: Locale,
  t: (key: string, fallback?: string) => string,
  preserve: import("@/lib/good-ideas-plp-price").GoodIdeasListPreserveParams
): GoodIdeasFilterCategoryNode {
  const children = GOOD_IDEAS_CATEGORIES.filter(
    (c) => c.parentSlug === category.slug
  ).map((child) => buildCategoryNode(child, locale, t, preserve));

  return {
    slug: category.slug,
    label: getGoodIdeasCategoryLabel(category.slug, t),
    href: buildGoodIdeasProductsListHref(locale, {
      category: category.slug,
      q: preserve.q,
      sort: preserve.sort,
      brand: preserve.brand,
      priceMin: preserve.priceMin,
      priceMax: preserve.priceMax,
    }),
    children: children.length > 0 ? children : undefined,
  };
}

export function buildGoodIdeasFilterCategoryTree(
  locale: Locale,
  t: (key: string, fallback?: string) => string,
  opts?: import("@/lib/good-ideas-plp-price").GoodIdeasListPreserveParams
): GoodIdeasFilterCategoryNode[] {
  const roots = GOOD_IDEAS_CATEGORIES.filter((c) => !c.parentSlug);
  return roots.map((root) => buildCategoryNode(root, locale, t, opts ?? {}));
}

export function resolveGoodIdeasCategoryParam(
  raw: string | undefined
): string | null {
  if (!raw?.trim()) return null;
  const slug = raw.trim().toLowerCase();
  return getGoodIdeasCategoryBySlug(slug) ? slug : null;
}

export function getGoodIdeasProductCategoryPath(
  productId: string
): import("@/lib/good-ideas-categories").GoodIdeasCategory[] {
  const leaf = GOOD_IDEAS_PRODUCT_CATEGORY_MAP[productId];
  return leaf ? getGoodIdeasCategoryPath(leaf) : [];
}
