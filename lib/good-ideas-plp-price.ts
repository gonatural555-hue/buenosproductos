import {
  DEFAULT_DISPLAY_CURRENCY,
  EXCHANGE_RATES_FROM_USD,
} from "@/lib/currency/config";
import { formatDisplayMoney } from "@/lib/currency/format";
import type { Product } from "@/lib/product-types";
import type { Locale } from "@/lib/i18n/config";

export type GoodIdeasPriceFilter = {
  min: number | null;
  max: number | null;
};

export type GoodIdeasListPreserveParams = {
  q?: string;
  sort?: string;
  category?: string;
  brand?: string;
  priceMin?: number;
  priceMax?: number;
};

export type GoodIdeasPricePreset = {
  id: string;
  min: number | null;
  max: number | null;
};

/** Rangos en USD (coincide con `product.price` del catálogo). */
export const GOOD_IDEAS_PRICE_PRESETS: GoodIdeasPricePreset[] = [
  { id: "under-15", min: null, max: 15 },
  { id: "15-50", min: 15, max: 50 },
  { id: "50-100", min: 50, max: 100 },
  { id: "over-100", min: 100, max: null },
];

function parseUsdParam(raw: string | undefined): number | null {
  if (raw == null || raw.trim() === "") return null;
  const n = Number.parseFloat(raw.trim());
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

export function parseGoodIdeasPriceFilter(
  priceMin?: string,
  priceMax?: string
): GoodIdeasPriceFilter {
  const min = parseUsdParam(priceMin);
  const max = parseUsdParam(priceMax);
  if (min != null && max != null && min > max) {
    return { min: max, max: min };
  }
  return { min, max };
}

export function goodIdeasProductMatchesPrice(
  product: Product,
  filter: GoodIdeasPriceFilter
): boolean {
  if (filter.min == null && filter.max == null) return true;
  if (filter.min != null && product.price < filter.min) return false;
  if (filter.max != null && product.price > filter.max) return false;
  return true;
}

export function isGoodIdeasPriceFilterActive(
  filter: GoodIdeasPriceFilter
): boolean {
  return filter.min != null || filter.max != null;
}

export function isGoodIdeasPricePresetActive(
  filter: GoodIdeasPriceFilter,
  preset: GoodIdeasPricePreset
): boolean {
  return filter.min === preset.min && filter.max === preset.max;
}

export function formatGoodIdeasPriceFilterChipLabel(
  filter: GoodIdeasPriceFilter,
  locale: Locale,
  t: (key: string, fallback?: string) => string
): string {
  const fmt = (usd: number) =>
    formatDisplayMoney(
      usd,
      DEFAULT_DISPLAY_CURRENCY,
      EXCHANGE_RATES_FROM_USD,
      locale
    );

  if (filter.min != null && filter.max != null) {
    return t("goodIdeas.products.priceChipRange", "")
      .replace("{min}", fmt(filter.min))
      .replace("{max}", fmt(filter.max));
  }
  if (filter.min != null) {
    return t("goodIdeas.products.priceChipFrom", "")
      .replace("{min}", fmt(filter.min));
  }
  if (filter.max != null) {
    return t("goodIdeas.products.priceChipUpTo", "")
      .replace("{max}", fmt(filter.max));
  }
  return t("goodIdeas.products.filterPrice", "Price");
}

export function getGoodIdeasCatalogPriceBounds(products: Product[]): {
  min: number;
  max: number;
} {
  if (products.length === 0) return { min: 0, max: 0 };
  let min = products[0]!.price;
  let max = products[0]!.price;
  for (const p of products) {
    if (p.price < min) min = p.price;
    if (p.price > max) max = p.price;
  }
  return { min, max };
}
