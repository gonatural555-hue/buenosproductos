import type { Category } from "@/lib/categories";

/** Cinco familias editoriales alineadas con las categorías padre del catálogo. */
export type CategoryHeroKind =
  | "fishing"
  | "mountain-snow"
  | "water-sports"
  | "outdoor-adventure"
  | "active-sports";

const KNOWN: readonly CategoryHeroKind[] = [
  "fishing",
  "mountain-snow",
  "water-sports",
  "outdoor-adventure",
  "active-sports",
] as const;

function isKnownParent(slug: string): slug is CategoryHeroKind {
  return (KNOWN as readonly string[]).includes(slug);
}

/**
 * Resuelve la familia visual (acento + gráfica) desde la categoría actual.
 * Las subcategorías heredan el tema del padre.
 */
export function resolveCategoryHeroKind(category: {
  slug: string;
  parentSlug?: string;
}): CategoryHeroKind {
  const root = category.parentSlug ?? category.slug;
  if (isKnownParent(root)) return root;
  if (category.slug.startsWith("fishing")) return "fishing";
  if (
    category.slug.includes("snow") ||
    category.slug.includes("ski") ||
    category.slug.includes("mountain")
  ) {
    return "mountain-snow";
  }
  if (
    category.slug.includes("water") ||
    category.slug.includes("surf") ||
    category.slug.includes("diving") ||
    category.slug.includes("swim")
  ) {
    return "water-sports";
  }
  if (
    category.slug.includes("outdoor") ||
    category.slug.includes("trek") ||
    category.slug.includes("camp") ||
    category.slug.includes("lighting")
  ) {
    return "outdoor-adventure";
  }
  if (
    category.slug.includes("cycling") ||
    category.slug.includes("running") ||
    category.slug.includes("active")
  ) {
    return "active-sports";
  }
  return "outdoor-adventure";
}

/**
 * Colores sólidos de los CTAs de segmento en `/products` (misma lógica que el título del hero de categoría).
 * `forest` = Fishing (#2A2E4B), `burgundy` = Mountain & snow, `burnt` = Water sports, `mustard` = Outdoor.
 */
export const PRODUCTS_CATALOG_CTA_STYLE = {
  forest: { bg: "#2A2E4B", fg: "#F4EBDD" },
  burgundy: { bg: "#6E1F28", fg: "#F4EBDD" },
  burnt: { bg: "#C9622B", fg: "#FFFFFF" },
  mustard: { bg: "#D9A441", fg: "#2E4A36" },
} as const;

export type ProductsCatalogCtaTone = keyof typeof PRODUCTS_CATALOG_CTA_STYLE;

/** Acento por familia: mismo hex que el botón correspondiente en la página Products. */
export const CATEGORY_HERO_ACCENT: Record<CategoryHeroKind, string> = {
  fishing: PRODUCTS_CATALOG_CTA_STYLE.forest.bg,
  "mountain-snow": PRODUCTS_CATALOG_CTA_STYLE.burgundy.bg,
  "water-sports": PRODUCTS_CATALOG_CTA_STYLE.burnt.bg,
  "outdoor-adventure": PRODUCTS_CATALOG_CTA_STYLE.mustard.bg,
  /** Sin CTA dedicado en Products; mismo tono “energía” que burnt. */
  "active-sports": PRODUCTS_CATALOG_CTA_STYLE.burnt.bg,
};

/** Color de texto sobre el CTA del hero de categoría (alineado con Products cuando aplica). */
export const CATEGORY_HERO_CTA_FG: Record<CategoryHeroKind, string> = {
  fishing: PRODUCTS_CATALOG_CTA_STYLE.forest.fg,
  "mountain-snow": PRODUCTS_CATALOG_CTA_STYLE.burgundy.fg,
  "water-sports": PRODUCTS_CATALOG_CTA_STYLE.burnt.fg,
  "outdoor-adventure": PRODUCTS_CATALOG_CTA_STYLE.mustard.fg,
  "active-sports": PRODUCTS_CATALOG_CTA_STYLE.burnt.fg,
};
