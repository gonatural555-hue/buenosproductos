import type { Locale } from "@/lib/i18n/config";

/** Nombre visible de la marca Good Ideas → Good Products / Buenos Productos. */
export const GOOD_IDEAS_BRAND_NAME: Record<Locale, string> = {
  es: "Buenos Productos",
  en: "Good Products",
  fr: "Good Products",
  it: "Good Products",
};

export function getGoodIdeasBrandName(locale: Locale): string {
  return GOOD_IDEAS_BRAND_NAME[locale];
}
