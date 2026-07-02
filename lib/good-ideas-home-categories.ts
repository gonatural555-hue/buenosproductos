import { getGoodIdeasProducts } from "@/lib/good-ideas-products";
import { resolveGoodIdeasProductCardImage } from "@/lib/good-ideas-product-images";
import { goodIdeasProductMatchesCategory } from "@/lib/good-ideas-plp-filters";
import { buildGoodIdeasProductsListHref } from "@/lib/good-ideas-plp-segments";
import type { Locale } from "@/lib/i18n/config";

/** Slugs reales de `GOOD_IDEAS_CATEGORIES` — orden editorial home. */
export const GOOD_IDEAS_HOME_CATEGORY_SLUGS = [
  "home",
  "tech",
  "cocina",
  "accesorios-para-auto",
  "lifestyle",
] as const;

export type GoodIdeasHomeCategorySlug =
  (typeof GOOD_IDEAS_HOME_CATEGORY_SLUGS)[number];

export type GoodIdeasHomeCategoryIconId =
  | "home"
  | "tech"
  | "cocina"
  | "auto"
  | "lifestyle";

export type GoodIdeasHomeCategoryTileData = {
  slug: GoodIdeasHomeCategorySlug;
  href: string;
  iconId: GoodIdeasHomeCategoryIconId;
  image?: string;
};

export type GoodIdeasHomeCategoryTileCopy = {
  title: string;
  description: string;
};

const SLUG_TO_ICON: Record<
  GoodIdeasHomeCategorySlug,
  GoodIdeasHomeCategoryIconId
> = {
  home: "home",
  tech: "tech",
  cocina: "cocina",
  "accesorios-para-auto": "auto",
  lifestyle: "lifestyle",
};

function resolveCategoryRepresentativeImage(
  categorySlug: GoodIdeasHomeCategorySlug
): string | undefined {
  for (const product of getGoodIdeasProducts()) {
    if (!goodIdeasProductMatchesCategory(product, categorySlug)) continue;
    const image = resolveGoodIdeasProductCardImage(product.id);
    if (image) return image;
  }
  return undefined;
}

export function resolveGoodIdeasHomeCategoryTiles(
  locale: Locale
): GoodIdeasHomeCategoryTileData[] {
  return GOOD_IDEAS_HOME_CATEGORY_SLUGS.map((slug) => ({
    slug,
    href: buildGoodIdeasProductsListHref(locale, { category: slug }),
    iconId: SLUG_TO_ICON[slug],
    image: resolveCategoryRepresentativeImage(slug),
  }));
}

export function buildGoodIdeasHomeCategoryTileCopyMap(
  t: (key: string) => string
): Record<GoodIdeasHomeCategorySlug, GoodIdeasHomeCategoryTileCopy> {
  const tile = (slug: GoodIdeasHomeCategorySlug) => ({
    title: t(`goodIdeas.shopByCategory.tiles.${slug}.title`),
    description: t(`goodIdeas.shopByCategory.tiles.${slug}.description`),
  });

  return {
    home: tile("home"),
    tech: tile("tech"),
    cocina: tile("cocina"),
    "accesorios-para-auto": tile("accesorios-para-auto"),
    lifestyle: tile("lifestyle"),
  };
}
