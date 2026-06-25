/**
 * Navegación editorial del header (estilo REI) → slugs reales de Go Natural.
 * Fuente única para pestañas desktop y acordeón móvil.
 */

export type HeaderNavTabId =
  | "camp-hike"
  | "climb"
  | "cycle"
  | "water"
  | "run"
  | "snow"
  | "travel"
  | "fishing"
  | "men"
  | "women"
  | "kids";

export type HeaderNavDropdownItem = {
  /** Slug de subcategoría en lib/categories (href /category/{slug}). */
  categorySlug: string;
  /** Si se define, usa header.tabs.subs.{key} en lugar de categories.names. */
  labelKey?: string;
};

export type HeaderNavTab = {
  id: HeaderNavTabId;
  /** Clave i18n: header.tabs.{key} */
  labelKey: string;
  /** Slug padre para “Ver todo”. */
  parentSlug: string;
  /** Subcategorías o enlaces editoriales del dropdown. */
  items: HeaderNavDropdownItem[];
};

/** Cycle vs Run: páginas editoriales dedicadas por pestaña del header. */
export const HEADER_NAV_TABS: HeaderNavTab[] = [
  {
    id: "camp-hike",
    labelKey: "campHike",
    parentSlug: "campamento-senderismo",
    items: [
      { categorySlug: "trekking" },
      { categorySlug: "camping-survival-gear" },
      { categorySlug: "outdoor-lighting" },
    ],
  },
  {
    id: "climb",
    labelKey: "climb",
    parentSlug: "escalada",
    items: [{ categorySlug: "trekking" }],
  },
  {
    id: "cycle",
    labelKey: "cycle",
    parentSlug: "ciclismo",
    items: [
      { categorySlug: "cycling-running", labelKey: "cycleEyewear" },
      { categorySlug: "cycling-running", labelKey: "cycleApparel" },
      { categorySlug: "cycling-running", labelKey: "cycleEquipment" },
    ],
  },
  {
    id: "water",
    labelKey: "water",
    parentSlug: "agua",
    items: [
      { categorySlug: "surfing" },
      { categorySlug: "diving-swimming-equipment" },
    ],
  },
  {
    id: "run",
    labelKey: "run",
    parentSlug: "running",
    items: [
      { categorySlug: "cycling-running", labelKey: "runningWear" },
      { categorySlug: "cycling-running", labelKey: "runningAccessories" },
    ],
  },
  {
    id: "snow",
    labelKey: "snow",
    parentSlug: "nieve",
    items: [{ categorySlug: "ski-snowboard" }],
  },
  {
    id: "travel",
    labelKey: "travel",
    parentSlug: "viaje",
    items: [
      { categorySlug: "camping-survival-gear" },
      { categorySlug: "motorcyclist-accessories" },
    ],
  },
  {
    id: "fishing",
    labelKey: "fishing",
    parentSlug: "fishing",
    items: [
      { categorySlug: "fishing-equipment" },
      { categorySlug: "fishing-gadgets" },
    ],
  },
  {
    id: "men",
    labelKey: "men",
    parentSlug: "men",
    items: [],
  },
  {
    id: "women",
    labelKey: "women",
    parentSlug: "women",
    items: [],
  },
  {
    id: "kids",
    labelKey: "kids",
    parentSlug: "kids",
    items: [],
  },
];

export function getHeaderNavTabs(): HeaderNavTab[] {
  return HEADER_NAV_TABS;
}

/** Resuelve qué pestaña está activa según /category/[slug]. */
export function getActiveHeaderNavTabId(
  categorySlug: string | null
): HeaderNavTabId | null {
  if (!categorySlug) return null;
  for (const tab of HEADER_NAV_TABS) {
    if (tab.parentSlug === categorySlug) return tab.id;
    if (tab.items.some((item) => item.categorySlug === categorySlug)) {
      return tab.id;
    }
  }
  return null;
}

export function parseCategorySlugFromPathname(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  const idx = segments.indexOf("category");
  if (idx === -1 || !segments[idx + 1]) return null;
  return segments[idx + 1] ?? null;
}
