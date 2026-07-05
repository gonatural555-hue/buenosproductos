import type { GoodIdeasHomeCategorySlug } from "@/lib/good-ideas-home-categories";

/**
 * Bases de archivo en `public/assets/images/` (sin extensión).
 * Archivos esperados: categoria-home, categoria-tech, categoria-kitchen, categoria-lifestyle
 */
export const GOOD_IDEAS_HOME_CATEGORY_IMAGE_BASE: Record<
  GoodIdeasHomeCategorySlug,
  string
> = {
  home: "/assets/images/categoria-home",
  tech: "/assets/images/categoria-tech",
  cocina: "/assets/images/categoria-kitchen",
  lifestyle: "/assets/images/categoria-lifestyle",
};

export const GOOD_IDEAS_HOME_CATEGORY_IMAGE_EXTENSIONS = [
  "webp",
  "png",
  "jpg",
  "jpeg",
] as const;

export function getGoodIdeasHomeCategoryImageCandidates(
  slug: GoodIdeasHomeCategorySlug
): string[] {
  const base = GOOD_IDEAS_HOME_CATEGORY_IMAGE_BASE[slug];
  return GOOD_IDEAS_HOME_CATEGORY_IMAGE_EXTENSIONS.map((ext) => `${base}.${ext}`);
}

export function getGoodIdeasHomeCategoryImagePrimary(
  slug: GoodIdeasHomeCategorySlug
): string {
  return getGoodIdeasHomeCategoryImageCandidates(slug)[0];
}
