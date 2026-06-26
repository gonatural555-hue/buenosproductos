"use client";

import { useEffect, useId, useState } from "react";
import GoodIdeasFilterSidebar, {
  type GoodIdeasFilterSidebarProps,
} from "@/components/good-ideas/GoodIdeasFilterSidebar";
import GoodIdeasActiveFilterChips, {
  type ActiveFilterChip,
} from "@/components/good-ideas/GoodIdeasActiveFilterChips";
import { giPlpClasses } from "@/lib/ui/good-ideas-plp";

type Props = {
  label: string;
  closeLabel: string;
  sidebarTitle: string;
  sidebarProps: Omit<GoodIdeasFilterSidebarProps, "title">;
  activeFilterChips?: ActiveFilterChip[];
  clearAllFiltersHref?: string;
  clearAllFiltersLabel?: string;
};

export default function GoodIdeasFilterTrigger({
  label,
  closeLabel,
  sidebarTitle,
  sidebarProps,
  activeFilterChips = [],
  clearAllFiltersHref = "",
  clearAllFiltersLabel = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={giPlpClasses.filterTrigger}
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
            className="absolute inset-0 bg-black/60"
            aria-label={closeLabel}
            onClick={() => setOpen(false)}
          />
          <div
            id={titleId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${titleId}-heading`}
            className="absolute inset-y-0 left-0 flex w-[min(100%,320px)] flex-col bg-[#0B0F14] shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-4">
              <span
                id={`${titleId}-heading`}
                className="font-inter text-base font-semibold text-[#E8ECF1]"
              >
                {sidebarTitle}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="font-inter text-sm text-[rgba(232,236,241,0.65)]"
              >
                {closeLabel}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <GoodIdeasActiveFilterChips
                chips={activeFilterChips}
                clearAllHref={clearAllFiltersHref}
                clearAllLabel={clearAllFiltersLabel}
              />
              <GoodIdeasFilterSidebar title={sidebarTitle} {...sidebarProps} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
