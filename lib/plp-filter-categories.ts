import { CATEGORIES, type Category } from "@/lib/categories";
import { buildProductsListHref } from "@/lib/products-page-segments";
import type { FilterCategoryGroup } from "@/components/products/ProductFilterSidebar";
import type { Locale } from "@/lib/i18n/config";

const PARENT_SLUGS = [
  "fishing",
  "mountain-snow",
  "water-sports",
  "outdoor-adventure",
  "active-sports",
] as const;

export function buildCatalogFilterCategories(
  locale: Locale,
  t: (key: string, fallback?: string) => string,
  opts?: { q?: string; sort?: string; basePath?: "products" | "category" }
): FilterCategoryGroup[] {
  const parents = CATEGORIES.filter((c) =>
    PARENT_SLUGS.includes(c.slug as (typeof PARENT_SLUGS)[number])
  );

  return parents.map((parent) => {
    const children = CATEGORIES.filter((c) => c.parentSlug === parent.slug);
    return {
      slug: parent.slug,
      label: t(`categories.names.${parent.slug}`, parent.name),
      href: buildParentCategoryHref(locale, parent, opts),
      children: children.map((child) => ({
        slug: child.slug,
        label: t(`categories.names.${child.slug}`, child.name),
        href: buildCategoryPageHref(locale, child.slug, opts?.sort),
      })),
    };
  });
}

function buildCategoryPageHref(
  locale: Locale,
  slug: string,
  sort?: string
) {
  const params = new URLSearchParams();
  if (sort && sort !== "featured") params.set("sort", sort);
  const qs = params.toString();
  return `/${locale}/category/${slug}${qs ? `?${qs}` : ""}`;
}

function buildParentCategoryHref(
  locale: Locale,
  category: Category,
  opts?: { q?: string; sort?: string; basePath?: "products" | "category" }
) {
  if (opts?.basePath === "category") {
    return buildCategoryPageHref(locale, category.slug, opts.sort);
  }

  const alias =
    category.slug === "outdoor-adventure" ? "outdoor" : category.slug;

  return buildProductsListHref(locale, {
    q: opts?.q,
    sort: opts?.sort,
    category:
      category.slug === "outdoor-adventure" ? "outdoor" : alias,
  });
}
