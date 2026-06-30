/** Tokens PLP Good Products — catálogo claro (fondo blanco). */
import { giType } from "@/lib/ui/gi-typography";

export const giPlpClasses = {
  page: "bg-white text-[var(--gi-text-primary)]",
  sidebarDivider: "border-neutral-200",
  filterSummary: `flex cursor-pointer list-none items-center gap-2 py-3.5 ${giType.filterHeading} text-[var(--gi-text-primary)] [&::-webkit-details-marker]:hidden`,
  filterChevron: "shrink-0 text-neutral-400 text-xs",
  categoryLink: giType.filterLink,
  categoryLinkActive: giType.filterLinkActive,
  categoryTreeNestedBorder: "ml-3 space-y-0 border-l border-neutral-200 pl-3",
  searchInput: `w-full rounded-xl border border-neutral-300 bg-[var(--gi-primary)] px-4 py-2.5 ${giType.input} text-white placeholder:text-white/60 outline-none focus:border-neutral-400 focus:ring-1 focus:ring-white/30`,
  searchHint: `${giType.cardSecondary} mb-3`,
  toolbarRow:
    "hidden items-center justify-between gap-6 border-b border-neutral-200 pb-4 lg:flex",
  toolbarLabel: `${giType.filterHeading} text-[var(--gi-text-primary)]`,
  filterDrawer:
    "absolute inset-y-0 left-0 flex w-[min(100%,320px)] flex-col bg-white shadow-xl",
  filterDrawerHeader:
    "flex items-center justify-between border-b border-neutral-200 px-4 py-4",
  filterDrawerTitle: `${giType.filterHeading} text-base text-[var(--gi-text-primary)]`,
  filterDrawerClose: `${giType.cardSecondary}`,
  sortLabel: giType.cardSecondary,
  sortSelect: `${giType.select} max-w-[12rem] cursor-pointer appearance-none border-0 bg-transparent py-1 pl-1 pr-6 text-right text-[var(--gi-text-primary)] outline-none sm:max-w-[14rem]`,
  sortChevron: "pointer-events-none absolute right-0 text-neutral-400",
  priceFieldLabel: giType.label,
  priceFieldInput: `w-full rounded-lg border border-neutral-200 bg-white px-2.5 py-2 ${giType.input} text-[var(--gi-text-primary)] outline-none focus:border-[var(--gi-primary)]/40`,
  card: "group block overflow-hidden rounded-2xl border border-neutral-200 bg-white transition duration-300 hover:-translate-y-0.5 hover:border-[var(--gi-primary)]/35 hover:shadow-[0_20px_48px_rgba(15,23,42,0.12)]",
  cardImageBg: "relative aspect-[4/5] overflow-hidden bg-neutral-100",
  cardCategory: giType.cardCategory,
  cardTitle: `${giType.cardTitle} text-[var(--gi-text-primary)]`,
  cardDescription: giType.cardSecondary,
  cardPrice: `${giType.cardPrice} text-[var(--gi-text-primary)]`,
  cardCta: giType.cardCta,
  cardNoImage: `flex h-full items-center justify-center ${giType.cardSecondary}`,
  emptyTitle: `${giType.filterHeading} text-lg text-[var(--gi-text-primary)]`,
  emptyHint: giType.cardSecondary,
  addNowWrap:
    "absolute inset-x-3 bottom-3 z-[2] translate-y-1 opacity-100 transition-all duration-300 ease-out md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 motion-reduce:transition-none motion-reduce:md:opacity-100 motion-reduce:md:translate-y-0",
  addNowBtn: `w-full rounded-full border border-[var(--gi-primary)] bg-[var(--gi-primary)] px-4 py-2.5 ${giType.btnSm} text-white shadow-[0_8px_24px_-8px_rgba(59,130,246,0.45)] transition duration-200 hover:bg-[var(--gi-primary-hover)] hover:border-[var(--gi-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gi-primary)]/50 active:scale-[0.99] motion-reduce:transition-none`,
  filterTrigger: `flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3 ${giType.filterHeading} text-[var(--gi-text-primary)] shadow-sm`,
  productGrid: "-mt-[103px] min-w-0 flex-1",
  chip: `inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 ${giType.badge} text-neutral-800 hover:border-[var(--gi-primary)]/40`,
  chipClear:
    "text-xs text-[var(--gi-primary)] underline underline-offset-2 hover:text-[var(--gi-primary-hover)]",
  filterScrollArea:
    "gi-plp-filter-scroll overflow-y-auto overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:h-0",
} as const;
