import type { DisplayCurrency } from "@/lib/currency/config";

export type ExchangeRatesFromUsd = Record<DisplayCurrency, number>;

export function convertFromUsd(
  amountUsd: number,
  currency: DisplayCurrency,
  rates: ExchangeRatesFromUsd
): number {
  const rate = rates[currency] ?? 1;
  return amountUsd * rate;
}
