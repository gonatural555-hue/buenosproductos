"use client";

import type { VariantDefinition, VariantMatrix } from "@/lib/product-variants";
import { isOptionValid } from "@/lib/product-variant-matrix";
import { swatchFillForOption } from "@/lib/pdp-variant-utils";
import type { UISurface } from "@/lib/ui-surface";

type Props = {
  variant: VariantDefinition;
  selections: Record<string, string>;
  onSelect: (value: string, label: string) => void;
  variantMatrix?: VariantMatrix;
  surface?: UISurface;
};

export default function ColorSwatchSelector({
  variant,
  selections,
  onSelect,
  variantMatrix,
  surface = "dark",
}: Props) {
  const L = surface === "light";
  const current = selections[variant.type];

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <h3
          className={
            L
              ? "text-xs font-semibold uppercase tracking-[0.14em] text-neutral-600"
              : "text-xs font-semibold uppercase tracking-[0.14em] text-text-muted"
          }
        >
          {variant.label}
        </h3>
        {current ? (
          <span className={L ? "text-sm text-neutral-800" : "text-sm text-text-primary"}>
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
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2",
                L ? "focus-visible:ring-offset-white" : "focus-visible:ring-offset-dark-base",
                !valid ? "cursor-not-allowed opacity-35" : "hover:scale-105",
                active
                  ? "border-accent-gold shadow-[0_0_0_1px_rgba(212,175,55,0.35)]"
                  : L
                  ? "border-neutral-300 hover:border-neutral-500"
                  : "border-white/25 hover:border-white/45",
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
