import type { UISurface } from "@/lib/ui-surface";
import { giType } from "@/lib/ui/gi-typography";

export type PdpBrandTheme = "go-natural" | "good-ideas";

export function resolvePdpBrandTheme(
  cartBrand?: "go-natural" | "good-ideas"
): PdpBrandTheme {
  return cartBrand === "good-ideas" ? "good-ideas" : "go-natural";
}

/** Class bundles for the PDP buy column — Good Products uses GI_COLORS, not GN gold/moss. */
export function getPdpBuyBoxTheme(
  brand: PdpBrandTheme,
  surface: UISurface
) {
  const L = surface === "light";
  const gi = brand === "good-ideas";

  if (gi) {
    return {
      brandLink: `${giType.productMeta} text-[var(--gi-text-secondary-on-dark)] underline-offset-2 hover:text-[#60A5FA] hover:underline`,
      title: `font-body text-[clamp(1.75rem,2.8vw,2.375rem)] font-bold leading-[1.22] tracking-[var(--gi-tracking-tight)] text-[var(--gi-text-on-dark)]`,
      reviewsRating: "text-text-muted",
      reviewsScore: `${giType.productMeta} text-[var(--gi-text-secondary-on-dark)]`,
      reviewsDot: "text-white/20",
      reviewsLink: `${giType.productMeta} text-[var(--gi-text-secondary-on-dark)] underline-offset-2 hover:text-[#60A5FA] hover:underline`,
      price: `font-body text-[clamp(1.5rem,2.2vw,1.875rem)] font-bold tabular-nums tracking-[var(--gi-tracking-tight)] text-[var(--gi-text-on-dark)]`,
      freeShipping: `${giType.badge} text-[#4ADE80]`,
      taxNote: `${giType.productMeta} text-[var(--gi-text-muted-on-dark)]`,
      currencyDisclaimer: `${giType.productMeta} text-[var(--gi-text-muted-on-dark)]`,
      variantLabelHeading: `${giType.productMeta} text-[var(--gi-text-secondary-on-dark)]`,
      variantLabelMuted: `${giType.input} text-[var(--gi-text-on-dark)]`,
      variantSelected:
        "border-[#3B82F6] bg-[#151B24] text-[#E8ECF1] ring-1 ring-[#3B82F6] shadow-[0_0_0_1px_rgba(59,130,246,0.25)]",
      variantDefault:
        "border-white/[0.18] bg-[rgba(21,27,36,0.6)] text-[rgba(232,236,241,0.85)] hover:border-[rgba(59,130,246,0.45)] hover:bg-[#151B24]",
      variantDisabled:
        "opacity-35 cursor-not-allowed border-white/10 bg-[#151B24]/40 text-[rgba(232,236,241,0.4)]",
      variantFocusRing:
        "focus-visible:ring-[#3B82F6] focus-visible:ring-offset-[#0B0F14]",
      colorLabel: `${giType.productMeta} text-[var(--gi-text-secondary-on-dark)]`,
      colorValue: `${giType.input} text-[var(--gi-text-on-dark)]`,
      colorSwatchActive:
        "border-[#3B82F6] shadow-[0_0_0_1px_rgba(59,130,246,0.35)]",
      colorSwatchIdle: "border-white/25 hover:border-white/45",
      colorSwatchFocus:
        "focus-visible:ring-[#3B82F6] focus-visible:ring-offset-[#0B0F14]",
      qtyLabel: `${giType.productMeta} text-[var(--gi-text-secondary-on-dark)]`,
      qtyContainer:
        "inline-flex items-center overflow-hidden rounded-xl border border-white/[0.12] bg-[#151B24]",
      qtyBtn:
        "flex h-12 w-12 items-center justify-center text-xl font-medium text-[var(--gi-text-on-dark)] transition-colors hover:bg-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/50 disabled:cursor-not-allowed disabled:opacity-40",
      qtyValue:
        `min-w-[3rem] px-3 text-center ${giType.input} text-lg font-semibold tabular-nums text-[var(--gi-text-on-dark)]`,
      availCard:
        "rounded-md border border-white/[0.08] bg-[#151B24] px-4 py-3.5",
      availTitle: `${giType.filterHeading} text-[var(--gi-text-on-dark)]`,
      availStatus: `${giType.badge} text-[#4ADE80]`,
      availDetail: `${giType.productMeta} text-[var(--gi-text-muted-on-dark)]`,
    };
  }

  return {
    brandLink: L
      ? "text-sm font-medium text-gn-forest underline-offset-2 hover:underline"
      : "text-sm font-medium text-accent-moss underline-offset-2 hover:underline",
    title: L
      ? "font-sans text-[1.55rem] font-semibold leading-[1.15] tracking-tight text-neutral-900 xl:text-[1.75rem]"
      : "font-sans text-[1.55rem] font-semibold leading-[1.15] tracking-tight text-text-primary xl:text-[1.75rem]",
    reviewsRating: L ? "text-neutral-300" : "text-white/25",
    reviewsScore: L ? "font-medium text-neutral-800" : "text-text-muted",
    reviewsDot: L ? "text-neutral-300" : "text-white/30",
    reviewsLink: L
      ? "text-neutral-600 underline-offset-2 hover:text-gn-forest hover:underline"
      : "text-text-muted underline-offset-2 hover:text-accent-gold hover:underline",
    price: L
      ? "text-2xl font-semibold tabular-nums tracking-tight text-neutral-900"
      : "text-2xl font-semibold tabular-nums tracking-tight text-text-primary",
    freeShipping: L
      ? "text-[10px] font-semibold uppercase tracking-[0.14em] text-gn-forest"
      : "text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-moss",
    taxNote: L ? "text-xs text-neutral-500" : "text-xs text-text-muted/80",
    currencyDisclaimer: L
      ? "text-[11px] leading-relaxed text-neutral-500"
      : "text-[11px] leading-relaxed text-text-muted/70",
    variantLabelHeading: L
      ? "text-sm font-semibold tracking-wide text-neutral-900"
      : "text-sm font-semibold tracking-wide text-text-primary",
    variantLabelMuted: L ? "text-sm text-neutral-600" : "text-sm text-text-muted",
    variantSelected: L
      ? "border-accent-gold/90 bg-white text-neutral-900 ring-1 ring-accent-gold shadow-[0_0_0_1px_rgba(212,175,55,0.25)]"
      : "border-accent-gold/85 bg-dark-surface text-text-primary ring-1 ring-accent-gold shadow-[0_0_0_1px_rgba(212,175,55,0.22)]",
    variantDefault: L
      ? "border-neutral-200 bg-neutral-50 text-neutral-900 hover:border-accent-gold/50 hover:shadow-[0_0_14px_rgba(200,155,60,0.08)]"
      : "border-white/12 bg-dark-surface/50 text-text-primary hover:border-accent-gold/40 hover:shadow-[0_0_14px_rgba(200,155,60,0.07)]",
    variantDisabled: L
      ? "opacity-40 cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-500"
      : "opacity-40 cursor-not-allowed border-white/10 bg-dark-surface/30 text-text-muted",
    variantFocusRing: L
      ? "focus-visible:ring-accent-gold focus-visible:ring-offset-white"
      : "focus-visible:ring-accent-gold focus-visible:ring-offset-dark-base",
    colorLabel: L
      ? "text-xs font-semibold uppercase tracking-[0.14em] text-neutral-600"
      : "text-xs font-semibold uppercase tracking-[0.14em] text-text-muted",
    colorValue: L ? "text-sm text-neutral-800" : "text-sm text-text-primary",
    colorSwatchActive:
      "border-accent-gold shadow-[0_0_0_1px_rgba(212,175,55,0.35)]",
    colorSwatchIdle: L
      ? "border-neutral-300 hover:border-neutral-500"
      : "border-white/25 hover:border-white/45",
    colorSwatchFocus: L
      ? "focus-visible:ring-accent-gold focus-visible:ring-offset-white"
      : "focus-visible:ring-accent-gold focus-visible:ring-offset-dark-base",
    qtyLabel: L
      ? "text-xs font-semibold uppercase tracking-[0.14em] text-neutral-600"
      : "text-xs font-semibold uppercase tracking-[0.14em] text-text-muted",
    qtyContainer: L
      ? "inline-flex items-center overflow-hidden rounded-md border border-neutral-300 bg-white"
      : "inline-flex items-center overflow-hidden rounded-md border border-white/20 bg-dark-surface/50",
    qtyBtn: L
      ? "flex h-10 w-10 items-center justify-center text-lg font-medium text-neutral-800 transition-colors hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gn-forest/40 disabled:cursor-not-allowed disabled:opacity-40"
      : "flex h-10 w-10 items-center justify-center text-lg font-medium text-text-primary transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/40 disabled:cursor-not-allowed disabled:opacity-40",
    qtyValue: L
      ? "min-w-[2.75rem] px-2 text-center text-sm font-semibold tabular-nums text-neutral-900"
      : "min-w-[2.75rem] px-2 text-center text-sm font-semibold tabular-nums text-text-primary",
    availCard: L
      ? "rounded-md border border-neutral-300 bg-white px-4 py-3.5"
      : "rounded-md border border-white/15 bg-dark-surface/40 px-4 py-3.5",
    availTitle: L
      ? "text-sm font-semibold text-neutral-900"
      : "text-sm font-semibold text-text-primary",
    availStatus: L
      ? "mt-1 text-sm font-medium text-gn-forest"
      : "mt-1 text-sm font-medium text-accent-moss",
    availDetail: L
      ? "mt-0.5 text-xs leading-snug text-neutral-600"
      : "mt-0.5 text-xs leading-snug text-text-muted",
  };
}
