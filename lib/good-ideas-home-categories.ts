import { buildGoodIdeasProductsListHref } from "@/lib/good-ideas-plp-segments";
import { getGoodIdeasHomeCategoryImagePrimary } from "@/lib/good-ideas-home-category-images";
import type { Locale } from "@/lib/i18n/config";

/** Slugs reales de `GOOD_IDEAS_CATEGORIES` — orden editorial home (sin Auto). */
export const GOOD_IDEAS_HOME_CATEGORY_SLUGS = [
  "home",
  "tech",
  "cocina",
  "lifestyle",
] as const;

export type GoodIdeasHomeCategorySlug =
  (typeof GOOD_IDEAS_HOME_CATEGORY_SLUGS)[number];

export type GoodIdeasHomeCategoryIconId =
  | "home"
  | "tech"
  | "cocina"
  | "lifestyle";

export type GoodIdeasHomeCategoryTileData = {
  slug: GoodIdeasHomeCategorySlug;
  href: string;
  iconId: GoodIdeasHomeCategoryIconId;
  image: string;
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
  lifestyle: "lifestyle",
};

export function resolveGoodIdeasHomeCategoryTiles(
  locale: Locale
): GoodIdeasHomeCategoryTileData[] {
  return GOOD_IDEAS_HOME_CATEGORY_SLUGS.map((slug) => ({
    slug,
    href: buildGoodIdeasProductsListHref(locale, { category: slug }),
    iconId: SLUG_TO_ICON[slug],
    image: getGoodIdeasHomeCategoryImagePrimary(slug),
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
    lifestyle: tile("lifestyle"),
  };
}
