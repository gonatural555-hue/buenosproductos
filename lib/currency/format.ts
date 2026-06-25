import type { Locale } from "@/lib/i18n/config";
import {
  type DisplayCurrency,
  intlLocaleForCurrency,
} from "@/lib/currency/config";
import { convertFromUsd, type ExchangeRatesFromUsd } from "@/lib/currency/convert";

export function formatDisplayMoney(
  amountUsd: number,
  currency: DisplayCurrency,
  rates: ExchangeRatesFromUsd,
  locale: Locale
): string {
  const converted = convertFromUsd(amountUsd, currency, rates);
  const intlLocale = intlLocaleForCurrency(currency, locale);

  const fractionDigits =
    currency === "USD" ? { min: 0, max: 0 } : { min: 0, max: 2 };

  return new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency,
    minimumFractionDigits: fractionDigits.min,
    maximumFractionDigits: fractionDigits.max,
  }).format(converted);
}
