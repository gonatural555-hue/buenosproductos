"use client";

import type { UISurface } from "@/lib/ui-surface";
import {
  getPdpBuyBoxTheme,
  type PdpBrandTheme,
} from "@/lib/ui/pdp-theme";

type Props = {
  value: number;
  onChange: (next: number) => void;
  label: string;
  surface?: UISurface;
  pdpBrand?: PdpBrandTheme;
  min?: number;
  max?: number;
};

export default function PdpQuantitySelector({
  value,
  onChange,
  label,
  surface = "light",
  pdpBrand = "go-natural",
  min = 1,
  max = 99,
}: Props) {
  const theme = getPdpBuyBoxTheme(pdpBrand, surface);

  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <section className="space-y-2.5">
      <h3 className={theme.qtyLabel}>{label}</h3>
      <div
        className={theme.qtyContainer}
        role="group"
        aria-label={label}
      >
        <button
          type="button"
          onClick={dec}
          disabled={value <= min}
          className={theme.qtyBtn}
          aria-label="Disminuir cantidad"
        >
          −
        </button>
        <span className={theme.qtyValue} aria-live="polite">
          {value}
        </span>
        <button
          type="button"
          onClick={inc}
          disabled={value >= max}
          className={theme.qtyBtn}
          aria-label="Aumentar cantidad"
        >
          +
        </button>
      </div>
    </section>
  );
}
