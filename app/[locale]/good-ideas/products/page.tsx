import GoodIdeasCatalogEmptyState from "@/components/good-ideas/GoodIdeasCatalogEmptyState";
import GoodIdeasComingSoonBlock from "@/components/good-ideas/GoodIdeasComingSoonBlock";
import GoodIdeasProductCard from "@/components/good-ideas/GoodIdeasProductCard";
import GoodIdeasCatalogLayout from "@/components/good-ideas/GoodIdeasCatalogLayout";
import GoodIdeasProductsCarouselHeader, {
  type GoodIdeasCarouselSlide,
} from "@/components/good-ideas/GoodIdeasProductsCarouselHeader";
import GoodIdeasSortingBar from "@/components/good-ideas/GoodIdeasSortingBar";
import { getGoodIdeasProducts } from "@/lib/good-ideas-products";
import { buildGoodIdeasFilterCategoryTree } from "@/lib/good-ideas-plp-categories";
import {
  buildGoodIdeasFilterChips,
  filterGoodIdeasProducts,
  hasActiveGoodIdeasCatalogFilters,
  normalizeText,
  parseGoodIdeasPriceFilter,
  resolveGoodIdeasCategoryParam,
} from "@/lib/good-ideas-plp-filters";
import { GOOD_IDEAS_PRICE_PRESETS } from "@/lib/good-ideas-plp-price";
import {
  buildGoodIdeasPreserveParams,
  buildGoodIdeasProductsListHref,
} from "@/lib/good-ideas-plp-segments";
import { sortProductsList } from "@/lib/products-page-segments";
import { GI_CATALOG_SECTION_ID } from "@/lib/ui/goodideas-design";
import type { GiProductsCategoryTone } from "@/lib/ui/goodideas-design";
import { getMessages } from "@/lib/i18n/messages";
import { createTranslator } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { BRAND_SEGMENTS, goodIdeasProductsPath } from "@/lib/routing/brands";
import { formatDisplayMoney } from "@/lib/currency/format";
import {
  DEFAULT_DISPLAY_CURRENCY,
  EXCHANGE_RATES_FROM_USD,
} from "@/lib/currency/config";

export const dynamic = "force-dynamic";

const SORT_KEYS = ["featured", "price-asc", "price-desc", "name-asc"] as const;

function parseSort(raw: string | undefined): (typeof SORT_KEYS)[number] {
  if (raw && SORT_KEYS.includes(raw as (typeof SORT_KEYS)[number])) {
    return raw as (typeof SORT_KEYS)[number];
  }
  return "featured";
}

const CAROUSEL_CATEGORY_CONFIG: Array<{
  id: string;
  tone: GiProductsCategoryTone;
}> = [
  { id: "tech", tone: "accent" },
  { id: "home", tone: "mist" },
  { id: "lifestyle", tone: "slate" },
  { id: "gifts", tone: "soft" },
];

function formatPresetLabelServer(
  preset: (typeof GOOD_IDEAS_PRICE_PRESETS)[number],
  locale: Locale
): string {
  const fmt = (usd: number) =>
    formatDisplayMoney(
      usd,
      DEFAULT_DISPLAY_CURRENCY,
      EXCHANGE_RATES_FROM_USD,
      locale
    );
  if (preset.min == null && preset.max != null) {
    return `< ${fmt(preset.max)}`;
  }
  if (preset.min != null && preset.max == null) {
    return `> ${fmt(preset.min)}`;
  }
  if (preset.min != null && preset.max != null) {
    return `${fmt(preset.min)} – ${fmt(preset.max)}`;
  }
  return "";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const seo = messages.seo?.goodIdeas?.products;

  return buildMetadata({
    locale,
    title: seo?.title,
    description: seo?.description,
    pathByLocale: {
      en: `/en/${BRAND_SEGMENTS.goodIdeas}/products`,
      es: `/es/${BRAND_SEGMENTS.goodIdeas}/products`,
      fr: `/fr/${BRAND_SEGMENTS.goodIdeas}/products`,
      it: `/it/${BRAND_SEGMENTS.goodIdeas}/products`,
    },
  });
}

