"use client";

import { useTranslations } from "@/components/i18n/LocaleProvider";
import { useCurrency } from "@/context/CurrencyContext";
import { giType } from "@/lib/ui/gi-typography";
import { currencies, type DisplayCurrency } from "@/lib/currency/config";

type Variant = "utility" | "good-ideas" | "light";

type Props = {
  variant?: Variant;
};

export default function HeaderCurrencySwitcher({ variant = "utility" }: Props) {
  const t = useTranslations();
  const { currency, setCurrency } = useCurrency();

  if (variant === "light") {
    return (
      <nav
        className="flex items-center gap-0.5 rounded-full border border-[#E5E7EB] bg-[#F9FAFB] p-0.5"
        aria-label={t("header.currencyNavAria")}
      >
        {currencies.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setCurrency(code)}
            className={`rounded-full px-2.5 py-1 ${giType.navUtility} ${
              code === currency
                ? "bg-white font-semibold text-[#0B0F14] shadow-sm"
                : "text-[#6B7280] hover:text-[#0B0F14]"
            }`}
            aria-pressed={code === currency}
          >
            {code}
          </button>
        ))}
      </nav>
    );
  }

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
            className={`rounded-full px-2.5 py-1 ${giType.navUtility} ${
              code === currency
                ? "text-[var(--gi-primary)]"
                : "text-white hover:text-[var(--gi-primary)]"
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
