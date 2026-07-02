import {
  blogPath,
  homePath,
  isBlogListPath,
  isBlogPostPath,
  isHomePath,
  isProductsListPath,
  isProductPdpPath,
  productsPath,
} from "@/lib/routing/paths";
import { buildGoodIdeasProductsListHref } from "@/lib/good-ideas-plp-segments";
import { GI_CATALOG_SECTION_ID } from "@/lib/ui/goodideas-design";
import type { Locale } from "@/lib/i18n/config";

export type GiHeaderNavItem = {
  id: string;
  href: string;
  label: string;
};

type NavLabels = {
  home: string;
  products: string;
  categories: string;
  blog: string;
};

/**
 * Ítems de nav del header — solo destinos que ya existen en el sitio.
 * Ofertas / Novedades: sin ruta dedicada ni segmento estable → omitidos.
 */
export function buildGiHeaderNavItems(
  locale: Locale,
  labels: NavLabels
): GiHeaderNavItem[] {
  return [
    { id: "home", href: homePath(locale), label: labels.home },
    { id: "products", href: productsPath(locale), label: labels.products },
    {
      id: "categories",
      href: `${productsPath(locale)}#${GI_CATALOG_SECTION_ID}`,
      label: labels.categories,
    },
    { id: "blog", href: blogPath(locale), label: labels.blog },
  ];
}

export function isGiHeaderNavItemActive(
  pathname: string,
  item: GiHeaderNavItem,
  hash = ""
): boolean {
  const path = pathname.split("?")[0] ?? "";
  const normalizedHash = hash.replace(/^#/, "");

  switch (item.id) {
    case "home":
      return isHomePath(path);
    case "products":
      return (
        (isProductsListPath(path) || isProductPdpPath(path)) &&
        normalizedHash !== GI_CATALOG_SECTION_ID
      );
    case "categories":
      return (
        (isProductsListPath(path) || isProductPdpPath(path)) &&
        normalizedHash === GI_CATALOG_SECTION_ID
      );
    case "blog":
      return isBlogListPath(path) || isBlogPostPath(path);
    default:
      return path === item.href.split("#")[0];
  }
}

/** Utilidad exportada por si se añade Ofertas vía PLP (`?priceMax=`) en el futuro. */
export function giHeaderOffersHref(locale: Locale): string {
  return buildGoodIdeasProductsListHref(locale, { priceMax: 15 });
}
