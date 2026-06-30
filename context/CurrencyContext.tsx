"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { convertFromUsd, type ExchangeRatesFromUsd } from "@/lib/currency/convert";
import {
  CURRENCY_STORAGE_KEY,
  DEFAULT_DISPLAY_CURRENCY,
  EXCHANGE_RATES_FROM_USD,
  type DisplayCurrency,
  isDisplayCurrency,
} from "@/lib/currency/config";
import { formatDisplayMoney } from "@/lib/currency/format";

type CurrencyContextValue = {
  currency: DisplayCurrency;
  setCurrency: (currency: DisplayCurrency) => void;
  rates: ExchangeRatesFromUsd;
  ratesLoading: boolean;
  ratesSource: string | null;
  formatMoney: (amountUsd: number) => string;
  convertMoney: (amountUsd: number) => number;
};

const CurrencyContext = createContext<CurrencyContextValue | undefined>(
  undefined
);

function readStoredCurrency(): DisplayCurrency {
  if (typeof window === "undefined") return DEFAULT_DISPLAY_CURRENCY;
  const stored = window.localStorage.getItem(CURRENCY_STORAGE_KEY);
  if (stored && isDisplayCurrency(stored)) return stored;
  return DEFAULT_DISPLAY_CURRENCY;
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const [currency, setCurrencyState] = useState<DisplayCurrency>(
    DEFAULT_DISPLAY_CURRENCY
  );
  const [rates] = useState<ExchangeRatesFromUsd>(EXCHANGE_RATES_FROM_USD);
  const ratesLoading = false;
  const ratesSource = "fixed";

  useEffect(() => {
    setCurrencyState(readStoredCurrency());
  }, []);

  const setCurrency = useCallback((next: DisplayCurrency) => {
    setCurrencyState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CURRENCY_STORAGE_KEY, next);
    }
  }, []);

  const convertMoney = useCallback(
    (amountUsd: number) => convertFromUsd(amountUsd, currency, rates),
    [currency, rates]
  );

  const formatMoney = useCallback(
    (amountUsd: number) =>
      formatDisplayMoney(amountUsd, currency, rates, locale),
    [currency, rates, locale]
  );

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      rates,
      ratesLoading,
      ratesSource,
      formatMoney,
      convertMoney,
    }),
    [
      currency,
      setCurrency,
      rates,
      ratesLoading,
      ratesSource,
      formatMoney,
      convertMoney,
    ]
  );

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return context;
}

/** Formateo seguro fuera del provider (p. ej. SSR sin moneda elegida). */
export function formatMoneyFallback(
  amountUsd: number,
  locale: Parameters<typeof formatDisplayMoney>[3]
): string {
  return formatDisplayMoney(
    amountUsd,
    DEFAULT_DISPLAY_CURRENCY,
    EXCHANGE_RATES_FROM_USD,
    locale
  );
}
