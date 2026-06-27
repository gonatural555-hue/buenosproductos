import type { Locale } from "@/lib/i18n/config";
import { goNaturalHomePath } from "@/lib/routing/brands";

export type HeaderUtilityLinkId = "shopGn" | "outlet" | "expertAdvice";

export type HeaderUtilityLink = {
  id: HeaderUtilityLinkId;
  /** Clave i18n: header.utility.{id} */
  labelKey: HeaderUtilityLinkId;
  href: string | ((locale: Locale) => string);
  /** Marca como activo (estilo REI “Shop REI” blanco). */
  isPrimary?: boolean;
};

export const HEADER_UTILITY_LINKS: HeaderUtilityLink[] = [
  {
    id: "shopGn",
    labelKey: "shopGn",
    href: (locale) => goNaturalHomePath(locale),
    isPrimary: true,
  },
  { id: "outlet", labelKey: "outlet", href: "#" },
  {
    id: "expertAdvice",
    labelKey: "expertAdvice",
    href: (locale) => `/${locale}/blog`,
  },
];

export function resolveUtilityHref(
  link: HeaderUtilityLink,
  locale: Locale
): string {
  return typeof link.href === "function" ? link.href(locale) : link.href;
}

export function isUtilityLinkActive(
  link: HeaderUtilityLink,
  locale: Locale,
  pathname: string
): boolean {
  const href = resolveUtilityHref(link, locale);
  if (!href || href === "#") return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Reparte items del dropdown en N columnas (relleno uniforme). */
export function distributeDropdownColumns<T>(
  items: T[],
  columnCount = 3
): T[][] {
  const columns: T[][] = Array.from({ length: columnCount }, () => []);
  if (items.length === 0) return columns;
  items.forEach((item, index) => {
    columns[index % columnCount]!.push(item);
  });
  return columns;
}

export const HEADER_CATEGORY_DROPDOWN_WIDTH_PX = 480;
