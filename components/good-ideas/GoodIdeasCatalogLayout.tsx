import GoodIdeasActiveFilterChips, {
  type ActiveFilterChip,
} from "@/components/good-ideas/GoodIdeasActiveFilterChips";
import GoodIdeasMobileFilterBar from "@/components/good-ideas/GoodIdeasMobileFilterBar";
import GoodIdeasFilterSidebar, {
  type GoodIdeasFilterSidebarProps,
} from "@/components/good-ideas/GoodIdeasFilterSidebar";
import { GI_CATALOG_SECTION_ID } from "@/lib/ui/goodideas-design";
import { giPlpClasses } from "@/lib/ui/good-ideas-plp";

type Props = {
  catalogAction: string;
  filtersLabel: string;
  closeFiltersLabel: string;
  searchLabel: string;
  searchPlaceholder: string;
  rawQuery: string;
  sort?: string;
  activeCategorySlug?: string | null;
  activeBrandSlug?: string | null;
  priceMin?: number;
  priceMax?: number;
  sortBar: React.ReactNode;
  activeFilterChips?: ActiveFilterChip[];
  clearAllFiltersHref?: string;
  clearAllFiltersLabel?: string;
  searchHint?: string | null;
  categoryFilterLabel: string;
  brandFilterLabel: string;
  priceFilterLabel: string;
  sidebarProps: Omit<GoodIdeasFilterSidebarProps, "title">;
  children: React.ReactNode;
};

export default function GoodIdeasCatalogLayout({
  catalogAction,
  filtersLabel,
  closeFiltersLabel,
  searchLabel,
  searchPlaceholder,
  rawQuery,
  sort,
  activeCategorySlug,
  activeBrandSlug,
  priceMin,
  priceMax,
  sortBar,
  activeFilterChips = [],
  clearAllFiltersHref = "",
  clearAllFiltersLabel = "",
  searchHint,
  categoryFilterLabel,
  brandFilterLabel,
  priceFilterLabel,
  sidebarProps,
  children,
}: Props) {
  const hasPriceFilter =
    (priceMin != null && Number.isFinite(priceMin)) ||
    (priceMax != null && Number.isFinite(priceMax));

  const renderSearchForm = (inputId: string) => (
    <form
      action={catalogAction}
      method="get"
      className="mx-auto w-full max-w-md lg:mx-0 lg:w-[290px] lg:max-w-[290px]"
    >
      {activeCategorySlug ? (
        <input type="hidden" name="category" value={activeCategorySlug} />
      ) : null}
      {activeBrandSlug ? (
        <input type="hidden" name="brand" value={activeBrandSlug} />
      ) : null}
      {sort && sort !== "featured" ? (
        <input type="hidden" name="sort" value={sort} />
      ) : null}
      {priceMin != null && Number.isFinite(priceMin) ? (
        <input type="hidden" name="priceMin" value={String(priceMin)} />
      ) : null}
      {priceMax != null && Number.isFinite(priceMax) ? (
        <input type="hidden" name="priceMax" value={String(priceMax)} />
      ) : null}
      <label htmlFor={inputId} className="sr-only">
        {searchLabel}
      </label>
      <input
        id={inputId}
        name="q"
        type="search"
        defaultValue={rawQuery}
        placeholder={searchPlaceholder}
        className={giPlpClasses.searchInput}
      />
    </form>
  );

  return (
    <div className={giPlpClasses.page}>
      <section className="mx-auto max-w-[1400px] px-4 pt-6 md:px-6 md:pt-8 lg:px-10">
        {searchHint ? (
          <p className={`${giPlpClasses.searchHint} hidden lg:block`}>{searchHint}</p>
        ) : null}

        <div className="mb-4 hidden lg:block">{renderSearchForm("gi-catalog-search")}</div>

        <div className={giPlpClasses.toolbarRow}>
          <span className={giPlpClasses.toolbarLabel}>{filtersLabel}</span>
          <div className="shrink-0">{sortBar}</div>
        </div>
      </section>

      <section
        id={GI_CATALOG_SECTION_ID}
        className="scroll-mt-[calc(env(safe-area-inset-top,0px)+6.5rem)] mx-auto max-w-[1400px] px-4 pb-12 md:px-6 lg:px-10 lg:pb-16"
      >
        <div className="mb-4 lg:hidden">
          {searchHint ? (
            <p className={giPlpClasses.searchHint}>{searchHint}</p>
          ) : null}
          <div className="mb-4">{renderSearchForm("gi-catalog-search-mobile")}</div>
          <GoodIdeasMobileFilterBar
            categoryLabel={categoryFilterLabel}
            brandLabel={brandFilterLabel}
            priceLabel={priceFilterLabel}
            filtersLabel={filtersLabel}
            closeLabel={closeFiltersLabel}
            sidebarTitle={filtersLabel}
            sidebarProps={sidebarProps}
            activeFilterChips={activeFilterChips}
            clearAllFiltersHref={clearAllFiltersHref}
            clearAllFiltersLabel={clearAllFiltersLabel}
            activeCategorySlug={activeCategorySlug}
            activeBrandSlug={activeBrandSlug}
            hasPriceFilter={hasPriceFilter}
          />
          <GoodIdeasActiveFilterChips
            chips={activeFilterChips}
            clearAllHref={clearAllFiltersHref}
            clearAllLabel={clearAllFiltersLabel}
            className="mt-3 px-0"
          />
          <div className="mt-3 flex justify-end">{sortBar}</div>
        </div>

        <div className="flex gap-10 lg:gap-12">
          <aside
            className={`hidden w-[260px] shrink-0 lg:sticky lg:top-[calc(env(safe-area-inset-top,0px)+5.5rem)] lg:block lg:max-h-[calc(100vh-env(safe-area-inset-top,0px)-6rem)] ${giPlpClasses.filterScrollArea}`}
          >
            <div>
              <GoodIdeasActiveFilterChips
                chips={activeFilterChips}
                clearAllHref={clearAllFiltersHref}
                clearAllLabel={clearAllFiltersLabel}
              />
              <GoodIdeasFilterSidebar title={filtersLabel} {...sidebarProps} />
            </div>
          </aside>

          <div className={giPlpClasses.productGrid}>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-10">
              {children}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
