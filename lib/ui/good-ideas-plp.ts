/** Tokens PLP Good Products — misma organización que GN, estética GI. */
export const giPlpClasses = {
  page: "bg-[#0B0F14] text-[#E8ECF1]",
  sidebarDivider: "border-white/[0.08]",
  filterSummary:
    "flex cursor-pointer list-none items-center gap-2 py-3.5 font-inter text-sm text-[#E8ECF1] [&::-webkit-details-marker]:hidden",
  filterChevron: "shrink-0 text-[rgba(232,236,241,0.45)] text-xs",
  categoryLink: "block py-1.5 text-sm text-[rgba(232,236,241,0.72)] hover:text-[#E8ECF1]",
  categoryLinkActive: "block py-1.5 text-sm font-semibold text-[#3B82F6]",
  addNowWrap:
    "absolute inset-x-3 bottom-3 z-[2] translate-y-1 opacity-100 transition-all duration-300 ease-out md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 motion-reduce:transition-none motion-reduce:md:opacity-100 motion-reduce:md:translate-y-0",
  addNowBtn:
    "w-full rounded-full border border-[#3B82F6] bg-[#3B82F6] px-4 py-2.5 font-inter text-[10px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_8px_24px_-8px_rgba(59,130,246,0.45)] transition duration-200 hover:bg-[#2563EB] hover:border-[#2563EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/50 active:scale-[0.99] motion-reduce:transition-none",
  filterTrigger:
    "flex w-full items-center justify-between rounded-xl border border-white/[0.08] bg-[#151B24] px-4 py-3 font-inter text-sm text-[#E8ECF1]",
  chip:
    "inline-flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-[#151B24] px-2.5 py-1 text-xs font-medium text-[#E8ECF1] hover:border-[#3B82F6]/40",
  chipClear:
    "text-xs text-[#3B82F6] underline underline-offset-2 hover:text-[#60A5FA]",
} as const;
