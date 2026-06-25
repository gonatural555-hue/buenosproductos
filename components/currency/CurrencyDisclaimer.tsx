"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { useTranslations } from "@/components/i18n/LocaleProvider";

type Props = {
  className?: string;
};

export default function CurrencyDisclaimer({ className }: Props) {
  const { currency } = useCurrency();
  const t = useTranslations();

  if (currency === "USD") return null;

  return (
    <p className={className}>
      {t("currency.checkoutDisclaimer", "").replace("{currency}", currency)}
    </p>
  );
}
