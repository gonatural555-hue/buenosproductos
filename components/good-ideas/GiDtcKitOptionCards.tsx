"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import SmartImage from "@/components/SmartImage";
import { useTranslations } from "@/components/i18n/LocaleProvider";
import { useCurrency } from "@/context/CurrencyContext";
import {
  formatFlashSaleCountdown,
  getFlashSaleCountdownParts,
  getFlashSaleEndMs,
  hasActivePromoPrice,
} from "@/lib/flash-sale-countdown";
import {
  getGiKitOptionMeta,
  resolveKitOptionPrices,
} from "@/lib/good-ideas-kit-option-copy";
import { isValidCombination } from "@/lib/product-variant-matrix";
import type { VariantDefinition, VariantMatrix } from "@/lib/product-variants";
import { isValidImageSrc } from "@/lib/image-src";

type Props = {
  productId: string;
  kitVariant: VariantDefinition;
  selections: Record<string, string>;
  onSelectionsChange: (next: Record<string, string>) => void;
  variantMatrix?: VariantMatrix;
  basePrice: number;
  baseCompareAtPrice?: number;
  productImage?: string;
  flashSaleHours?: number;
  freeShipping?: boolean;
};

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.333a1 1 0 0 1-1.435-.02L3.29 9.53a1 1 0 1 1 1.42-1.406l3.186 3.207 6.538-6.61a1 1 0 0 1 1.27-.43Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function GiDtcKitOptionCards({
  productId,
  kitVariant,
  selections,
  onSelectionsChange,
  variantMatrix,
  basePrice,
  baseCompareAtPrice,
  productImage,
  flashSaleHours = 24,
  freeShipping,
}: Props) {
  const t = useTranslations();
  const { formatMoney } = useCurrency();
  const currentValue = selections[kitVariant.type];
  const imageSrc = isValidImageSrc(productImage) ? productImage : null;

  const promoActiveFor = useCallback(
    (sale: number, compare?: number) => hasActivePromoPrice(sale, compare),
    []
  );

  const endMs = useMemo(
    () => getFlashSaleEndMs(productId, flashSaleHours),
    [flashSaleHours, productId]
  );

  const [countdown, setCountdown] = useState(() =>
    getFlashSaleCountdownParts(endMs)
  );

  useEffect(() => {
    const tick = () => setCountdown(getFlashSaleCountdownParts(endMs));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [endMs]);

  const handleSelect = useCallback(
    (optionValue: string) => {
      const next = { ...selections, [kitVariant.type]: optionValue };
      if (isValidCombination(next, variantMatrix)) {
        onSelectionsChange(next);
      }
    },
    [kitVariant.type, onSelectionsChange, selections, variantMatrix]
  );

  return (
    <section className="space-y-3" aria-label={t("goodIdeas.pdp.kitOptions.heading")}>
      <h3 className="font-body text-xs font-semibold uppercase tracking-[0.12em] text-[#374151]">
        {t("goodIdeas.pdp.kitOptions.heading")}
      </h3>

      <div className="flex flex-col gap-3">
        {kitVariant.options.map((option) => {
          const optionKey = option.value || option.label;
          const isActive = currentValue === optionKey;
          const meta = getGiKitOptionMeta(productId, optionKey);
          const { salePrice, compareAtPrice, savePercent } = resolveKitOptionPrices(
            basePrice,
            baseCompareAtPrice,
            option.priceModifier ?? 0,
            option.compareAtPriceModifier ?? 0
          );
          const promoActive = promoActiveFor(salePrice, compareAtPrice);
          const title = meta
            ? t(meta.titleKey)
            : option.label;
          const includes = meta ? t(meta.includesKey) : option.label;

          return (
            <button
              key={optionKey}
              type="button"
              onClick={() => handleSelect(optionKey)}
              aria-pressed={isActive}
              className={[
                "relative w-full overflow-hidden rounded-2xl border text-left transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/45 focus-visible:ring-offset-2 motion-reduce:transition-none",
                isActive
                  ? "border-[#2563EB] bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white shadow-[0_12px_32px_rgba(59,130,246,0.22)]"
                  : "border-[#E5E7EB] bg-white text-[#111111] hover:border-[#9CA3AF] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]",
              ].join(" ")}
            >
              {meta?.recommended ? (
                <span
                  className="absolute right-4 top-0 z-[2] -translate-y-1/2 rounded-full bg-[#111111] px-3 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_4px_12px_rgba(0,0,0,0.18)]"
                >
                  {t("goodIdeas.pdp.kitOptions.mostPopular")}
                </span>
              ) : null}

              <div className="flex items-start gap-3 p-4 sm:gap-4 sm:p-4">
                <div
                  className={[
                    "relative h-14 w-14 shrink-0 overflow-hidden rounded-xl sm:h-16 sm:w-16",
                    isActive ? "ring-2 ring-white/25" : "bg-[#FAFAFA]",
                  ].join(" ")}
                >
                  {imageSrc ? (
                    <SmartImage
                      src={imageSrc}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover object-center"
                    />
                  ) : (
                    <div
                      className={[
                        "flex h-full w-full items-center justify-center font-body text-xs font-semibold",
                        isActive ? "text-white/70" : "text-[#9CA3AF]",
                      ].join(" ")}
                    >
                      {meta?.packLabel ?? "•"}
                    </div>
                  )}
                  {meta?.packLabel ? (
                    <span
                      className={[
                        "absolute bottom-1 left-1 rounded-full px-1.5 py-0.5 font-body text-[10px] font-bold leading-none",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-[#111111] text-white",
                      ].join(" ")}
                    >
                      {meta.packLabel}
                    </span>
                  ) : null}
                </div>

                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p
                      className={[
                        "font-body text-sm font-semibold leading-snug sm:text-[15px]",
                        isActive ? "text-white" : "text-[#111111]",
                      ].join(" ")}
                    >
                      {title}
                    </p>
                    {meta?.basic && !isActive ? (
                      <span className="rounded-full bg-[#F3F4F6] px-2 py-0.5 font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6B7280]">
                        {t("goodIdeas.pdp.kitOptions.basicBadge")}
                      </span>
                    ) : null}
                    {isActive && promoActive && savePercent > 0 ? (
                      <span className="rounded-full bg-white/18 px-2 py-0.5 font-body text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
                        {t("goodIdeas.pdp.dtc.saveBadge", "").replace(
                          "{percent}",
                          String(savePercent)
                        )}
                      </span>
                    ) : null}
                  </div>

                  {isActive ? (
                    <ul className="mt-3 space-y-2">
                      {freeShipping ? (
                        <li className="flex items-start gap-2 font-body text-sm leading-snug text-white/92">
                          <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#BBF7D0]" />
                          <span>{t("goodIdeas.pdp.kitOptions.freeShippingBullet")}</span>
                        </li>
                      ) : null}
                      <li className="flex items-start gap-2 font-body text-sm leading-snug text-white/92">
                        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#BBF7D0]" />
                        <span>{includes}</span>
                      </li>
                    </ul>
                  ) : null}
                </div>

                <div className="shrink-0 text-right">
                  <p
                    className={[
                      "font-body text-base font-bold tabular-nums sm:text-lg",
                      isActive ? "text-white" : "text-[#111111]",
                    ].join(" ")}
                  >
                    {formatMoney(salePrice)}
                  </p>
                  {promoActive && compareAtPrice ? (
                    <p
                      className={[
                        "mt-0.5 font-body text-xs font-medium tabular-nums line-through sm:text-sm",
                        isActive ? "text-white/70" : "text-[#9CA3AF]",
                      ].join(" ")}
                      aria-label={t("goodIdeas.pdp.dtc.previousPriceAria")}
                    >
                      {formatMoney(compareAtPrice)}
                    </p>
                  ) : null}
                </div>
              </div>

              {isActive && promoActive && !countdown.expired ? (
                <div className="border-t border-white/15 bg-black/10 px-4 py-2.5">
                  <p className="font-body text-xs font-medium text-white/88">
                    {t("goodIdeas.pdp.kitOptions.offer24hFooter", "")
                      .replace("{time}", formatFlashSaleCountdown(countdown))}
                  </p>
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
