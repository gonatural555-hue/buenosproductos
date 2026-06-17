"use client";

import Link from "next/link";
import type { VariantDefinition } from "@/lib/product-variants";
import type { VariantMatrix } from "@/lib/product-variants";
import { isOptionValid } from "@/lib/product-variant-matrix";
import type { UISurface } from "@/lib/ui-surface";

type Props = {
  variant: VariantDefinition;
  selections: Record<string, string>;
  onSelect: (value: string, label: string) => void;
  onInteract?: () => void;
  variantMatrix?: VariantMatrix;
  sizeGuideHref?: string;
  sizeGuideLabel: string;
  surface?: UISurface;
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
  appearance = "pill",
}: Props) {
  const L = surface === "light";
  const rei = appearance === "rei";
  const current = selections[variant.type];

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3
          className={
            L
              ? "text-xs font-semibold uppercase tracking-[0.14em] text-neutral-600"
              : "text-xs font-semibold uppercase tracking-[0.14em] text-text-muted"
          }
        >
          {variant.label}
        </h3>
        {sizeGuideHref ? (
          <Link
            href={sizeGuideHref}
            className={
              L
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
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-gn-forest/50 focus-visible:ring-offset-2",
                L ? "focus-visible:ring-offset-white" : "focus-visible:ring-offset-dark-base",
                !valid
                  ? L
                    ? "cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400"
                    : "cursor-not-allowed border-white/10 bg-dark-surface/30 text-text-muted"
                  : active
                  ? rei
                    ? L
                      ? "border-gn-forest bg-gn-forest text-[#F4EBDD] shadow-sm"
                      : "border-accent-gold bg-dark-surface text-text-primary ring-1 ring-accent-gold/50"
                    : L
                    ? "border-accent-gold bg-white text-neutral-900 shadow-[0_0_0_1px_rgba(212,175,55,0.25)]"
                    : "border-accent-gold bg-dark-surface text-text-primary ring-1 ring-accent-gold/50"
                  : L
                  ? rei
                    ? "border-neutral-300 bg-white text-neutral-900 hover:border-neutral-500"
                    : "border-neutral-200 bg-neutral-50 text-neutral-900 hover:border-neutral-400"
                  : "border-white/15 bg-dark-surface/55 text-text-primary hover:border-white/35",
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
