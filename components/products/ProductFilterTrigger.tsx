"use client";

import { useEffect, useId, useState } from "react";
import ProductFilterSidebar, {
  type FilterCategoryGroup,
} from "@/components/products/ProductFilterSidebar";
import ActiveFilterChips, {
  type ActiveFilterChip,
} from "@/components/products/ActiveFilterChips";
import type { CatalogVisualStyle } from "@/lib/plp-catalog-visual-style";

type ProductFilterTriggerProps = {
  label: string;
  closeLabel: string;
  sidebarTitle: string;
  categories: FilterCategoryGroup[];
  activeCategorySlug?: string | null;
  attributeLabels: {
    brands: string;
    price: string;
    sizes: string;
    color: string;
    sale: string;
  };
  panelClassName?: string;
  visualStyle?: CatalogVisualStyle;
  activeFilterChips?: ActiveFilterChip[];
  clearAllFiltersHref?: string;
  clearAllFiltersLabel?: string;
};

export default function ProductFilterTrigger({
  label,
  closeLabel,
  sidebarTitle,
  categories,
  activeCategorySlug,
  attributeLabels,
  panelClassName = "bg-[#F4EBDD]",
  visualStyle = "default",
  activeFilterChips = [],
  clearAllFiltersHref = "",
  clearAllFiltersLabel = "",
}: ProductFilterTriggerProps) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const isPatagonia = visualStyle === "patagonia";

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const triggerClass = isPatagonia
    ? "flex w-full items-center justify-between border border-[#E5E5E5] bg-white px-4 py-3 font-inter text-sm text-black"
    : "flex w-full items-center justify-between rounded-sm border border-forest/12 bg-soft-stone/80 px-4 py-3 font-inter text-sm text-dark-base";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={triggerClass}
        aria-expanded={open}
        aria-controls={titleId}
      >
        <span>{label}</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <path d="M4 6h16M4 12h10M4 18h16" />
        </svg>
      </button>

      {open ? (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label={closeLabel}
            onClick={() => setOpen(false)}
          />
          <div
            id={titleId}
            role="dialog"
            aria-modal="true"
            className={`absolute inset-y-0 left-0 flex w-[min(100%,320px)] flex-col shadow-xl ${panelClassName}`}
          >
            <div
              className={`flex items-center justify-between px-4 py-4 ${
                isPatagonia ? "border-b border-[#E5E5E5]" : "border-b border-forest/10"
              }`}
            >
              <span
                className={
                  isPatagonia
                    ? "font-inter text-base font-semibold text-black"
                    : "font-display text-lg text-dark-base"
                }
              >
                {sidebarTitle}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={
                  isPatagonia
                    ? "font-inter text-sm text-black/70"
                    : "font-inter text-sm text-forest/70"
                }
              >
                {closeLabel}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {isPatagonia ? (
                <ActiveFilterChips
                  chips={activeFilterChips}
                  clearAllHref={clearAllFiltersHref}
                  clearAllLabel={clearAllFiltersLabel}
                />
              ) : null}
              <ProductFilterSidebar
                title={sidebarTitle}
                categories={categories}
                activeCategorySlug={activeCategorySlug}
                attributeLabels={attributeLabels}
                visualStyle={visualStyle}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
