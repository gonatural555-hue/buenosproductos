/**
 * Jerarquía de categorías Good Products (padre → hijo → nieto).
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
  {
    slug: "celulares",
    name: "Celulares",
    description: "Accesorios y cuidado para smartphones.",
    parentSlug: "tech",
  },
  {
    slug: "robots-ia",
    name: "Robots IA",
    description: "Robots interactivos con inteligencia artificial para niños y hogar.",
    parentSlug: "tech",
  },
  {
    slug: "auriculares",
    name: "Auriculares",
    description: "Auriculares inalámbricos, deportivos y de uso diario.",
    parentSlug: "tech",
  },
  {
    slug: "herramientas-limpieza-celulares",
    name: "Herramientas de Limpieza Para Celulares",
    description:
      "Kits y herramientas para limpiar puertos, altavoces y auriculares.",
    parentSlug: "celulares",
  },
  {
    slug: "cocina",
    name: "Cocina",
    description: "Electrodomésticos y utensilios para cocina.",
    parentSlug: "home",
  },
  {
    slug: "accesorios-para-auto",
    name: "Accesorios para Auto",
    description: "Soportes, organizadores y accesorios para el vehículo.",
    parentSlug: "lifestyle",
  },
  {
    slug: "hervidores-electricos",
    name: "Hervidores eléctricos",
    description: "Hervidores y teteras eléctricas para hogar, oficina y viaje.",
    parentSlug: "home",
  },
  {
    slug: "cuidado-personal",
    name: "Cuidado personal",
    description: "Grooming, recortadores y accesorios de cuidado personal.",
    parentSlug: "home",
  },
];

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
