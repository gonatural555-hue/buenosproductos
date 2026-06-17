import type { VariantDefinition } from "@/lib/product-variants";
import { resolveSwatchHex } from "@/lib/color-swatch";

export function isColorVariantType(type: string): boolean {
  const t = type.toLowerCase();
  return t === "color" || t === "colour" || t.includes("color");
}

export function isSizeVariantType(type: string): boolean {
  const t = type.toLowerCase();
  return (
    t === "size" ||
    t === "talla" ||
    t === "talle" ||
    t.includes("size") ||
    t.includes("talla")
  );
}

/** @deprecated Usar resolveSwatchHex de lib/color-swatch.ts */
export function swatchFillForOption(
  value: string,
  label: string,
  explicitHex?: string | null
): string {
  return resolveSwatchHex(value, label, explicitHex);
}

export function splitVariantDefinitions(variants: VariantDefinition[]): {
  color?: VariantDefinition;
  size?: VariantDefinition;
  other: VariantDefinition[];
} {
  let color: VariantDefinition | undefined;
  let size: VariantDefinition | undefined;
  const other: VariantDefinition[] = [];

  for (const v of variants) {
    if (!color && isColorVariantType(v.type)) {
      color = v;
    } else if (!size && isSizeVariantType(v.type)) {
      size = v;
    } else {
      other.push(v);
    }
  }

  return { color, size, other };
}
