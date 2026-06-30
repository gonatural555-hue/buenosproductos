import Link from "next/link";
import GoodIdeasBrandFilter from "@/components/good-ideas/GoodIdeasBrandFilter";
import GoodIdeasPriceFilter from "@/components/good-ideas/GoodIdeasPriceFilter";
import type { GoodIdeasFilterBrandOption } from "@/lib/good-ideas-plp-brands";
import type { GoodIdeasFilterCategoryNode } from "@/lib/good-ideas-plp-categories";
import type { GoodIdeasPriceFilter as PriceFilterState } from "@/lib/good-ideas-plp-price";
import type { Locale } from "@/lib/i18n/config";
import { giPlpClasses } from "@/lib/ui/good-ideas-plp";

export type GoodIdeasFilterSidebarProps = {
  title: string;
  locale: Locale;
  categories: GoodIdeasFilterCategoryNode[];
  brands: GoodIdeasFilterBrandOption[];
  activeCategorySlug?: string | null;
  activeBrandSlug?: string | null;
  activePriceFilter: PriceFilterState;
  preserve: {
    q?: string;
    sort?: string;
    category?: string | null;
    brand?: string | null;
  };
  attributeLabels: {
    brands: string;
    price: string;
  };
  categorySectionLabel: string;
  priceMinLabel: string;
  priceMaxLabel: string;
  priceApplyLabel: string;
  pricePresetLabels: Record<string, string>;
};

function CategoryTree({
  nodes,
  activeCategorySlug,
  depth = 0,
}: {
  nodes: GoodIdeasFilterCategoryNode[];
  activeCategorySlug?: string | null;
  depth?: number;
}) {
  return (
    <ul className={depth > 0 ? giPlpClasses.categoryTreeNestedBorder : "space-y-0"}>
      {nodes.map((node) => {
        const isActive = activeCategorySlug === node.slug;
        return (
          <li key={node.slug}>
            <Link
              href={node.href}
              className={
                isActive ? giPlpClasses.categoryLinkActive : giPlpClasses.categoryLink
              }
            >
              {node.label}
            </Link>
            {node.children?.length ? (
              <CategoryTree
                nodes={node.children}
                activeCategorySlug={activeCategorySlug}
                depth={depth + 1}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export default function GoodIdeasFilterSidebar({
  title,
  locale,
  categories,
  brands,
  activeCategorySlug,
  activeBrandSlug,
  activePriceFilter,
  preserve,
  attributeLabels,
  categorySectionLabel,
  priceMinLabel,
  priceMaxLabel,
  priceApplyLabel,
  pricePresetLabels,
}: GoodIdeasFilterSidebarProps) {
  return (
    <nav aria-label={title} className="font-inter">
      <GoodIdeasBrandFilter
        label={attributeLabels.brands}
        brands={brands}
        activeBrandSlug={activeBrandSlug}
      />

      <GoodIdeasPriceFilter
        locale={locale}
        label={attributeLabels.price}
        minLabel={priceMinLabel}
        maxLabel={priceMaxLabel}
        applyLabel={priceApplyLabel}
        presetLabels={pricePresetLabels}
        activeFilter={activePriceFilter}
        preserve={preserve}
      />

      <details
        className={`group border-t ${giPlpClasses.sidebarDivider}`}
        open
      >
        <summary className={giPlpClasses.filterSummary}>
          <span
            className={`${giPlpClasses.filterChevron} transition-transform group-open:rotate-180`}
            aria-hidden
          >
            ▾
          </span>
          <span>{categorySectionLabel}</span>
        </summary>
        <div className="pb-3 pl-5">
          <CategoryTree
            nodes={categories}
            activeCategorySlug={activeCategorySlug}
          />
        </div>
      </details>
    </nav>
  );
}
