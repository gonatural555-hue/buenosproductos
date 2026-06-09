import type { ReactNode } from "react";
import ProductFilterSidebar, {
  type FilterCategoryGroup,
} from "@/components/products/ProductFilterSidebar";
import ProductFilterTrigger from "@/components/products/ProductFilterTrigger";

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
  sortBar: ReactNode;
  children: ReactNode;
  searchHint?: string | null;
  /** Oculta S3 (título + descripción) cuando la página ya tiene hero arriba. */
  showIntro?: boolean;
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
}: ProductsCatalogLayoutProps) {
  return (
    <div className="bg-[#F4EBDD] text-dark-base">
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

      {/* S4 — controles */}
      <section
        className={`mx-auto max-w-7xl px-4 md:px-6 lg:px-16 ${showIntro ? "" : "pt-8 md:pt-10 lg:pt-12"}`}
      >
        <div className="lg:hidden">
          <ProductFilterTrigger
            label={filtersLabel}
            closeLabel={closeFiltersLabel}
            sidebarTitle={filtersLabel}
            categories={categories}
            activeCategorySlug={activeCategorySlug}
            attributeLabels={attributeLabels}
          />
          <div className="mt-3 flex justify-end">{sortBar}</div>
        </div>

        <div className="hidden items-center justify-between gap-6 border-b border-forest/10 pb-4 lg:flex">
          <span className="font-inter text-sm font-medium text-dark-base">
            {filtersLabel}
          </span>
          <div className="shrink-0">{sortBar}</div>
        </div>
      </section>

      {/* S5 — sidebar + grid */}
      <section
        id="products-catalog"
        className="scroll-mt-[calc(env(safe-area-inset-top,0px)+6.5rem)] mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-16 lg:py-10"
      >
        <div className="flex gap-8 lg:gap-10">
          <aside className="hidden w-[260px] shrink-0 lg:block">
            <div className="sticky top-[calc(env(safe-area-inset-top,0px)+7rem)] max-h-[calc(100vh-env(safe-area-inset-top,0px)-8rem)] overflow-y-auto pr-2">
              <ProductFilterSidebar
                title={filtersLabel}
                categories={categories}
                activeCategorySlug={activeCategorySlug}
                attributeLabels={attributeLabels}
              />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="grid grid-cols-2 gap-x-3 gap-y-6 lg:grid-cols-3 lg:gap-6">
              {children}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
