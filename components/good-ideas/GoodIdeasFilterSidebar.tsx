import Link from "next/link";
import GoodIdeasPriceFilter from "@/components/good-ideas/GoodIdeasPriceFilter";
import type { GoodIdeasFilterCategoryNode } from "@/lib/good-ideas-plp-categories";
import type { GoodIdeasPriceFilter as PriceFilterState } from "@/lib/good-ideas-plp-price";
import type { Locale } from "@/lib/i18n/config";
import { giPlpClasses } from "@/lib/ui/good-ideas-plp";

export type GoodIdeasFilterSidebarProps = {
  title: string;
  locale: Locale;
  categories: GoodIdeasFilterCategoryNode[];
  activeCategorySlug?: string | null;
  activePriceFilter: PriceFilterState;
  preserve: {
    q?: string;
    sort?: string;
    category?: string | null;
  };
  attributeLabels: {
    brands: string;
    price: string;
    sizes: string;
    color: string;
    sale: string;
  };
  categorySectionLabel: string;
  priceMinLabel: string;
  priceMaxLabel: string;
  priceApplyLabel: string;
  pricePresetLabels: Record<string, string>;
};

function FilterRowEmpty({ label }: { label: string }) {
  return (
    <details className={`group border-t ${giPlpClasses.sidebarDivider} first:border-t-0`}>
      <summary className={giPlpClasses.filterSummary}>
        <span
          className={`${giPlpClasses.filterChevron} transition-transform group-open:rotate-180`}
          aria-hidden
        >
          ▾
        </span>
        <span>{label}</span>
      </summary>
    </details>
  );
}

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
    <ul className={depth > 0 ? "ml-3 space-y-0 border-l border-white/[0.08] pl-3" : "space-y-0"}>
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
  activeCategorySlug,
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
      <FilterRowEmpty label={attributeLabels.brands} />

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

      <FilterRowEmpty label={attributeLabels.sizes} />
      <FilterRowEmpty label={attributeLabels.color} />
      <FilterRowEmpty label={attributeLabels.sale} />

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
