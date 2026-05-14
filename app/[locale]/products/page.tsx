import Link from "next/link";
import { getProducts, type Product } from "@/lib/products";
import ProductsHero from "@/components/products/ProductsHero";
import CategorySelector from "@/components/products/CategorySelector";
import SortingBar from "@/components/products/SortingBar";
import ProductsEditorialGrid from "@/components/products/ProductsEditorialGrid";
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

export const dynamic = "force-dynamic";

function interpolate(template: string, vars: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}

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

  const hasActiveSearch = rawQuery.trim().length > 0;

  const searchHint = hasActiveSearch
    ? interpolate(t("productsPage.searchResultsFor", ""), {
        query: rawQuery.trim(),
      })
    : null;

  const categoryItems = [
    { id: "all", label: t("productsPage.segmentAll") },
    { id: "fishing", label: t("productsPage.segmentFishing") },
    { id: "mountain-snow", label: t("productsPage.segmentMountainSnow") },
    { id: "outdoor", label: t("productsPage.segmentOutdoorAdventure") },
    { id: "water-sports", label: t("productsPage.segmentWaterSports") },
  ];

  const sortOptions = [
    { value: "featured", label: t("productsPage.sortFeatured") },
    { value: "price-asc", label: t("productsPage.sortPriceAsc") },
    { value: "price-desc", label: t("productsPage.sortPriceDesc") },
    { value: "name-asc", label: t("productsPage.sortNameAsc") },
  ];

  const breaks: [
    {
      variant: "image";
      title: string;
      imageSrc: string;
      imageAlt: string;
    } | null,
    { variant: "text"; title: string } | null,
  ] = [
    {
      variant: "image",
      title: t("productsPage.breakImageTitle"),
      imageSrc: "/assets/images/hero/trekking.webp",
      imageAlt: t("productsPage.breakImageAlt"),
    },
    {
      variant: "text",
      title: t("productsPage.breakTextTitle"),
    },
  ];

  const cardLabels = {
    viewProduct: t("common.viewProduct"),
    addToCart: t("common.addToCart"),
    noImage: t("common.noImage"),
  };

  return (
    <main className="relative flex min-h-screen flex-col overflow-x-hidden bg-dark-base text-text-primary">
      <ProductsHero
        locale={locale}
        title={t("productsPage.heroEssentialTitle")}
        subtitle={t("productsPage.heroEditorialSubtitle")}
        discoverCtaLabel={t("productsPage.heroDiscoverProducts")}
        categoryCtas={[
          {
            slug: "fishing",
            label: t("productsPage.segmentFishing"),
            tone: "forest",
          },
          {
            slug: "mountain-snow",
            label: t("productsPage.segmentMountainSnow"),
            tone: "burgundy",
          },
          {
            slug: "water-sports",
            label: t("productsPage.segmentWaterSports"),
            tone: "burnt",
          },
          {
            slug: "outdoor-adventure",
            label: t("productsPage.segmentOutdoorAdventure"),
            tone: "mustard",
          },
        ]}
        searchHint={searchHint}
      />

      <section
        id="products-catalog"
        className="scroll-mt-[calc(env(safe-area-inset-top,0px)+6.5rem)] border-b border-white/[0.05] bg-[#0a0e0d] py-12 md:py-16"
      >
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-12">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <CategorySelector
              locale={locale}
              items={categoryItems}
              activeResolvedCategorySlug={categorySlug}
              q={rawQuery.trim() || undefined}
              sort={sort === "featured" ? undefined : sort}
            />
            <div className="shrink-0 lg:min-w-[240px]">
              <SortingBar
                locale={locale}
                q={rawQuery.trim() || undefined}
                sort={sort}
                category={categorySlug ? categoryQuery || undefined : undefined}
                label={t("productsPage.sortLabel")}
                options={sortOptions}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-6 py-12 sm:px-10 md:py-16 lg:px-12 lg:py-20">
        {hasActiveSearch && displayProducts.length === 0 ? (
          <div className="rounded-sm border border-white/10 bg-[#0f1412]/80 px-6 py-14 text-center">
            <p className="text-lg font-medium text-text-primary">
              {t("productsPage.searchNoResults", "")}
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-text-muted">
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
          <ProductsEditorialGrid
            products={displayProducts}
            locale={locale}
            labels={cardLabels}
            analyticsListName="all_products"
            breaks={breaks}
          />
        )}
      </div>
    </main>
  );
}
