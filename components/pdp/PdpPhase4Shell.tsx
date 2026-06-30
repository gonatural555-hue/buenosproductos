"use client";

import type { ReactNode } from "react";
import { PdpProductStateProvider } from "@/context/PdpProductStateContext";
import StickyAddToCart from "@/components/pdp/StickyAddToCart";
import type { PdpProductSummary } from "@/hooks/usePdpProductState";
import type { ProductImages } from "@/lib/product-images";
import type { ProductVariants } from "@/lib/product-variants";

type Props = {
  product: PdpProductSummary;
  productImages: ProductImages;
  productVariants: ProductVariants | null;
  seoH1: string;
  selectSizeLabel: string;
  sizeGuideHref?: string;
  sizeGuideLabel?: string;
  children: ReactNode;
};

/**
 * Capa Fase 4: estado compartido + sticky cart.
 * No modifica Fases 1–3; solo envuelve el PDP.
 */
export default function PdpPhase4Shell({
  product,
  productImages,
  productVariants,
  seoH1,
  selectSizeLabel,
  sizeGuideHref,
  sizeGuideLabel,
  children,
}: Props) {
  return (
    <PdpProductStateProvider
      product={product}
      productImages={productImages}
      productVariants={productVariants}
      seoH1={seoH1}
    >
      {children}
      <StickyAddToCart
        selectSizeLabel={selectSizeLabel}
        sizeGuideHref={sizeGuideHref}
        sizeGuideLabel={sizeGuideLabel}
      />
    </PdpProductStateProvider>
  );
}