export default async function GoodIdeasProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams?: Promise<{
    q?: string;
    sort?: string;
    category?: string;
    priceMin?: string;
    priceMax?: string;
  }>;
}) {
  const { locale } = await params;
  const sp = searchParams != null ? await searchParams : {};
  const messages = await getMessages(locale);
  const t = createTranslator(messages);

  const rawQuery = typeof sp.q === "string" ? sp.q : "";
  const query = normalizeText(rawQuery.trim());
  const sort = parseSort(typeof sp.sort === "string" ? sp.sort : undefined);
  const categoryQuery =
    typeof sp.category === "string" ? sp.category.trim() : "";
  const categorySlug = resolveGoodIdeasCategoryParam(
    categoryQuery || undefined
  );
  const priceFilter = parseGoodIdeasPriceFilter(sp.priceMin, sp.priceMax);

  const allProducts = getGoodIdeasProducts();
  const filtered = filterGoodIdeasProducts(allProducts, {
    locale,
    query: rawQuery.trim() ? query : undefined,
    categorySlug,
    priceFilter,
  });
  const displayProducts = sortProductsList(
    filtered,
    sort === "featured" ? undefined : sort,
    locale
  );

  const catalogAction = goodIdeasProductsPath(locale);
  const preserve = buildGoodIdeasPreserveParams({
    q: rawQuery,
    sort,
    category: categorySlug,
    priceMin: priceFilter.min,
    priceMax: priceFilter.max,
  });

  const filterCategories = buildGoodIdeasFilterCategoryTree(locale, t, preserve);

  const activeFilterChips = buildGoodIdeasFilterChips({
    locale,
    categorySlug,
    rawQuery,
    sort,
    priceFilter,
    t,
  });

  const hasActiveFilters = hasActiveGoodIdeasCatalogFilters({
    rawQuery,
    categorySlug,
    priceFilter,
  });

  const attributeLabels = {
    brands: t("goodIdeas.products.filterBrands"),
    price: t("goodIdeas.products.filterPrice"),
    sizes: t("goodIdeas.products.filterSizes"),
    color: t("goodIdeas.products.filterColor"),
    sale: t("goodIdeas.products.filterSale"),
  };

  const pricePresetLabels = Object.fromEntries(
    GOOD_IDEAS_PRICE_PRESETS.map((preset) => [
      preset.id,
      formatPresetLabelServer(preset, locale),
    ])
  );

  const sortOptions = [
    { value: "featured", label: t("goodIdeas.products.sortFeatured") },
    { value: "price-asc", label: t("goodIdeas.products.sortPriceAsc") },
    { value: "price-desc", label: t("goodIdeas.products.sortPriceDesc") },
    { value: "name-asc", label: t("goodIdeas.products.sortNameAsc") },
  ];

  const carouselSlides: GoodIdeasCarouselSlide[] = CAROUSEL_CATEGORY_CONFIG.map(
    (cfg) => ({
      id: cfg.id,
      categoryLabel: t(`goodIdeas.products.categories.${cfg.id}`),
      title: t(`goodIdeas.products.carousel.${cfg.id}.title`),
      subtitle: t(`goodIdeas.products.carousel.${cfg.id}.subtitle`),
      accentWord: t(`goodIdeas.products.carousel.${cfg.id}.accentWord`, ""),
      tone: cfg.tone,
    })
  );

  const searchHint =
    rawQuery.trim() && displayProducts.length > 0
      ? t("goodIdeas.products.searchResultsFor", "").replace(
          "{query}",
          rawQuery.trim()
        )
      : null;

  const sidebarProps = {
    locale,
    categories: filterCategories,
    activeCategorySlug: categorySlug,
    activePriceFilter: priceFilter,
    preserve: {
      q: rawQuery.trim() || undefined,
      sort: sort === "featured" ? undefined : sort,
      category: categorySlug,
    },
    attributeLabels,
    categorySectionLabel: t("goodIdeas.products.categorySectionLabel"),
    priceMinLabel: t("goodIdeas.products.priceMinLabel"),
    priceMaxLabel: t("goodIdeas.products.priceMaxLabel"),
    priceApplyLabel: t("goodIdeas.products.priceApplyLabel"),
    pricePresetLabels,
  };

  return (
    <main className="bg-[#0B0F14] text-[#E8ECF1]">
      <GoodIdeasProductsCarouselHeader
        slides={carouselSlides}
        prevAria={t("goodIdeas.products.carouselPrevAria")}
        nextAria={t("goodIdeas.products.carouselNextAria")}
        dotAriaTemplate={t("goodIdeas.products.carouselDotAria")}
      />

      {allProducts.length > 0 ? (
        <GoodIdeasCatalogLayout
          catalogAction={catalogAction}
          filtersLabel={t("goodIdeas.products.filtersLabel")}
          closeFiltersLabel={t("goodIdeas.products.closeFilters")}
          searchLabel={t("goodIdeas.products.searchLabel")}
          searchPlaceholder={t("goodIdeas.products.searchPlaceholder")}
          rawQuery={rawQuery}
          sort={sort}
          activeCategorySlug={categorySlug}
          priceMin={priceFilter.min ?? undefined}
          priceMax={priceFilter.max ?? undefined}
          activeFilterChips={activeFilterChips}
          clearAllFiltersHref={buildGoodIdeasProductsListHref(locale)}
          clearAllFiltersLabel={t("goodIdeas.products.clearAllFilters")}
          searchHint={searchHint}
          sidebarProps={sidebarProps}
          sortBar={
            <GoodIdeasSortingBar
              action={catalogAction}
              q={rawQuery.trim() || undefined}
              sort={sort}
              category={categorySlug ?? undefined}
              priceMin={priceFilter.min ?? undefined}
              priceMax={priceFilter.max ?? undefined}
              label={t("goodIdeas.products.sortLabel")}
              options={sortOptions}
            />
          }
        >
          {displayProducts.length === 0 && hasActiveFilters ? (
            <GoodIdeasCatalogEmptyState
              title={
                rawQuery.trim()
                  ? t("goodIdeas.products.searchNoResults")
                  : t("goodIdeas.products.filterNoResults")
              }
              hint={
                rawQuery.trim()
                  ? t("goodIdeas.products.searchNoResultsHint")
                  : t("goodIdeas.products.filterNoResultsHint")
              }
              clearHref={buildGoodIdeasProductsListHref(locale)}
              clearLabel={t("goodIdeas.products.searchViewAll")}
            />
          ) : (
            displayProducts.map((product) => (
              <GoodIdeasProductCard
                key={product.id}
                product={product}
                locale={locale}
                viewProductLabel={t("common.viewProduct")}
                noImageLabel={t("common.noImage")}
                addNowLabel={t("common.addNow")}
              />
            ))
          )}
        </GoodIdeasCatalogLayout>
      ) : (
        <GoodIdeasComingSoonBlock
          id={GI_CATALOG_SECTION_ID}
          title={t("goodIdeas.products.comingSoonTitle")}
          body={t("goodIdeas.products.comingSoonBody")}
        />
      )}
    </main>
  );
}
