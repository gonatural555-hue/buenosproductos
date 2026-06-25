"use client";

import Link from "next/link";
import type { VariantDefinition } from "@/lib/product-variants";
import type { VariantMatrix } from "@/lib/product-variants";
import { isOptionValid } from "@/lib/product-variant-matrix";
import type { UISurface } from "@/lib/ui-surface";
import {
  getPdpBuyBoxTheme,
  type PdpBrandTheme,
} from "@/lib/ui/pdp-theme";

type Props = {
  variant: VariantDefinition;
  selections: Record<string, string>;
  onSelect: (value: string, label: string) => void;
  onInteract?: () => void;
  variantMatrix?: VariantMatrix;
  sizeGuideHref?: string;
  sizeGuideLabel: string;
  surface?: UISurface;
  pdpBrand?: PdpBrandTheme;
  /** `rei` = botones rectangulares estilo retail. */
  appearance?: "pill" | "rei";
};

export default function SizeSelector({
  variant,
  selections,
  onSelect,
  onInteract,
  variantMatrix,
  sizeGuideHref,
  sizeGuideLabel,
  surface = "dark",
  pdpBrand = "go-natural",
  appearance = "pill",
}: Props) {
  const L = surface === "light";
  const gi = pdpBrand === "good-ideas";
  const rei = appearance === "rei";
  const theme = getPdpBuyBoxTheme(pdpBrand, surface);
  const current = selections[variant.type];

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className={theme.colorLabel}>{variant.label}</h3>
        {sizeGuideHref ? (
          <Link
            href={sizeGuideHref}
            className={
              gi
                ? "text-xs font-medium text-[rgba(232,236,241,0.72)] underline-offset-4 hover:text-[#60A5FA] hover:underline"
                : L
                  ? "text-xs font-medium text-neutral-700 underline-offset-4 hover:text-accent-gold hover:underline"
                  : "text-xs font-medium text-text-muted underline-offset-4 hover:text-accent-gold hover:underline"
            }
          >
            {sizeGuideLabel}
          </Link>
        ) : null}
      </div>
      <div className={rei ? "grid grid-cols-4 gap-2 sm:grid-cols-5" : "flex flex-wrap gap-2"}>
        {variant.options.map((option) => {
          const key = option.value || option.label;
          const active = current === key;
          const valid = isOptionValid(
            variant.type,
            key,
            selections,
            variantMatrix
          );

          const shapeClass = rei
            ? "min-h-[2.75rem] rounded-md px-2 py-2.5 text-sm"
            : "min-w-[2.75rem] rounded-full border px-3.5 py-2 text-sm";

          const focusRing = gi
            ? "focus-visible:ring-[#3B82F6]/50 focus-visible:ring-offset-[#0B0F14]"
            : L
              ? "focus-visible:ring-gn-forest/50 focus-visible:ring-offset-white"
              : "focus-visible:ring-gn-forest/50 focus-visible:ring-offset-dark-base";

          const stateClass = !valid
            ? theme.variantDisabled
            : active
              ? rei && L && !gi
                ? "border-gn-forest bg-gn-forest text-[#F4EBDD] shadow-sm"
                : theme.variantSelected
              : rei && L && !gi
                ? "border-neutral-300 bg-white text-neutral-900 hover:border-neutral-500"
                : theme.variantDefault;

          return (
            <button
              key={key}
              type="button"
              disabled={!valid}
              onClick={() => {
                onInteract?.();
                onSelect(key, option.label);
              }}
              aria-pressed={active}
              className={[
                shapeClass,
                "font-medium transition-all duration-200 ease-out border",
                "focus:outline-none focus-visible:ring-2",
                focusRing,
                stateClass,
              ].join(" ")}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
