"use client";

import { useEffect, useMemo, useState } from "react";
import CurrencyDisclaimer from "@/components/currency/CurrencyDisclaimer";
import { useTranslations } from "@/components/i18n/LocaleProvider";
import { useCurrency } from "@/context/CurrencyContext";
import {
  formatFlashSaleCountdown,
  getFlashSaleCountdownParts,
  getFlashSaleEndMs,
  hasActivePromoPrice,
} from "@/lib/flash-sale-countdown";

type Props = {
  productId: string;
  salePriceUsd: number;
  compareAtPriceUsd?: number;
  flashSaleHours?: number;
  taxNote?: string | null;
  currencyDisclaimerClassName?: string;
  variant?: "default" | "compact" | "sticky";
};

export default function PdpPromoPriceBlock({
  productId,
  salePriceUsd,
  compareAtPriceUsd,
  flashSaleHours = 24,
  taxNote,
  currencyDisclaimerClassName = "font-body text-xs text-[#6B7280]",
  variant = "default",
}: Props) {
  const t = useTranslations();
  const { formatMoney } = useCurrency();
  const promoActive = hasActivePromoPrice(salePriceUsd, compareAtPriceUsd);

  const endMs = useMemo(() => {
    if (!promoActive) return 0;
    return getFlashSaleEndMs(productId, flashSaleHours);
  }, [flashSaleHours, productId, promoActive]);

  const [countdown, setCountdown] = useState(() =>
    promoActive ? getFlashSaleCountdownParts(endMs) : { hours: 0, minutes: 0, seconds: 0, expired: true }
  );

  useEffect(() => {
    if (!promoActive) return;

    const tick = () => setCountdown(getFlashSaleCountdownParts(endMs));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [endMs, promoActive]);

  if (!promoActive || !compareAtPriceUsd) {
    if (variant === "sticky") {
      return (
        <p className="font-body text-lg font-bold tabular-nums text-[#111111]">
          {formatMoney(salePriceUsd)}
        </p>
      );
    }

    return (
      <div className="space-y-2">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p
            className={
              variant === "compact"
                ? "font-body text-base font-bold tabular-nums text-[#111111] sm:text-lg"
                : "font-display text-[clamp(1.75rem,4.5vw,2.25rem)] font-bold tabular-nums tracking-[-0.02em] text-[#111111]"
            }
          >
            {formatMoney(salePriceUsd)}
          </p>
        </div>
        {taxNote ? <p className="font-body text-xs text-[#6B7280]">{taxNote}</p> : null}
        <CurrencyDisclaimer className={currencyDisclaimerClassName} />
      </div>
    );
  }

  const savePercent = Math.round(
    ((compareAtPriceUsd - salePriceUsd) / compareAtPriceUsd) * 100
  );

  if (variant === "sticky") {
    return (
      <div className="min-w-0">
        <p className="font-body text-lg font-bold tabular-nums text-[#EF4444]">
          {formatMoney(salePriceUsd)}
        </p>
        {!countdown.expired ? (
          <p className="mt-0.5 font-body text-[11px] font-semibold tabular-nums text-[#B91C1C]">
            <span className="uppercase tracking-[0.04em]">
              {t("goodIdeas.pdp.dtc.countdownLabel")}{" "}
            </span>
            <time dateTime={new Date(endMs).toISOString()}>
              {formatFlashSaleCountdown(countdown)}
            </time>
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-[#EF4444] px-2.5 py-1 font-body text-[11px] font-bold uppercase tracking-[0.08em] text-white shadow-[0_6px_18px_rgba(239,68,68,0.35)]">
          {t("goodIdeas.pdp.dtc.offerBadge")}
        </span>
        {!countdown.expired ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FECACA] bg-[#FEF2F2] px-2.5 py-1 font-body text-[11px] font-semibold tabular-nums text-[#B91C1C]">
            <span className="uppercase tracking-[0.06em] text-[#991B1B]">
              {t("goodIdeas.pdp.dtc.countdownLabel")}
            </span>
            <time dateTime={new Date(endMs).toISOString()}>
              {formatFlashSaleCountdown(countdown)}
            </time>
          </span>
        ) : null}
        {savePercent > 0 ? (
          <span className="font-body text-xs font-semibold uppercase tracking-wide text-[#EF4444]">
            {t("goodIdeas.pdp.dtc.saveBadge").replace("{percent}", String(savePercent))}
          </span>
        ) : null}
      </div>

      <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
        <p
          className={
            variant === "compact"
              ? "font-body text-xl font-bold tabular-nums text-[#EF4444] sm:text-2xl"
              : "font-display text-[clamp(2rem,5vw,2.65rem)] font-bold tabular-nums tracking-[-0.03em] text-[#EF4444]"
          }
        >
          {formatMoney(salePriceUsd)}
        </p>
        <p
          className={
            variant === "compact"
              ? "font-body text-sm font-medium tabular-nums text-[#9CA3AF] line-through decoration-[#CBD5E1]"
              : "font-body text-lg font-medium tabular-nums text-[#9CA3AF] line-through decoration-[#CBD5E1] sm:text-xl"
          }
          aria-label={t("goodIdeas.pdp.dtc.previousPriceAria")}
        >
          {formatMoney(compareAtPriceUsd)}
        </p>
      </div>

      {taxNote ? <p className="font-body text-xs text-[#6B7280]">{taxNote}</p> : null}
      <CurrencyDisclaimer className={currencyDisclaimerClassName} />
    </div>
  );
}
