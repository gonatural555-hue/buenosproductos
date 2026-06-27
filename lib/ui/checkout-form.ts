/** Inputs estilo Patagonia / Shopify checkout */
export const checkoutInputClass =
  "w-full h-12 rounded-md border border-[#DEDEDE] bg-white px-3 text-sm text-[#111] placeholder:text-[#737373] transition focus:border-[#111] focus:outline-none focus:ring-1 focus:ring-[#111]";

export const checkoutSelectClass = checkoutInputClass;

export const checkoutSectionTitleClass =
  "text-lg font-semibold text-[#111]";

export const checkoutRadioCardClass = (selected: boolean) =>
  [
    "rounded-md border px-4 py-4 transition",
    selected ? "border-2 border-[#111]" : "border border-[#DEDEDE]",
  ].join(" ");
