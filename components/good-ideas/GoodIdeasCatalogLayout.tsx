import GoodIdeasActiveFilterChips, {
  type ActiveFilterChip,
} from "@/components/good-ideas/GoodIdeasActiveFilterChips";
import GoodIdeasFilterSidebar, {
  type GoodIdeasFilterSidebarProps,
} from "@/components/good-ideas/GoodIdeasFilterSidebar";
import GoodIdeasFilterTrigger from "@/components/good-ideas/GoodIdeasFilterTrigger";
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
  sidebarProps,
  children,
}: Props) {
  return (
    <div className={giPlpClasses.page}>
      <section className="mx-auto max-w-[1400px] px-4 pt-6 md:px-6 md:pt-8 lg:px-10">
        {searchHint ? (
          <p className={giPlpClasses.searchHint}>{searchHint}</p>
        ) : null}

        <form action={catalogAction} method="get" className="mb-4 w-[290px] max-w-[290px]">
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
          <label htmlFor="gi-catalog-search" className="sr-only">
            {searchLabel}
          </label>
          <input
            id="gi-catalog-search"
            name="q"
            type="search"
            defaultValue={rawQuery}
            placeholder={searchPlaceholder}
            className={giPlpClasses.searchInput}
          />
        </form>

        <div className="lg:hidden">
          <GoodIdeasFilterTrigger
            label={filtersLabel}
            closeLabel={closeFiltersLabel}
            sidebarTitle={filtersLabel}
            activeFilterChips={activeFilterChips}
            clearAllFiltersHref={clearAllFiltersHref}
            clearAllFiltersLabel={clearAllFiltersLabel}
            sidebarProps={sidebarProps}
          />
          <div className="mt-3 flex justify-end">{sortBar}</div>
        </div>

        <div className={giPlpClasses.toolbarRow}>
          <span className={giPlpClasses.toolbarLabel}>{filtersLabel}</span>
          <div className="shrink-0">{sortBar}</div>
        </div>
      </section>

      <section
        id={GI_CATALOG_SECTION_ID}
        className="scroll-mt-[calc(env(safe-area-inset-top,0px)+6.5rem)] mx-auto max-w-[1400px] px-4 pb-12 md:px-6 lg:px-10 lg:pb-16"
      >
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
