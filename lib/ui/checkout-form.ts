import { giCartText } from "@/lib/ui/gi-cart-light";

/** Inputs estilo Patagonia / Shopify checkout */
export const checkoutInputClass =
  "w-full h-12 rounded-md border border-[#DEDEDE] bg-white px-3 text-sm text-[#111] placeholder:text-[#737373] transition focus:border-[#111] focus:outline-none focus:ring-1 focus:ring-[#111]";

export const checkoutSelectClass = checkoutInputClass;

/** Misma escala que títulos del carrito (gi-cart-light). */
export const checkoutSectionTitleClass = giCartText.title;

export const checkoutPaymentCardClass = (selected: boolean) =>
  [
    "rounded-xl border px-4 py-4 transition",
    selected
      ? "border-2 border-accent-gold/55 bg-gradient-to-br from-accent-gold/14 via-warm-sand/95 to-soft-stone shadow-[0_10px_36px_-18px_rgba(17,23,19,0.12)]"
      : "border border-[#E5E5E5] bg-gradient-to-br from-accent-gold/6 via-white to-warm-sand/50 hover:border-accent-gold/35",
  ].join(" ");

/** @deprecated Usar checkoutPaymentCardClass */
export const checkoutRadioCardClass = checkoutPaymentCardClass;
