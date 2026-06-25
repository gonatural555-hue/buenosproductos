import type { Locale } from "@/lib/i18n/config";

export const currencies = ["ARS", "BRL", "USD"] as const;
export type DisplayCurrency = (typeof currencies)[number];

export const DEFAULT_DISPLAY_CURRENCY: DisplayCurrency = "ARS";

export const CURRENCY_STORAGE_KEY = "gn-display-currency";

/** Tasas de display USD → moneda (definidas por el negocio). */
export const EXCHANGE_RATES_FROM_USD: Record<DisplayCurrency, number> = {
  USD: 1,
  ARS: 1445,
  BRL: 5.21,
};

/** @deprecated Usar `EXCHANGE_RATES_FROM_USD`. */
export const FALLBACK_RATES_FROM_USD = EXCHANGE_RATES_FROM_USD;

export function isDisplayCurrency(value: string): value is DisplayCurrency {
  return (currencies as readonly string[]).includes(value);
}

export function intlLocaleForCurrency(
  currency: DisplayCurrency,
  locale: Locale
): string {
  if (currency === "ARS") return "es-AR";
  if (currency === "BRL") return "pt-BR";
  if (locale === "es") return "es-AR";
  if (locale === "fr") return "fr-FR";
  if (locale === "it") return "it-IT";
  return "en-US";
}
