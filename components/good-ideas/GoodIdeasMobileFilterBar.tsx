"use client";

import { useEffect, useId, useState } from "react";
import GoodIdeasActiveFilterChips, {
  type ActiveFilterChip,
} from "@/components/good-ideas/GoodIdeasActiveFilterChips";
import GoodIdeasFilterSidebar, {
  GoodIdeasCategoryFilterList,
  type GoodIdeasFilterSidebarProps,
} from "@/components/good-ideas/GoodIdeasFilterSidebar";
import GoodIdeasBrandFilter from "@/components/good-ideas/GoodIdeasBrandFilter";
import GoodIdeasPriceFilter from "@/components/good-ideas/GoodIdeasPriceFilter";
import { giPlpClasses } from "@/lib/ui/good-ideas-plp";

type FilterPanel = "category" | "brand" | "price" | "all" | null;

type Props = {
  categoryLabel: string;
  brandLabel: string;
  priceLabel: string;
  filtersLabel: string;
  closeLabel: string;
  sidebarTitle: string;
  sidebarProps: Omit<GoodIdeasFilterSidebarProps, "title">;
  activeFilterChips?: ActiveFilterChip[];
  clearAllFiltersHref?: string;
  clearAllFiltersLabel?: string;
  activeCategorySlug?: string | null;
  activeBrandSlug?: string | null;
  hasPriceFilter?: boolean;
};

function FilterChevron({ className = "" }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={`shrink-0 ${className}`}
    >
      <path
        d="M3 4.5L6 7.5L9 4.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FiltersIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
      className="shrink-0"
    >
      <path d="M4 7h16M7 12h10M10 17h4" strokeLinecap="round" />
    </svg>
  );
}

function MobileFilterPill({
  label,
  active,
  accent,
  onClick,
  showDivider,
}: {
  label: string;
  active?: boolean;
  accent?: boolean;
  onClick: () => void;
  showDivider?: boolean;
}) {
  return (
    <div className={`flex shrink-0 items-stretch ${showDivider ? giPlpClasses.mobileFilterDivider : ""}`}>
      <button
        type="button"
        onClick={onClick}
        className={
          accent
            ? giPlpClasses.mobileFilterPillAccent
            : active
              ? giPlpClasses.mobileFilterPillActive
              : giPlpClasses.mobileFilterPill
        }
      >
        {accent ? <FiltersIcon /> : null}
        <span>{label}</span>
        <FilterChevron className={accent ? "text-[var(--gi-primary)]" : undefined} />
      </button>
    </div>
  );
}

export default function GoodIdeasMobileFilterBar({
  categoryLabel,
  brandLabel,
  priceLabel,
  filtersLabel,
  closeLabel,
  sidebarTitle,
  sidebarProps,
  activeFilterChips = [],
  clearAllFiltersHref = "",
  clearAllFiltersLabel = "",
  activeCategorySlug,
  activeBrandSlug,
  hasPriceFilter = false,
}: Props) {
  const [panel, setPanel] = useState<FilterPanel>(null);
  const sheetId = useId();

  useEffect(() => {
    if (!panel) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [panel]);

  const close = () => setPanel(null);

  const panelTitle =
    panel === "category"
      ? categoryLabel
      : panel === "brand"
        ? brandLabel
        : panel === "price"
          ? priceLabel
          : filtersLabel;

  const showBrandPill = sidebarProps.brands.length > 0;

  return (
    <>
      <div className={giPlpClasses.mobileFilterBar}>
        <div className={giPlpClasses.mobileFilterScroll}>
          <MobileFilterPill
            label={categoryLabel}
            active={Boolean(activeCategorySlug)}
            onClick={() => setPanel("category")}
          />
          {showBrandPill ? (
            <MobileFilterPill
              label={brandLabel}
              active={Boolean(activeBrandSlug)}
              onClick={() => setPanel("brand")}
              showDivider
            />
          ) : null}
          <MobileFilterPill
            label={priceLabel}
            active={hasPriceFilter}
            onClick={() => setPanel("price")}
            showDivider
          />
          <MobileFilterPill
            label={filtersLabel}
            accent
            onClick={() => setPanel("all")}
            showDivider
          />
        </div>
      </div>

      {panel ? (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label={closeLabel}
            onClick={close}
          />
          <div
            id={sheetId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${sheetId}-title`}
            className={giPlpClasses.mobileFilterSheet}
          >
            <div className={giPlpClasses.mobileFilterSheetHeader}>
              <h2
                id={`${sheetId}-title`}
                className={giPlpClasses.mobileFilterSheetTitle}
              >
                {panelTitle}
              </h2>
              <button
                type="button"
                onClick={close}
                className={giPlpClasses.mobileFilterSheetClose}
              >
                {closeLabel}
              </button>
            </div>
            <div className={`min-h-0 flex-1 overflow-y-auto px-4 py-4 ${giPlpClasses.filterScrollArea}`}>
              {panel === "all" ? (
                <>
                  <GoodIdeasActiveFilterChips
                    chips={activeFilterChips}
                    clearAllHref={clearAllFiltersHref}
                    clearAllLabel={clearAllFiltersLabel}
                  />
                  <GoodIdeasFilterSidebar title={sidebarTitle} {...sidebarProps} />
                </>
              ) : null}

              {panel === "category" ? (
                <GoodIdeasCategoryFilterList
                  categories={sidebarProps.categories}
                  activeCategorySlug={activeCategorySlug}
                />
              ) : null}

              {panel === "brand" ? (
                <GoodIdeasBrandFilter
                  label={brandLabel}
                  brands={sidebarProps.brands}
                  activeBrandSlug={activeBrandSlug}
                  embedded
                />
              ) : null}

              {panel === "price" ? (
                <GoodIdeasPriceFilter
                  locale={sidebarProps.locale}
                  label={priceLabel}
                  minLabel={sidebarProps.priceMinLabel}
                  maxLabel={sidebarProps.priceMaxLabel}
                  applyLabel={sidebarProps.priceApplyLabel}
                  presetLabels={sidebarProps.pricePresetLabels}
                  activeFilter={sidebarProps.activePriceFilter}
                  preserve={sidebarProps.preserve}
                  embedded
                />
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
