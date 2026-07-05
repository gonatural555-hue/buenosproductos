/** Productos con selector de kit estilo cards DTC en el buy box. */
export const GI_KIT_OPTION_CARD_PRODUCT_IDS = new Set(["gi-hogar-010"]);

export type GiKitOptionMeta = {
  titleKey: string;
  includesKey: string;
  packLabel: string;
  recommended?: boolean;
  basic?: boolean;
};

export const GI_HOGAR_010_KIT_META: Record<string, GiKitOptionMeta> = {
  "steamer-cup-mat": {
    titleKey: "goodIdeas.pdp.kitOptions.giHogar010.steamerCupMat.title",
    includesKey: "goodIdeas.pdp.kitOptions.giHogar010.steamerCupMat.includes",
    packLabel: "x1",
    basic: true,
  },
  "steamer-cup-mat-board": {
    titleKey: "goodIdeas.pdp.kitOptions.giHogar010.steamerCupMatBoard.title",
    includesKey:
      "goodIdeas.pdp.kitOptions.giHogar010.steamerCupMatBoard.includes",
    packLabel: "x2",
    recommended: true,
  },
  "steamer-cup-mat-board-bag": {
    titleKey:
      "goodIdeas.pdp.kitOptions.giHogar010.steamerCupMatBoardBag.title",
    includesKey:
      "goodIdeas.pdp.kitOptions.giHogar010.steamerCupMatBoardBag.includes",
    packLabel: "x3",
  },
};

export function shouldUseGiKitOptionCards(
  productId: string,
  kitVariant?: { type: string }
): boolean {
  return (
    GI_KIT_OPTION_CARD_PRODUCT_IDS.has(productId) && kitVariant?.type === "kit"
  );
}

export function getGiKitOptionMeta(
  productId: string,
  value: string
): GiKitOptionMeta | null {
  if (productId === "gi-hogar-010") {
    return GI_HOGAR_010_KIT_META[value] ?? null;
  }
  return null;
}

export function resolveKitOptionPrices(
  basePrice: number,
  baseCompareAt: number | undefined,
  priceModifier = 0,
  compareAtPriceModifier = 0
) {
  const salePrice = basePrice + priceModifier;
  const compareAtPrice =
    baseCompareAt != null
      ? baseCompareAt + compareAtPriceModifier
      : undefined;
  const savePercent =
    compareAtPrice != null && compareAtPrice > salePrice
      ? Math.round(((compareAtPrice - salePrice) / compareAtPrice) * 100)
      : 0;

  return { salePrice, compareAtPrice, savePercent };
}
