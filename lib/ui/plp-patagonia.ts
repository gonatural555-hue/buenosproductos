/** Tokens visuales PLP estilo Patagonia (listado productos / categoría). */
export const PLP_PATAGONIA = {
  pageBg: "#FFFFFF",
  imageBoxBg: "#F5F5F5",
  textPrimary: "#000000",
  textSecondary: "#666666",
  salePrice: "#CC0000",
  borderDivider: "#E5E5E5",
  imageRadius: "0.5rem",
} as const;

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
} as const;
