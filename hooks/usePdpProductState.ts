"use client";

import { useEffect, useMemo, useState } from "react";
import type { AddToCartLinePayload } from "@/lib/cart-line";
import { splitVariantDefinitions } from "@/lib/pdp-variant-utils";
import { resolveColorVariantActiveImages } from "@/lib/variant-image-utils";
import type { ProductImages } from "@/lib/product-images";
import type { ProductVariants } from "@/lib/product-variants";
import { trackViewItem } from "@/lib/analytics/ga4";

export type PdpProductSummary = {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  shortDescription?: string;
  images: string[];
  freeShipping?: boolean;
};

function getDefaultSelections(variants: ProductVariants["variants"]) {
  const selections: Record<string, string> = {};

  variants.forEach((variant) => {
    const options = variant.options || [];
    if (options.length === 0) return;

    if (variant.default) {
      const match = options.find(
        (opt) => opt.value === variant.default || opt.label === variant.default
      );
      if (match) {
        selections[variant.type] = match.value || match.label;
        return;
      }
    }

    selections[variant.type] = options[0].value || options[0].label;
  });

  return selections;
}

type Params = {
  product: PdpProductSummary;
  productImages: ProductImages;
  productVariants: ProductVariants | null;
  seoH1: string;
};

export function usePdpProductState({
  product,
  productImages,
  productVariants,
  seoH1,
}: Params) {
  const baseFeatured = productImages.featured || product.images[0] || "";
  const baseGallery =
    productImages.gallery.length > 0
      ? productImages.gallery
      : product.images.slice(1);

  const initialSelections = useMemo(() => {
    if (!productVariants) return {};
    return getDefaultSelections(productVariants.variants);
  }, [productVariants]);

  const [selections, setSelections] =
    useState<Record<string, string>>(initialSelections);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSelections(initialSelections);
    setQuantity(1);
  }, [initialSelections, product.id]);

  useEffect(() => {
    trackViewItem({
      item_id: product.id,
      item_name: seoH1,
      price: product.price,
      item_category: product.category,
      quantity: 1,
    });
  }, [product.id, product.category, product.price, seoH1]);

  const activeImages = useMemo(() => {
    const defaultImages = {
      featured: baseFeatured,
      gallery: baseGallery,
    };

    return resolveColorVariantActiveImages(
      productImages,
      productVariants,
      selections,
      defaultImages
    );
  }, [baseFeatured, baseGallery, productImages, productVariants, selections]);

  const resolvedPrice = useMemo(() => {
    if (!productVariants) return product.price;
    let price = product.price;

    productVariants.variants.forEach((variant) => {
      const selectedValue = selections[variant.type];
      if (!selectedValue) return;
      const option = variant.options.find(
        (opt) => (opt.value || opt.label) === selectedValue
      );
      if (option && typeof option.priceModifier === "number") {
        price += option.priceModifier;
      }
    });

    return price;
  }, [product.price, productVariants, selections]);

  const variantSelections = useMemo(() => {
    if (!productVariants) return undefined;
    const selectionsList = productVariants.variants
      .map((variant) => {
        const selection = selections[variant.type];
        if (!selection) return null;
        const option = variant.options.find(
          (opt) => (opt.value || opt.label) === selection
        );
        const value = option?.value || selection;
        const label = option?.label || selection;
        return {
          type: variant.type,
          typeLabel: variant.label,
          value,
          label,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
    return selectionsList.length ? selectionsList : undefined;
  }, [productVariants, selections]);

  const cartImage = activeImages.featured || product.images[0];

  const pdpGalleryImages = useMemo(() => {
    const list: string[] = [];
    const push = (url: string) => {
      if (url && !list.includes(url)) list.push(url);
    };
    if (activeImages.featured) push(activeImages.featured);
    const gal = Array.isArray(activeImages.gallery) ? activeImages.gallery : [];
    gal.forEach(push);
    return list;
  }, [activeImages]);

  const { color: colorDef, size: sizeDef, other: otherVariantDefs } = useMemo(
    () => splitVariantDefinitions(productVariants?.variants ?? []),
    [productVariants]
  );

  const needsSizePick = Boolean(sizeDef);
  const [sizeConfirmed, setSizeConfirmed] = useState(!sizeDef);

  useEffect(() => {
    setSizeConfirmed(!sizeDef);
  }, [product.id, sizeDef]);

  const ctaDisabled = needsSizePick && !sizeConfirmed;

  const cartPayload = useMemo(
    () => ({
      id: product.id,
      title: product.title,
      price: resolvedPrice,
      image: cartImage,
      variantSelections,
    }),
    [product.id, product.title, resolvedPrice, cartImage, variantSelections]
  );

  return {
    product,
    productImages,
    productVariants,
    seoH1,
    selections,
    setSelections,
    quantity,
    setQuantity,
    resolvedPrice,
    activeImages,
    variantSelections,
    cartImage,
    pdpGalleryImages,
    colorDef,
    sizeDef,
    otherVariantDefs,
    needsSizePick,
    sizeConfirmed,
    setSizeConfirmed,
    ctaDisabled,
    cartPayload,
  };
}

export type PdpProductState = ReturnType<typeof usePdpProductState>;

export type PdpCartPayload = PdpProductState["cartPayload"] & {
  variantSelections?: AddToCartLinePayload["variantSelections"];
};
