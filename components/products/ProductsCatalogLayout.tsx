import ActiveFilterChips, {
  type ActiveFilterChip,
} from "@/components/products/ActiveFilterChips";
import ProductFilterSidebar, {
  type FilterCategoryGroup,
} from "@/components/products/ProductFilterSidebar";
import ProductFilterTrigger from "@/components/products/ProductFilterTrigger";
import { plpPatagoniaClasses } from "@/lib/ui/plp-patagonia";
import type { CatalogVisualStyle } from "@/lib/plp-catalog-visual-style";

export type { CatalogVisualStyle };

type ProductsCatalogLayoutProps = {
  title: string;
  description: string;
  readMoreLabel?: string;
  readMoreHref?: string;
  filtersLabel: string;
  closeFiltersLabel: string;
  categories: FilterCategoryGroup[];
  activeCategorySlug?: string | null;
  attributeLabels: {
    brands: string;
    price: string;
    sizes: string;
    color: string;
    sale: string;
  };
  sortBar: React.ReactNode;
  children: React.ReactNode;
  searchHint?: string | null;
  showIntro?: boolean;
  surface?: "cream" | "white";
  visualStyle?: CatalogVisualStyle;
  activeFilterChips?: ActiveFilterChip[];
  clearAllFiltersHref?: string;
  clearAllFiltersLabel?: string;
};

export default function ProductsCatalogLayout({
  title,
  description,
  readMoreLabel,
  readMoreHref,
  filtersLabel,
  closeFiltersLabel,
  categories,
  activeCategorySlug,
  attributeLabels,
  sortBar,
  children,
  searchHint,
  showIntro = true,
  surface = "cream",
  visualStyle = "default",
  activeFilterChips = [],
  clearAllFiltersHref = "",
  clearAllFiltersLabel = "",
}: ProductsCatalogLayoutProps) {
  const isPatagonia = visualStyle === "patagonia";
  const surfaceBg = isPatagonia
    ? "bg-white"
    : surface === "white"
      ? "bg-white"
      : "bg-[#F4EBDD]";
  const rootClass = isPatagonia ? plpPatagoniaClasses.page : `${surfaceBg} text-dark-base`;

  return (
    <div className={rootClass}>
      {showIntro ? (
        <section className="mx-auto max-w-7xl px-4 pb-6 pt-10 md:px-6 md:pt-12 lg:px-16 lg:pt-14">
          {searchHint ? (
            <p className="mb-3 font-inter text-sm text-forest/70">{searchHint}</p>
          ) : null}
          <h1 className="font-display text-3xl text-dark-base md:text-4xl lg:text-[2.5rem] lg:leading-tight">
            {title}
          </h1>
          <div className="mt-4 max-w-2xl">
            <p className="font-inter text-sm leading-relaxed text-forest/80 md:text-base">
              {description}
            </p>
            {readMoreHref && readMoreLabel ? (
              <a
                href={readMoreHref}
                className="mt-2 inline-block font-inter text-sm text-dark-base underline underline-offset-2"
              >
                {readMoreLabel}
              </a>
            ) : null}
          </div>
        </section>
      ) : null}

      <section
        className={`mx-auto max-w-[1400px] px-4 md:px-6 lg:px-10 ${
          showIntro ? "" : isPatagonia ? "pt-6 md:pt-8" : "pt-8 md:pt-10 lg:pt-12"
        }`}
      >
        {!isPatagonia ? (
          <>
            <div className="lg:hidden">
              <ProductFilterTrigger
                label={filtersLabel}
                closeLabel={closeFiltersLabel}
                sidebarTitle={filtersLabel}
                categories={categories}
                activeCategorySlug={activeCategorySlug}
                attributeLabels={attributeLabels}
                panelClassName={surfaceBg}
              />
              <div className="mt-3 flex justify-end">{sortBar}</div>
            </div>
            <div className="hidden items-center justify-between gap-6 border-b border-forest/10 pb-4 lg:flex">
              <span className="font-inter text-sm font-medium text-dark-base">
                {filtersLabel}
              </span>
              <div className="shrink-0">{sortBar}</div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4 space-y-3 lg:hidden">
              <ProductFilterTrigger
                label={filtersLabel}
                closeLabel={closeFiltersLabel}
                sidebarTitle={filtersLabel}
                categories={categories}
                activeCategorySlug={activeCategorySlug}
                attributeLabels={attributeLabels}
                panelClassName="bg-white"
                visualStyle="patagonia"
                activeFilterChips={activeFilterChips}
                clearAllFiltersHref={clearAllFiltersHref}
                clearAllFiltersLabel={clearAllFiltersLabel}
              />
              <div className="flex justify-end">{sortBar}</div>
            </div>
          </>
        )}
      </section>

      <section
        id="products-catalog"
        className="scroll-mt-[calc(env(safe-area-inset-top,0px)+6.5rem)] mx-auto max-w-[1400px] px-4 pb-12 md:px-6 lg:px-10 lg:pb-16"
      >
        <div className={`flex ${isPatagonia ? "gap-10 lg:gap-12" : "gap-8 lg:gap-10"}`}>
          <aside
            className={`hidden shrink-0 lg:block ${isPatagonia ? "w-[240px]" : "w-[260px]"}`}
          >
            <div className="sticky top-[calc(env(safe-area-inset-top,0px)+1rem)] max-h-[calc(100vh-env(safe-area-inset-top,0px)-2rem)] overflow-y-auto">
              {isPatagonia ? (
                <ActiveFilterChips
                  chips={activeFilterChips}
                  clearAllHref={clearAllFiltersHref}
                  clearAllLabel={clearAllFiltersLabel}
                />
              ) : null}
              <ProductFilterSidebar
                title={filtersLabel}
                categories={categories}
                activeCategorySlug={activeCategorySlug}
                attributeLabels={attributeLabels}
                visualStyle={visualStyle}
              />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            {isPatagonia ? (
              <div className="mb-6 hidden items-center justify-end lg:flex">
                {sortBar}
              </div>
            ) : null}
            <div
              className={
                isPatagonia
                  ? "grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-10"
                  : "grid grid-cols-2 gap-x-3 gap-y-6 lg:grid-cols-3 lg:gap-6"
              }
            >
              {children}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
