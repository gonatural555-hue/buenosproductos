"use client";

import { useTranslations } from "@/components/i18n/LocaleProvider";
import { useCurrency } from "@/context/CurrencyContext";
import { currencies, type DisplayCurrency } from "@/lib/currency/config";

type Variant = "utility" | "good-ideas";

type Props = {
  variant?: Variant;
};

export default function HeaderCurrencySwitcher({ variant = "utility" }: Props) {
  const t = useTranslations();
  const { currency, setCurrency } = useCurrency();

  if (variant === "good-ideas") {
    return (
      <nav
        className="flex items-center gap-0.5 rounded-full border border-white/10 px-1 py-0.5"
        aria-label={t("header.currencyNavAria")}
      >
        {currencies.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setCurrency(code)}
            className={`rounded-full px-2 py-1 font-inter text-[10px] font-semibold uppercase tracking-[0.12em] transition ${
              code === currency
                ? "bg-white/12 text-white"
                : "text-white/45 hover:text-white/80"
            }`}
            aria-pressed={code === currency}
          >
            {code}
          </button>
        ))}
      </nav>
    );
  }

  return (
    <nav
      className="gn-rei-utility__currencies"
      aria-label={t("header.currencyNavAria")}
    >
      {currencies.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setCurrency(code as DisplayCurrency)}
          className={`gn-rei-utility__currency${
            code === currency ? " gn-rei-utility__currency--active" : ""
          }`}
          aria-pressed={code === currency}
          title={t(`header.currencies.${code}`)}
        >
          {code}
        </button>
      ))}
    </nav>
  );
}
