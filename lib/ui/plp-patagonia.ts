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

/** Botón “Add to cart” en product cards — negro, uppercase, esquinas rectas. */
export const productCardAddToCartBtnClass =
  "w-full rounded-none border border-black bg-[#000000] px-4 py-3 font-inter text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_8px_24px_-8px_rgba(0,0,0,0.35)] transition-[background-color,color,border-color,box-shadow,transform] duration-200 hover:border-black hover:bg-white hover:text-[#000000] hover:shadow-[0_8px_22px_-10px_rgba(0,0,0,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A441]/45 active:scale-[0.99] motion-reduce:transition-none";

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
} as const;
