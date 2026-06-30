import type { AddToCartLinePayload } from "@/lib/cart-line";

type VariantSelection = NonNullable<AddToCartLinePayload["variantSelections"]>[number];

/** Clave única por producto + variantes (ej. color). */
export function buildCartLineId(
  productId: string,
  variantSelections?: VariantSelection[]
): string {
  if (!variantSelections?.length) return productId;
  const suffix = [...variantSelections]
    .sort((a, b) => a.type.localeCompare(b.type))
    .map((v) => `${v.type}:${v.value}`)
    .join("|");
  return `${productId}__${suffix}`;
}

export function getColorVariantLabel(
  variantSelections?: VariantSelection[]
): string | null {
  const color = variantSelections?.find((v) => v.type === "color");
  if (!color) return null;
  return color.label?.trim() || color.value;
}
