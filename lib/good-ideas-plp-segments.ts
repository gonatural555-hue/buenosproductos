import { productsPath } from "@/lib/routing/paths";
import type { GoodIdeasListPreserveParams } from "@/lib/good-ideas-plp-price";
import type { Locale } from "@/lib/i18n/config";

export function buildGoodIdeasProductsListHref(
  locale: Locale,
  opts?: GoodIdeasListPreserveParams
): string {
  const base = productsPath(locale);
  const params = new URLSearchParams();
  if (opts?.q?.trim()) params.set("q", opts.q.trim());
  if (opts?.category?.trim()) params.set("category", opts.category.trim());
  if (opts?.brand?.trim()) params.set("brand", opts.brand.trim());
  if (opts?.sort && opts.sort !== "featured") params.set("sort", opts.sort);
  if (opts?.priceMin != null && Number.isFinite(opts.priceMin)) {
    params.set("priceMin", String(opts.priceMin));
  }
  if (opts?.priceMax != null && Number.isFinite(opts.priceMax)) {
    params.set("priceMax", String(opts.priceMax));
  }
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export function buildGoodIdeasPreserveParams(opts: {
  q?: string;
  sort?: string;
  category?: string | null;
  brand?: string | null;
  priceMin?: number | null;
  priceMax?: number | null;
}): GoodIdeasListPreserveParams {
  const sort = opts.sort === "featured" ? undefined : opts.sort;
  return {
    q: opts.q?.trim() || undefined,
    sort,
    category: opts.category?.trim() || undefined,
    brand: opts.brand?.trim() || undefined,
    priceMin: opts.priceMin ?? undefined,
    priceMax: opts.priceMax ?? undefined,
  };
}
