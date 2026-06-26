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
          <p className="mb-3 font-inter text-sm text-[rgba(232,236,241,0.65)]">
            {searchHint}
          </p>
        ) : null}

        <form action={catalogAction} method="get" className="mb-4 max-w-md">
          {activeCategorySlug ? (
            <input type="hidden" name="category" value={activeCategorySlug} />
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
            className="w-full rounded-xl border border-white/[0.08] bg-[#151B24] px-4 py-2.5 font-inter text-sm text-[#E8ECF1] placeholder:text-[rgba(232,236,241,0.4)] outline-none focus:border-[#3B82F6]/40 focus:ring-1 focus:ring-[#3B82F6]/30"
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

        <div className="hidden items-center justify-between gap-6 border-b border-white/[0.08] pb-4 lg:flex">
          <span className="font-inter text-sm font-medium text-[#E8ECF1]">
            {filtersLabel}
          </span>
          <div className="shrink-0">{sortBar}</div>
        </div>
      </section>

      <section
        id={GI_CATALOG_SECTION_ID}
        className="scroll-mt-[calc(env(safe-area-inset-top,0px)+6.5rem)] mx-auto max-w-[1400px] px-4 pb-12 md:px-6 lg:px-10 lg:pb-16"
      >
        <div className="flex gap-10 lg:gap-12">
          <aside className="hidden w-[260px] shrink-0 lg:block">
            <div className="sticky top-[calc(env(safe-area-inset-top,0px)+5.5rem)] max-h-[calc(100vh-env(safe-area-inset-top,0px)-6rem)] overflow-y-auto">
              <GoodIdeasActiveFilterChips
                chips={activeFilterChips}
                clearAllHref={clearAllFiltersHref}
                clearAllLabel={clearAllFiltersLabel}
              />
              <GoodIdeasFilterSidebar title={filtersLabel} {...sidebarProps} />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-10">
              {children}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
