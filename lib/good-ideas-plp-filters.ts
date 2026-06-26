import type { ActiveFilterChip } from "@/components/good-ideas/GoodIdeasActiveFilterChips";
import {
  getGoodIdeasCategoryLabel,
  getGoodIdeasProductLeafCategorySlug,
} from "@/lib/good-ideas-plp-categories";
import { getGoodIdeasCategoryPath } from "@/lib/good-ideas-categories";
import {
  formatGoodIdeasPriceFilterChipLabel,
  goodIdeasProductMatchesPrice,
  isGoodIdeasPriceFilterActive,
  type GoodIdeasPriceFilter,
} from "@/lib/good-ideas-plp-price";
import {
  buildGoodIdeasPreserveParams,
  buildGoodIdeasProductsListHref,
} from "@/lib/good-ideas-plp-segments";
import type { Product } from "@/lib/products";
import type { Locale } from "@/lib/i18n/config";

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function goodIdeasProductMatchesQuery(
  product: Product,
  locale: Locale,
  query: string,
  norm: typeof normalizeText = normalizeText
): boolean {
  if (!query) return true;
  const loc = product.translations?.[locale];
  const chunks: string[] = [
    product.id,
    product.slug ?? "",
    product.title,
    loc?.title ?? "",
    product.category,
    product.brand ?? "",
    product.description,
    loc?.description ?? "",
    product.shortDescription ?? "",
    loc?.shortDescription ?? "",
    ...(product.features ?? []),
    ...(loc?.features ?? []),
  ];
  const haystack = norm(chunks.filter(Boolean).join(" "));
  return haystack.includes(query);
}

export function goodIdeasProductMatchesCategory(
  product: Product,
  categorySlug: string | null
): boolean {
  if (!categorySlug) return true;
  const leafSlug = getGoodIdeasProductLeafCategorySlug(
    product.id,
    product.category
  );
  const path = getGoodIdeasCategoryPath(leafSlug);
  return path.some((c) => c.slug === categorySlug);
}

export function filterGoodIdeasProducts(
  products: Product[],
  opts: {
    locale: Locale;
    query?: string;
    categorySlug?: string | null;
    priceFilter?: GoodIdeasPriceFilter;
  }
): Product[] {
  const normQuery = normalizeText((opts.query ?? "").trim());
  const priceFilter = opts.priceFilter ?? { min: null, max: null };

  return products.filter((product) => {
    if (!goodIdeasProductMatchesQuery(product, opts.locale, normQuery)) {
      return false;
    }
    if (!goodIdeasProductMatchesCategory(product, opts.categorySlug ?? null)) {
      return false;
    }
    if (!goodIdeasProductMatchesPrice(product, priceFilter)) {
      return false;
    }
    return true;
  });
}

export function hasActiveGoodIdeasCatalogFilters(opts: {
  rawQuery: string;
  categorySlug: string | null;
  priceFilter: GoodIdeasPriceFilter;
}): boolean {
  return (
    Boolean(opts.rawQuery.trim()) ||
    Boolean(opts.categorySlug) ||
    isGoodIdeasPriceFilterActive(opts.priceFilter)
  );
}

export function buildGoodIdeasFilterChips(opts: {
  locale: Locale;
  categorySlug: string | null;
  rawQuery: string;
  sort?: string;
  priceFilter: GoodIdeasPriceFilter;
  t: (key: string, fallback?: string) => string;
}): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];
  const sort = opts.sort === "featured" ? undefined : opts.sort;
  const priceMin = opts.priceFilter.min ?? undefined;
  const priceMax = opts.priceFilter.max ?? undefined;

  if (opts.categorySlug) {
    chips.push({
      id: "category",
      label: getGoodIdeasCategoryLabel(opts.categorySlug, opts.t),
      removeHref: buildGoodIdeasProductsListHref(
        opts.locale,
        buildGoodIdeasPreserveParams({
          q: opts.rawQuery.trim() || undefined,
          sort,
          priceMin,
          priceMax,
        })
      ),
    });
  }

  if (isGoodIdeasPriceFilterActive(opts.priceFilter)) {
    chips.push({
      id: "price",
      label: formatGoodIdeasPriceFilterChipLabel(
        opts.priceFilter,
        opts.locale,
        opts.t
      ),
      removeHref: buildGoodIdeasProductsListHref(
        opts.locale,
        buildGoodIdeasPreserveParams({
          q: opts.rawQuery.trim() || undefined,
          sort,
          category: opts.categorySlug ?? undefined,
        })
      ),
    });
  }

  if (opts.rawQuery.trim()) {
    chips.push({
      id: "search",
      label: opts.rawQuery.trim(),
      removeHref: buildGoodIdeasProductsListHref(
        opts.locale,
        buildGoodIdeasPreserveParams({
          category: opts.categorySlug ?? undefined,
          sort,
          priceMin,
          priceMax,
        })
      ),
    });
  }

  return chips;
}

export { normalizeText };
export { resolveGoodIdeasCategoryParam } from "@/lib/good-ideas-plp-categories";
export { parseGoodIdeasPriceFilter } from "@/lib/good-ideas-plp-price";
