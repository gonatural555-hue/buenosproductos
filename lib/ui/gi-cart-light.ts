/** Carrito / checkout — layout claro estilo Ninja (fondo #FFFFFF). */

export const GI_CART_CONTENT_MAX = "1315px";

/** Contenedor exterior: 1315px de contenido + padding lateral (32px). */
export const GI_CART_OUTER =
  "mx-auto w-full max-w-[calc(1315px+4rem)] px-8";

export const GI_CART_INNER = "mx-auto w-full max-w-[1315px]";

/** 855px + 460px = 1315px */
export const GI_CART_GRID =
  "lg:grid lg:grid-cols-[minmax(0,855fr)_minmax(0,460fr)] lg:gap-x-12 lg:gap-y-10";

export const GI_CART_TOP_PAD =
  "pt-[calc(env(safe-area-inset-top,0px)+5.5rem)] md:pt-[calc(env(safe-area-inset-top,0px)+6rem)]";

export const giCartText = {
  primary: "text-[#111111]",
  secondary: "text-[#737373]",
  border: "border-[#E5E5E5]",
  divider: "border-[#E5E5E5]",
  qtyBg: "bg-[#F2F2F2]",
  cta: "inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#111111] px-6 font-body text-sm font-semibold text-white transition hover:bg-[#333333]",
  link: "font-body text-sm text-[#111111] underline underline-offset-2 transition hover:text-[#737373]",
  backLink:
    "inline-flex items-center gap-1.5 font-body text-sm text-[#111111] transition hover:text-[#737373]",
  title: "font-body text-[28px] font-semibold tracking-tight text-[#111111] md:text-[32px]",
  itemTitle: "font-body text-[15px] font-semibold leading-snug text-[#111111]",
  itemMeta: "font-body text-[13px] text-[#737373]",
  summaryTitle: "font-body text-lg font-semibold text-[#111111]",
  price: "font-body text-[15px] font-semibold tabular-nums text-[#111111]",
  summaryRow: "flex justify-between gap-4 font-body text-sm text-[#737373]",
  summaryTotal: "flex justify-between gap-4 font-body text-base font-semibold text-[#111111]",
} as const;
