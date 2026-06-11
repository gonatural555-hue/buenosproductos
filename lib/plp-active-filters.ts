import type { ActiveFilterChip } from "@/components/products/ActiveFilterChips";
import { buildProductsListHref } from "@/lib/products-page-segments";
import type { Locale } from "@/lib/i18n/config";

export function buildProductsPageFilterChips(opts: {
  locale: Locale;
  categorySlug: string | null;
  categoryQuery: string;
  categoryLabel?: string;
  rawQuery: string;
  sort?: string;
}): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];
  const sort = opts.sort === "featured" ? undefined : opts.sort;

  if (opts.categorySlug && opts.categoryLabel) {
    chips.push({
      id: "category",
      label: opts.categoryLabel,
      removeHref: buildProductsListHref(opts.locale, {
        q: opts.rawQuery.trim() || undefined,
        sort,
      }),
    });
  }

  if (opts.rawQuery.trim()) {
    chips.push({
      id: "search",
      label: opts.rawQuery.trim(),
      removeHref: buildProductsListHref(opts.locale, {
        category: opts.categoryQuery || undefined,
        sort,
      }),
    });
  }

  return chips;
}

export function buildCategoryPageFilterChips(opts: {
  locale: Locale;
  slug: string;
  categoryLabel: string;
  sort?: string;
}): ActiveFilterChip[] {
  const sort = opts.sort === "featured" ? undefined : opts.sort;
  const params = sort ? `?sort=${sort}` : "";

  return [
    {
      id: "category",
      label: opts.categoryLabel,
      removeHref: `/${opts.locale}/products${params}`,
    },
  ];
}
