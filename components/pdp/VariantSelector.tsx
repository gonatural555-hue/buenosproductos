"use client";

import { useCallback } from "react";
import BaseVariantSelector from "@/components/VariantSelector";
import ColorSwatchSelector from "@/components/pdp/ColorSwatchSelector";
import SizeSelector from "@/components/pdp/SizeSelector";
import { usePdpProductStateContext } from "@/context/PdpProductStateContext";
import { isValidCombination } from "@/lib/product-variant-matrix";
import { resolveSwatchHex } from "@/lib/color-swatch";
import { resolvePdpBrandTheme } from "@/lib/ui/pdp-theme";
import type { UISurface } from "@/lib/ui-surface";

type Props = {
  /** Compacto para sticky bar; completo para buy box externo. */
  mode?: "compact" | "full";
  surface?: UISurface;
  sizeGuideHref?: string;
  sizeGuideLabel?: string;
  onSizeInteract?: () => void;
};

/**
 * Selector unificado de variantes PDP — sincronizado con el estado compartido.
 * Cambios instantáneos en hero, sticky cart y galería (sin refetch).
 */
export default function PdpVariantSelector({
  mode = "full",
  surface = "dark",
  sizeGuideHref,
  sizeGuideLabel = "Size guide",
  onSizeInteract,
}: Props) {
  const {
    productVariants,
    selections,
    setSelections,
    colorDef,
    sizeDef,
    otherVariantDefs,
    setSizeConfirmed,
  } = usePdpProductStateContext();

  const pdpBrand = "good-ideas" as const;
  const matrix = productVariants?.variantMatrix;

  const pick = useCallback(
    (type: string, value: string, label: string) => {
      const next = { ...selections, [type]: value || label };
      if (isValidCombination(next, matrix)) {
        setSelections(next);
      }
    },
    [selections, matrix, setSelections]
  );

  if (!productVariants?.variants?.length) return null;

  if (mode === "compact") {
    return (
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        {colorDef ? (
          <div className="flex items-center gap-1.5">
            {colorDef.options.map((option) => {
              const key = option.value || option.label;
              const active = selections[colorDef.type] === key;
              const fill = resolveSwatchHex(
                key,
                option.label,
                typeof option.swatchHex === "string" ? option.swatchHex : undefined
              );
              return (
                <button
                  key={key}
                  type="button"
                  title={option.label}
                  aria-pressed={active}
                  onClick={() => pick(colorDef.type, key, option.label)}
                  className={[
                    "h-6 w-6 rounded-full border-2 transition-transform duration-200",
                    active
                      ? "border-[#3B82F6] scale-110"
                      : "border-white/20 hover:border-white/40",
                  ].join(" ")}
                >
                  <span
                    className="block h-full w-full rounded-full"
                    style={{ backgroundColor: fill }}
                  />
                </button>
              );
            })}
          </div>
        ) : null}

        {sizeDef ? (
          <select
            value={selections[sizeDef.type] ?? ""}
            onChange={(e) => {
              const opt = sizeDef.options.find(
                (o) => (o.value || o.label) === e.target.value
              );
              if (opt) {
                setSizeConfirmed(true);
                onSizeInteract?.();
                pick(sizeDef.type, opt.value || opt.label, opt.label);
              }
            }}
            className="max-w-[7rem] truncate rounded-md border border-white/15 bg-[#151B24] px-2 py-1 font-body text-xs text-[#E8ECF1] outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/50"
            aria-label={sizeDef.label}
          >
            {sizeDef.options.map((option) => {
              const key = option.value || option.label;
              return (
                <option key={key} value={key}>
                  {option.label}
                </option>
              );
            })}
          </select>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {colorDef ? (
        <ColorSwatchSelector
          variant={colorDef}
          selections={selections}
          variantMatrix={matrix}
          surface={surface}
          pdpBrand={pdpBrand}
          onSelect={(value, label) => pick(colorDef.type, value, label)}
        />
      ) : null}

      {sizeDef ? (
        <SizeSelector
          variant={sizeDef}
          selections={selections}
          variantMatrix={matrix}
          sizeGuideHref={sizeGuideHref}
          sizeGuideLabel={sizeGuideLabel}
          surface={surface}
          appearance="rei"
          pdpBrand={pdpBrand}
          onInteract={() => {
            setSizeConfirmed(true);
            onSizeInteract?.();
          }}
          onSelect={(value, label) => pick(sizeDef.type, value, label)}
        />
      ) : null}

      {otherVariantDefs.length > 0 ? (
        <BaseVariantSelector
          variants={{
            variants: otherVariantDefs,
            variantMatrix: matrix,
          }}
          value={selections}
          onChange={setSelections}
          appearance="premium"
          surface={surface}
          pdpBrand={resolvePdpBrandTheme("good-ideas")}
        />
      ) : null}
    </div>
  );
}
