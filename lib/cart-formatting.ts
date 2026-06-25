import type { Locale } from "@/lib/i18n/config";
import {
  DEFAULT_DISPLAY_CURRENCY,
  EXCHANGE_RATES_FROM_USD,
} from "@/lib/currency/config";
import { formatDisplayMoney } from "@/lib/currency/format";

/** @deprecated Preferí `useCurrency().formatMoney` en componentes cliente. */
export function formatCartPrice(locale: Locale, price: number): string {
  return formatDisplayMoney(
    price,
    DEFAULT_DISPLAY_CURRENCY,
    EXCHANGE_RATES_FROM_USD,
    locale
  );
}

type VariantSelection = {
  type: string;
  typeLabel?: string;
  value: string;
  label?: string;
};

/** Misma lógica que el resumen de variantes en la página de carrito. */
export function formatCartVariantSummary(
  variantSelections: VariantSelection[] | undefined,
  variantSummary: string | undefined,
  t: (key: string, fallback?: string | unknown) => string
): string {
  if (variantSelections && variantSelections.length > 0) {
    return variantSelections
      .map((selection) => {
        const label = t(
          `cartPage.variantLabels.${selection.type}`,
          selection.typeLabel || selection.type
        );
        const optionKey = `cartPage.variantOptions.${selection.type}.${selection.value}`;
        const value = t(optionKey, selection.label || selection.value);
        return `${label}: ${value}`;
      })
      .join(" · ");
  }

  return variantSummary || "";
}
