"use client";

import type { VariantDefinition, VariantMatrix } from "@/lib/product-variants";
import { isOptionValid } from "@/lib/product-variant-matrix";
import { swatchFillForOption } from "@/lib/pdp-variant-utils";
import type { UISurface } from "@/lib/ui-surface";
import {
  getPdpBuyBoxTheme,
  type PdpBrandTheme,
} from "@/lib/ui/pdp-theme";

type Props = {
  variant: VariantDefinition;
  selections: Record<string, string>;
  onSelect: (value: string, label: string) => void;
  variantMatrix?: VariantMatrix;
  surface?: UISurface;
  pdpBrand?: PdpBrandTheme;
};

export default function ColorSwatchSelector({
  variant,
  selections,
  onSelect,
  variantMatrix,
  surface = "dark",
  pdpBrand = "go-natural",
}: Props) {
  const theme = getPdpBuyBoxTheme(pdpBrand, surface);
  const current = selections[variant.type];

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className={theme.colorLabel}>{variant.label}</h3>
        {current ? (
          <span className={theme.colorValue}>
            {variant.options.find(
              (o) => (o.value || o.label) === current
            )?.label || current}
          </span>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2.5">
        {variant.options.map((option) => {
          const key = option.value || option.label;
          const active = current === key;
          const valid = isOptionValid(
            variant.type,
            key,
            selections,
            variantMatrix
          );
          const fill = swatchFillForOption(
            key,
            option.label,
            typeof option.swatchHex === "string" ? option.swatchHex : undefined
          );

          return (
            <button
              key={key}
              type="button"
              title={option.label}
              disabled={!valid}
              onClick={() => onSelect(key, option.label)}
              aria-pressed={active}
              className={[
                "relative h-9 w-9 rounded-full border-2 transition-all duration-200 ease-out",
                "focus:outline-none focus-visible:ring-2",
                theme.colorSwatchFocus,
                !valid ? "cursor-not-allowed opacity-35" : "hover:scale-105",
                active ? theme.colorSwatchActive : theme.colorSwatchIdle,
              ].join(" ")}
            >
              <span
                className="absolute inset-1 rounded-full ring-1 ring-black/10"
                style={{ backgroundColor: fill }}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
