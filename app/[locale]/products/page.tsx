import Link from "next/link";
import { getProducts, type Product } from "@/lib/products";
import SortingBar from "@/components/products/SortingBar";
import ProductsCatalogLayout from "@/components/products/ProductsCatalogLayout";
import ProductCardSimple from "@/components/ProductCardSimple";
import { getMessages } from "@/lib/i18n/messages";
import { createTranslator } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import {
  getProductsByCategorySlug,
  resolveProductsCategoryParam,
} from "@/lib/categories";
import { premiumPrimaryCtaClass } from "@/lib/ui/premium-cta-classes";
import { sortProductsList } from "@/lib/products-page-segments";
import { buildCatalogFilterCategories } from "@/lib/plp-filter-categories";
import { buildProductsPageFilterChips } from "@/lib/plp-active-filters";
import { getColorImageMapsForProducts } from "@/lib/plp-product-color-images";

export const dynamic = "force-dynamic";

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function productMatchesQuery(
  product: Product,
  locale: Locale,
  query: string,
  norm: typeof normalizeText
): boolean {
  if (!query) return true;
  const loc = product.translations?.[locale];
  const chunks: string[] = [
    product.id,
    product.slug ?? "",
    product.title,
    loc?.title ?? "",
    product.category,
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

const SORT_KEYS = ["featured", "price-asc", "price-desc", "name-asc"] as const;

function parseSort(raw: string | undefined): (typeof SORT_KEYS)[number] {
  if (raw && SORT_KEYS.includes(raw as (typeof SORT_KEYS)[number])) {
    return raw as (typeof SORT_KEYS)[number];
  }
  return "featured";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const seo = messages.seo?.products;

  return buildMetadata({
    locale,
    title: seo?.title,
    description: seo?.description,
    pathByLocale: {
      en: "/en/products",
      es: "/es/products",
      fr: "/fr/products",
      it: "/it/products",
    },
    ogImage: "/assets/images/hero/productsbanner.webp",
  });
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams?: Promise<{
    q?: string;
    sort?: string;
    category?: string;
  }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const t = createTranslator(messages);
  const sp = searchParams != null ? await searchParams : {};

  const rawQuery = typeof sp.q === "string" ? sp.q : "";
  const query = normalizeText(rawQuery.trim());
  const sort = parseSort(typeof sp.sort === "string" ? sp.sort : undefined);

  const categoryQuery =
    typeof sp.category === "string" ? sp.category.trim() : "";
  const categorySlug = resolveProductsCategoryParam(
    categoryQuery || undefined
  );

  const allProducts = getProducts();
  const scoped = categorySlug
    ? getProductsByCategorySlug(categorySlug)
    : allProducts;
  const filteredBySearch = query
    ? scoped.filter((product) =>
        productMatchesQuery(product, locale, query, normalizeText)
      )
    : scoped;
  const displayProducts = sortProductsList(
    filteredBySearch,
    sort === "featured" ? undefined : sort,
    locale
  );
  const colorImageMaps = await getColorImageMapsForProducts(displayProducts);

  const hasActiveSearch = rawQuery.trim().length > 0;

  const sortOptions = [
    { value: "featured", label: t("productsPage.sortFeatured") },
    { value: "price-asc", label: t("productsPage.sortPriceAsc") },
    { value: "price-desc", label: t("productsPage.sortPriceDesc") },
    { value: "name-asc", label: t("productsPage.sortNameAsc") },
  ];

  const cardLabels = {
    viewProduct: t("common.viewProduct"),
    addToCart: t("common.addToCart"),
    addNow: t("common.addNow"),
    noImage: t("common.noImage"),
    newColor: t("productsPage.badgeNewColor"),
    salePercentTemplate: t("productsPage.badgeSalePercent"),
  };

  const categoryLabel = categorySlug
    ? t(`categories.names.${categorySlug}`, categorySlug)
    : undefined;

  const activeFilterChips = buildProductsPageFilterChips({
    locale,
    categorySlug,
    categoryQuery,
    categoryLabel,
    rawQuery,
    sort,
  });

  const filterCategories = buildCatalogFilterCategories(locale, t, {
    q: rawQuery.trim() || undefined,
    sort: sort === "featured" ? undefined : sort,
  });

  const attributeLabels = {
    brands: t("productsPage.filterBrands"),
    price: t("productsPage.filterPrice"),
    sizes: t("productsPage.filterSizes"),
    color: t("productsPage.filterColor"),
    sale: t("productsPage.filterSale"),
  };

  return (
    <main className="relative flex min-h-screen flex-col overflow-x-hidden bg-gn-page-bg text-dark-base">
      <ProductsCatalogLayout
        visualStyle="patagonia"
        surface="white"
        showIntro={false}
        title={t("productsPage.catalogTitle")}
        description={t("productsPage.catalogDescription")}
        filtersLabel={t("productsPage.filtersLabel")}
        closeFiltersLabel={t("productsPage.closeFilters")}
        categories={filterCategories}
        activeCategorySlug={categorySlug}
        attributeLabels={attributeLabels}
        activeFilterChips={activeFilterChips}
        clearAllFiltersHref={`/${locale}/products`}
        clearAllFiltersLabel={t("productsPage.clearAllFilters")}
        sortBar={
          <SortingBar
            locale={locale}
            q={rawQuery.trim() || undefined}
            sort={sort}
            category={categorySlug ? categoryQuery || undefined : undefined}
            label={t("productsPage.sortLabel")}
            options={sortOptions}
          />
        }
      >
        {hasActiveSearch && displayProducts.length === 0 ? (
          <div className="col-span-2 px-6 py-14 text-center lg:col-span-3">
            <p className="font-inter text-lg text-black">
              {t("productsPage.searchNoResults", "")}
            </p>
            <p className="mx-auto mt-3 max-w-md font-inter text-sm leading-relaxed text-[#666666]">
              {t("productsPage.searchNoResultsHint", "")}
            </p>
            <Link
              href={`/${locale}/products`}
              className={`${premiumPrimaryCtaClass} mt-10`}
            >
              {t("productsPage.searchViewAll", "")}
            </Link>
          </div>
        ) : (
          displayProducts.map((product) => (
            <ProductCardSimple
              key={product.id}
              product={product}
              locale={locale}
              variant="patagonia"
              labels={cardLabels}
              colorImages={colorImageMaps[product.id]}
              analyticsListName="all_products"
            />
          ))
        )}
      </ProductsCatalogLayout>
    </main>
  );
}
