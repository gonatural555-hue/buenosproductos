/** Productos con selector de kit estilo cards DTC en el buy box. */
export const GI_KIT_OPTION_CARD_PRODUCT_IDS = new Set([
  "gi-hogar-010",
  "gi-hogar-011",
]);

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

export const GI_HOGAR_011_KIT_META: Record<string, GiKitOptionMeta> = {
  "blender-tamper": {
    titleKey: "goodIdeas.pdp.kitOptions.giHogar011.blenderTamper.title",
    includesKey: "goodIdeas.pdp.kitOptions.giHogar011.blenderTamper.includes",
    packLabel: "x1",
    basic: true,
  },
  "blender-processor-tamper": {
    titleKey:
      "goodIdeas.pdp.kitOptions.giHogar011.blenderProcessorTamper.title",
    includesKey:
      "goodIdeas.pdp.kitOptions.giHogar011.blenderProcessorTamper.includes",
    packLabel: "x2",
    recommended: true,
  },
  "blender-spare-tamper": {
    titleKey: "goodIdeas.pdp.kitOptions.giHogar011.blenderSpareTamper.title",
    includesKey:
      "goodIdeas.pdp.kitOptions.giHogar011.blenderSpareTamper.includes",
    packLabel: "x3",
  },
  "blender-spare-processor-tamper": {
    titleKey:
      "goodIdeas.pdp.kitOptions.giHogar011.blenderSpareProcessorTamper.title",
    includesKey:
      "goodIdeas.pdp.kitOptions.giHogar011.blenderSpareProcessorTamper.includes",
    packLabel: "x4",
  },
  "blender-jar-tamper": {
    titleKey: "goodIdeas.pdp.kitOptions.giHogar011.blenderJarTamper.title",
    includesKey:
      "goodIdeas.pdp.kitOptions.giHogar011.blenderJarTamper.includes",
    packLabel: "x5",
  },
  "blender-spare-jar-tamper": {
    titleKey:
      "goodIdeas.pdp.kitOptions.giHogar011.blenderSpareJarTamper.title",
    includesKey:
      "goodIdeas.pdp.kitOptions.giHogar011.blenderSpareJarTamper.includes",
    packLabel: "x6",
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
  if (productId === "gi-hogar-011") {
    return GI_HOGAR_011_KIT_META[value] ?? null;
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
