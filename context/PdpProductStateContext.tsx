"use client";

import { createContext, useContext, type ReactNode } from "react";
import {
  usePdpProductState,
  type PdpProductState,
  type PdpProductSummary,
} from "@/hooks/usePdpProductState";
import type { ProductImages } from "@/lib/product-images";
import type { ProductVariants } from "@/lib/product-variants";

const PdpProductStateContext = createContext<PdpProductState | null>(null);

type ProviderProps = {
  product: PdpProductSummary;
  productImages: ProductImages;
  productVariants: ProductVariants | null;
  seoH1: string;
  children: ReactNode;
};

export function PdpProductStateProvider({
  product,
  productImages,
  productVariants,
  seoH1,
  children,
}: ProviderProps) {
  const state = usePdpProductState({
    product,
    productImages,
    productVariants,
    seoH1,
  });

  return (
    <PdpProductStateContext.Provider value={state}>
      {children}
    </PdpProductStateContext.Provider>
  );
}

export function usePdpProductStateContext(): PdpProductState {
  const ctx = useContext(PdpProductStateContext);
  if (!ctx) {
    throw new Error(
      "usePdpProductStateContext must be used within PdpProductStateProvider"
    );
  }
  return ctx;
}

export function useOptionalPdpProductState(): PdpProductState | null {
  return useContext(PdpProductStateContext);
}
