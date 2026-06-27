/** Tokens visuales PLP estilo Patagonia (listado productos / categoría). */
import type { CSSProperties } from "react";
import {
  GN_HERO_CTA_CLASS_COMPACT,
  gnHeroCtaMustardInverseStyle,
} from "@/lib/ui/gn-hero-cta";

export const PLP_PATAGONIA = {
  pageBg: "#F0F0F0",
  imageBoxBg: "#F5F5F5",
  textPrimary: "#000000",
  textSecondary: "#666666",
  salePrice: "#CC0000",
  borderDivider: "#E5E5E5",
  imageRadius: "0.5rem",
} as const;

/** Botón “Agregar ahora” — blanco + mustard, hover invertido (mismo raised block). */
export const productCardAddToCartBtnClass = `${GN_HERO_CTA_CLASS_COMPACT} w-full !min-h-[48px] whitespace-normal`;

export const productCardAddToCartBtnStyle: CSSProperties =
  gnHeroCtaMustardInverseStyle;

export const productCardAddToCartWrapClass =
  "absolute inset-x-3 bottom-3 z-[2] translate-y-1 opacity-100 transition-all duration-300 ease-out md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 motion-reduce:transition-none motion-reduce:md:opacity-100 motion-reduce:md:translate-y-0";

export const plpPatagoniaClasses = {
  page: "bg-white text-black",
  sidebarDivider: "border-[#E5E5E5]",
  filterSummary:
    "flex cursor-pointer list-none items-center gap-2 py-3.5 font-inter text-sm text-black [&::-webkit-details-marker]:hidden",
  filterChevron: "shrink-0 text-black/45 text-xs",
  imageBox:
    "relative aspect-square w-full overflow-hidden rounded-lg bg-[#F5F5F5]",
  imageInner: "absolute inset-0 flex items-center justify-center p-4",
  badge:
    "absolute left-2 top-2 z-[1] rounded bg-white px-2 py-0.5 font-inter text-[11px] font-medium text-black shadow-sm",
  swatch:
    "relative h-5 w-5 shrink-0 rounded-full border border-[#E5E5E5]",
  swatchActive: "border-2 border-black",
  title: "mt-3 line-clamp-2 font-inter text-sm font-semibold leading-snug text-black",
  price: "mt-1 font-inter text-sm text-black",
  priceSale: "font-inter text-sm font-medium text-[#CC0000]",
  priceCompare: "font-inter text-sm text-[#666666] line-through",
  addNowWrap: productCardAddToCartWrapClass,
  addNowBtn: productCardAddToCartBtnClass,
  addNowBtnStyle: productCardAddToCartBtnStyle,
} as const;
