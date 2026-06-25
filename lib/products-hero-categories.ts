import type { CategoryHeroKind } from "@/lib/category-hero-theme";

const IMG = {
  fishing: "/assets/images/hero/products/fishing.webp",
  snow: "/assets/images/hero/products/snow.webp",
  surf: "/assets/images/hero/products/surf.webp",
  camping: "/assets/images/hero/products/camping.webp",
} as const;

/** Banners editoriales por categoría padre (páginas /category/[slug]). */
const CATEGORY_BANNER = {
  cycling: "/assets/images/categories/cycling/cycling-banner.webp",
  climbing: "/assets/images/categories/climbing/climbing.webp",
  running: "/assets/images/categories/running/running-banner.webp",
  travel: "/assets/images/categories/camping/camping-banner.webp",
  fishing: "/assets/images/categories/fishing/fishing-banner.webp",
  motorcyclist:
    "/assets/images/categories/motorcyclist/motorcyclist-banner.webp",
} as const;

export type ProductsHeroCategoryCard = {
  id: string;
  slug: string;
  titleKey: string;
  descriptionKey: string;
  ctaKey: string;
  image: string;
};

/** Carrusel hero /products — 8 tarjetas alineadas al header. */
export const PRODUCTS_HERO_CATEGORY_CARDS: ProductsHeroCategoryCard[] = [
  {
    id: "campamento-senderismo",
    slug: "campamento-senderismo",
    titleKey: "header.tabs.campHike",
    descriptionKey: "productsPage.heroCategoryCards.campamento.description",
    ctaKey: "productsPage.heroCategoryCards.campamento.cta",
    image: IMG.camping,
  },
  {
    id: "escalada",
    slug: "escalada",
    titleKey: "header.tabs.climb",
    descriptionKey: "productsPage.heroCategoryCards.escalada.description",
    ctaKey: "productsPage.heroCategoryCards.escalada.cta",
    image: IMG.snow,
  },
  {
    id: "ciclismo",
    slug: "ciclismo",
    titleKey: "header.tabs.cycle",
    descriptionKey: "productsPage.heroCategoryCards.ciclismo.description",
    ctaKey: "productsPage.heroCategoryCards.ciclismo.cta",
    image: IMG.camping,
  },
  {
    id: "agua",
    slug: "agua",
    titleKey: "header.tabs.water",
    descriptionKey: "productsPage.heroCategoryCards.agua.description",
    ctaKey: "productsPage.heroCategoryCards.agua.cta",
    image: IMG.surf,
  },
  {
    id: "running",
    slug: "running",
    titleKey: "header.tabs.run",
    descriptionKey: "productsPage.heroCategoryCards.running.description",
    ctaKey: "productsPage.heroCategoryCards.running.cta",
    image: IMG.snow,
  },
  {
    id: "nieve",
    slug: "nieve",
    titleKey: "header.tabs.snow",
    descriptionKey: "productsPage.heroCategoryCards.nieve.description",
    ctaKey: "productsPage.heroCategoryCards.nieve.cta",
    image: IMG.snow,
  },
  {
    id: "viaje",
    slug: "viaje",
    titleKey: "header.tabs.travel",
    descriptionKey: "productsPage.heroCategoryCards.viaje.description",
    ctaKey: "productsPage.heroCategoryCards.viaje.cta",
    image: IMG.camping,
  },
  {
    id: "pesca",
    slug: "fishing",
    titleKey: "header.tabs.fishing",
    descriptionKey: "productsPage.heroCategoryCards.fishing.description",
    ctaKey: "productsPage.heroCategoryCards.fishing.cta",
    image: IMG.fishing,
  },
];

/** Fondo hero por slug de categoría (páginas editoriales + subcategorías vía parentSlug). */
export const CATEGORY_HERO_BACKGROUND_BY_SLUG: Record<string, string> = {
  "campamento-senderismo": IMG.camping,
  escalada: CATEGORY_BANNER.climbing,
  ciclismo: CATEGORY_BANNER.cycling,
  agua: IMG.surf,
  running: CATEGORY_BANNER.running,
  nieve: IMG.snow,
  viaje: CATEGORY_BANNER.travel,
  "motorcyclist-accessories": CATEGORY_BANNER.motorcyclist,
  fishing: CATEGORY_BANNER.fishing,
  men: IMG.camping,
  women: IMG.camping,
  kids: IMG.camping,
  ofertas: IMG.camping,
};

const KIND_FALLBACK: Record<CategoryHeroKind, string> = {
  fishing: CATEGORY_BANNER.fishing,
  "mountain-snow": IMG.snow,
  "water-sports": IMG.surf,
  "outdoor-adventure": IMG.camping,
  "active-sports": IMG.camping,
};

export function getCategoryHeroBackgroundImage(
  kind: CategoryHeroKind,
  slug?: string,
  parentSlug?: string
): string {
  if (slug && CATEGORY_HERO_BACKGROUND_BY_SLUG[slug]) {
    return CATEGORY_HERO_BACKGROUND_BY_SLUG[slug]!;
  }
  if (parentSlug && CATEGORY_HERO_BACKGROUND_BY_SLUG[parentSlug]) {
    return CATEGORY_HERO_BACKGROUND_BY_SLUG[parentSlug]!;
  }
  return KIND_FALLBACK[kind];
}
