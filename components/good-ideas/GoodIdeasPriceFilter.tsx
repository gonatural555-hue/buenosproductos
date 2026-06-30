"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { convertFromUsd, convertToUsd } from "@/lib/currency/convert";
import {
  GOOD_IDEAS_PRICE_PRESETS,
  isGoodIdeasPricePresetActive,
  type GoodIdeasPriceFilter,
  type GoodIdeasPricePreset,
} from "@/lib/good-ideas-plp-price";
import {
  buildGoodIdeasProductsListHref,
  buildGoodIdeasPreserveParams,
} from "@/lib/good-ideas-plp-segments";
import type { Locale } from "@/lib/i18n/config";
import { giPlpClasses } from "@/lib/ui/good-ideas-plp";
import { giType } from "@/lib/ui/gi-typography";

type Props = {
  locale: Locale;
  label: string;
  minLabel: string;
  maxLabel: string;
  applyLabel: string;
  presetLabels: Record<string, string>;
  activeFilter: GoodIdeasPriceFilter;
  preserve: {
    q?: string;
    sort?: string;
    category?: string | null;
    brand?: string | null;
  };
  embedded?: boolean;
};

function buildPresetHref(
  locale: Locale,
  preset: GoodIdeasPricePreset,
  preserve: Props["preserve"]
) {
  return buildGoodIdeasProductsListHref(
    locale,
    buildGoodIdeasPreserveParams({
      ...preserve,
      priceMin: preset.min,
      priceMax: preset.max,
    })
  );
}

export default function GoodIdeasPriceFilter({
  locale,
  label,
  minLabel,
  maxLabel,
  applyLabel,
  presetLabels,
  activeFilter,
  preserve,
  embedded = false,
}: Props) {
  const { currency, rates, formatMoney, convertMoney } = useCurrency();
  const isActive =
    activeFilter.min != null || activeFilter.max != null;

  const displayMinDefault =
    activeFilter.min != null
      ? String(Math.round(convertMoney(activeFilter.min)))
      : "";
  const displayMaxDefault =
    activeFilter.max != null
      ? String(Math.round(convertMoney(activeFilter.max)))
      : "";

  const [minInput, setMinInput] = useState(displayMinDefault);
  const [maxInput, setMaxInput] = useState(displayMaxDefault);

  const presetLinks = useMemo(
    () =>
      GOOD_IDEAS_PRICE_PRESETS.map((preset) => ({
        preset,
        href: buildPresetHref(locale, preset, preserve),
        active: isGoodIdeasPricePresetActive(activeFilter, preset),
        label:
          presetLabels[preset.id] ??
          formatPresetLabel(preset, formatMoney),
      })),
    [activeFilter, formatMoney, locale, presetLabels, preserve]
  );

  const handleApply = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const minRaw = (form.elements.namedItem("gi-price-min") as HTMLInputElement)
      ?.value;
    const maxRaw = (form.elements.namedItem("gi-price-max") as HTMLInputElement)
      ?.value;

    const minUsd =
      minRaw?.trim() !== ""
        ? convertToUsd(Number.parseFloat(minRaw), currency, rates)
        : null;
    const maxUsd =
      maxRaw?.trim() !== ""
        ? convertToUsd(Number.parseFloat(maxRaw), currency, rates)
        : null;

    const href = buildGoodIdeasProductsListHref(
      locale,
      buildGoodIdeasPreserveParams({
        ...preserve,
        priceMin: minUsd != null && Number.isFinite(minUsd) ? minUsd : null,
        priceMax: maxUsd != null && Number.isFinite(maxUsd) ? maxUsd : null,
      })
    );
    window.location.href = href;
  };

  const body = (
    <div className="space-y-3 pb-1">
      <ul className="space-y-1">
        {presetLinks.map(({ preset, href, active, label: presetLabel }) => (
          <li key={preset.id}>
            <Link
              href={href}
              className={
                active
                  ? giPlpClasses.categoryLinkActive
                  : giPlpClasses.categoryLink
              }
            >
              {presetLabel}
            </Link>
          </li>
        ))}
      </ul>

      <form onSubmit={handleApply} className="space-y-2 pt-1">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label
              htmlFor={embedded ? "gi-price-min-mobile" : "gi-price-min"}
              className={giPlpClasses.priceFieldLabel}
            >
              {minLabel}
            </label>
            <input
              id={embedded ? "gi-price-min-mobile" : "gi-price-min"}
              name="gi-price-min"
              type="number"
              min={0}
              step={1}
              inputMode="numeric"
              value={minInput}
              onChange={(e) => setMinInput(e.target.value)}
              placeholder="0"
              className={giPlpClasses.priceFieldInput}
            />
          </div>
          <div>
            <label
              htmlFor={embedded ? "gi-price-max-mobile" : "gi-price-max"}
              className={giPlpClasses.priceFieldLabel}
            >
              {maxLabel}
            </label>
            <input
              id={embedded ? "gi-price-max-mobile" : "gi-price-max"}
              name="gi-price-max"
              type="number"
              min={0}
              step={1}
              inputMode="numeric"
              value={maxInput}
              onChange={(e) => setMaxInput(e.target.value)}
              placeholder="—"
              className={giPlpClasses.priceFieldInput}
            />
          </div>
        </div>
        <button
          type="submit"
          className={`w-full rounded-full border border-[var(--gi-primary)]/40 bg-[var(--gi-primary)]/15 py-2 ${giType.btnSm} text-[var(--gi-primary)] transition hover:bg-[var(--gi-primary)]/25`}
        >
          {applyLabel}
        </button>
      </form>
    </div>
  );

  if (embedded) {
    return body;
  }

  return (
    <details
      className={`group border-t ${giPlpClasses.sidebarDivider}`}
      open={isActive}
    >
      <summary className={giPlpClasses.filterSummary}>
        <span
          className={`${giPlpClasses.filterChevron} transition-transform group-open:rotate-180`}
          aria-hidden
        >
          ▾
        </span>
        <span>{label}</span>
      </summary>
      <div className="pb-4 pl-5">{body}</div>
    </details>
  );
}

function formatPresetLabel(
  preset: GoodIdeasPricePreset,
  formatMoney: (usd: number) => string
): string {
  if (preset.min == null && preset.max != null) {
    return `< ${formatMoney(preset.max)}`;
  }
  if (preset.min != null && preset.max == null) {
    return `> ${formatMoney(preset.min)}`;
  }
  if (preset.min != null && preset.max != null) {
    return `${formatMoney(preset.min)} – ${formatMoney(preset.max)}`;
  }
  return "";
}
