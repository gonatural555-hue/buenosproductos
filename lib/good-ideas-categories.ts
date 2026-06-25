/**
 * Jerarquía de categorías Good Products (padre → hijo → nieto).
 * El filtro principal del hero sigue usando `category` en el producto (Tech, Hogar, …).
 */

export interface GoodIdeasCategory {
  slug: string;
  name: string;
  description?: string;
  parentSlug?: string;
}

export const GOOD_IDEAS_CATEGORIES: GoodIdeasCategory[] = [
  { slug: "tech", name: "Tech", description: "Tecnología, gadgets y accesorios." },
  { slug: "home", name: "Hogar", description: "Hogar, cocina y confort." },
  { slug: "lifestyle", name: "Lifestyle", description: "Estilo de vida y uso diario." },
  { slug: "gifts", name: "Regalos", description: "Ideas para regalar." },
  // Tech → Celulares
  {
    slug: "celulares",
    name: "Celulares",
    description: "Accesorios y cuidado para smartphones.",
    parentSlug: "tech",
  },
  {
    slug: "herramientas-limpieza-celulares",
    name: "Herramientas de Limpieza Para Celulares",
    description:
      "Kits y herramientas para limpiar puertos, altavoces y auriculares.",
    parentSlug: "celulares",
  },
];

/** Producto → slug de categoría hoja (nieto o hijo). */
export const GOOD_IDEAS_PRODUCT_CATEGORY_MAP: Record<string, string> = {
  "gi-tech-004": "herramientas-limpieza-celulares",
};

export function getGoodIdeasCategoryBySlug(
  slug: string
): GoodIdeasCategory | undefined {
  return GOOD_IDEAS_CATEGORIES.find((c) => c.slug === slug);
}

export function getGoodIdeasCategoryPath(leafSlug: string): GoodIdeasCategory[] {
  const path: GoodIdeasCategory[] = [];
  let current = getGoodIdeasCategoryBySlug(leafSlug);
  while (current) {
    path.unshift(current);
    current = current.parentSlug
      ? getGoodIdeasCategoryBySlug(current.parentSlug)
      : undefined;
  }
  return path;
}

export function getGoodIdeasProductCategoryPath(
  productId: string
): GoodIdeasCategory[] {
  const leaf = GOOD_IDEAS_PRODUCT_CATEGORY_MAP[productId];
  return leaf ? getGoodIdeasCategoryPath(leaf) : [];
}
