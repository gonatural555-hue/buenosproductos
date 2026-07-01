import { GI_PDP_STICKY_TOP } from "@/lib/ui/goodideas-design";

/** PDP estilo DTC premium (referencia Sealify) — fondo blanco, tipografía sans, CTAs negros. */
export const GI_DTC = {
  pageBg: "bg-white text-[#111111]",
  ink: "#111111",
  muted: "#6B7280",
  border: "#E5E7EB",
  success: "#16A34A",
  star: "#FBBF24",
  cta:
    "w-full min-h-[52px] rounded-sm bg-[#111111] px-8 py-4 font-body text-base font-semibold text-white transition-colors hover:bg-[#2a2a2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]/30 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  badge:
    "inline-flex items-center rounded-sm border border-[#111111] px-2.5 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-[#111111]",
  sectionPad: "py-14 md:py-20",
  container: "mx-auto w-full max-w-[1320px] px-5 sm:px-6 lg:px-8",
  heroGrid:
    "hidden lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-start lg:gap-x-10 xl:gap-x-14",
  buyBoxSticky: `lg:sticky ${GI_PDP_STICKY_TOP} lg:self-start`,
  /** Fila horizontal lifestyle (382×622 px). */
  horizontalTileWidthPx: 382,
  horizontalTileHeightPx: 622,
  /** Tiles promos DTC (382×305 px). */
  horizontalPromoTileHeightPx: 305,
  horizontalTileRow:
    "flex flex-nowrap justify-start gap-4 overflow-x-auto pb-1 md:justify-center md:gap-6 md:overflow-x-visible [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  /** Ancho contenido 3 tiles (382×3 + gap-6×2). */
  horizontalThreeTileRowMaxWidthPx: 382 * 3 + 24 * 2,
  horizontalThreeTileRowContainer: "mx-auto w-full max-w-[1194px]",
  horizontalTileItem:
    "relative shrink-0 overflow-hidden rounded-2xl border border-[#ECECEC]",
  /** Hover en tiles promo destacados (azul marca GI #3B82F6). */
  promoTileHoverHighlight:
    "group relative z-0 overflow-visible transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:z-10 hover:scale-[1.03] hover:border-[#3B82F6]/45 hover:shadow-[0_0_0_1px_rgba(59,130,246,0.32),0_12px_40px_rgba(59,130,246,0.18)] motion-reduce:transition-none motion-reduce:hover:scale-100",
  promoTileHoverTitle:
    "transition-colors duration-300 group-hover:text-[#3B82F6]",
} as const;

export function giDtcHorizontalTileItemStyle(
  heightPx: number = GI_DTC.horizontalTileHeightPx
): {
  width: number;
  height: number;
  scrollSnapAlign: "center";
} {
  return {
    width: GI_DTC.horizontalTileWidthPx,
    height: heightPx,
    scrollSnapAlign: "center",
  };
}
