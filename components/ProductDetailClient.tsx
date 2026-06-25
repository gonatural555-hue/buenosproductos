"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import AddedToCartModal, {
  type AddedToCartLineSnapshot,
} from "@/components/AddedToCartModal";
import AddToCartButton, {
  type AddToCartLinePayload,
} from "@/components/AddToCartButton";
import GoodIdeasAddToCartButton from "@/components/good-ideas/GoodIdeasAddToCartButton";
import ProductGalleryRei, {
  PDP_GALLERY_WIDTH_PX,
} from "@/components/pdp/ProductGalleryRei";
import PdpGalleryFramingPanel from "@/components/pdp/PdpGalleryFramingPanel";
import ProductInfoPanel from "@/components/pdp/ProductInfoPanel";
import type { AvailabilityCopy } from "@/components/pdp/PdpAvailabilityCards";
import { splitVariantDefinitions } from "@/lib/pdp-variant-utils";
import { resolveColorVariantActiveImages } from "@/lib/variant-image-utils";
import type { ProductImages } from "@/lib/product-images";
import {
  isPdpGalleryFramingDirectorMode,
  loadPdpGalleryFramingDraft,
  normalizePdpGalleryLayout,
  resolvePdpGalleryColumns,
  type PdpGalleryLayout,
} from "@/lib/pdp-gallery-framing";
import type { ProductVariants, VariantDefinition } from "@/lib/product-variants";
import { trackViewItem } from "@/lib/analytics/ga4";
import { useCurrency } from "@/context/CurrencyContext";
import { resolvePdpBrandTheme } from "@/lib/ui/pdp-theme";
import type { UISurface } from "@/lib/ui-surface";

type ProductSummary = {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  shortDescription?: string;
  images: string[];
  freeShipping?: boolean;
};

export type PdpDesktopContent = {
  benefitsTitle: string;
  specsToggle: string;
  idealForLabel: string;
  trustMicrocopy: string;
  shippingHeading: string;
  shippingEurope: string;
  shippingLatam: string;
  secureAndWarranty: string;
  returns: string;
  benefits: string[];
  specBullets: string[];
  idealForLine: string;
};

type Props = {
  product: ProductSummary;
  seoH1: string;
  productImages: ProductImages;
  productVariants: ProductVariants | null;
  ctaLabel: string;
  noImageLabel: string;
  freeShippingLabel?: string;
  pdpDesktop: PdpDesktopContent;
  surface?: UISurface;
  reviewsAverage?: number;
  reviewsCount?: number;
  reviewsLinkLabel?: string;
  taxNote?: string | null;
  selectSizeLabel: string;
  sizeGuideLabel: string;
  sizeGuideHref?: string;
  quantityLabel?: string;
  availabilityCopy?: AvailabilityCopy;
  brandLabel?: string;
  brandHref?: string;
  mobileStickyTrustLines: [string, string, string];
  cartBrand?: "go-natural" | "good-ideas";
  cartPath?: string;
};

function getDefaultSelections(variants: VariantDefinition[]) {
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

function buildInfoPanelProps(
  common: {
    productId: string;
    surface: UISurface;
    brandLabel?: string;
    brandHref?: string;
    seoH1: string;
    resolvedPrice: number;
    freeShipping?: boolean;
    freeShippingLabel?: string;
    taxNote?: string | null;
    reviewsAverage: number;
    reviewsCount: number;
    reviewsLinkLabel?: string;
    productVariants: ProductVariants | null;
    colorDef?: VariantDefinition;
    sizeDef?: VariantDefinition;
    otherVariantDefs: VariantDefinition[];
    selections: Record<string, string>;
    onSelectionsChange: (next: Record<string, string>) => void;
    quantity: number;
    onQuantityChange: (next: number) => void;
    quantityLabel: string;
    availabilityCopy: AvailabilityCopy;
    sizeGuideHref?: string;
    sizeGuideLabel: string;
    selectSizeLabel: string;
    ctaLabel: string;
    pdpDesktop: PdpDesktopContent;
    cartPayload: {
      id: string;
      title: string;
      price: number;
      image?: string;
      variantSelections?: AddToCartLinePayload["variantSelections"];
    };
    onAfterAdd: (item: AddToCartLinePayload) => void;
    cartBrand: "go-natural" | "good-ideas";
    sizeConfirmed: boolean;
    onSizeInteract: () => void;
  },
  sticky: boolean
) {
  return { ...common, sticky };
}

export default function ProductDetailClient({
  product,
  seoH1,
  productImages,
  productVariants,
  ctaLabel,
  noImageLabel,
  freeShippingLabel,
  pdpDesktop,
  surface = "dark",
  reviewsAverage = 0,
  reviewsCount = 0,
  reviewsLinkLabel,
  taxNote,
  selectSizeLabel,
  sizeGuideLabel,
  sizeGuideHref,
  quantityLabel = "Quantity",
  availabilityCopy = {
    pickupTitle: "Store pickup",
    pickupStatus: "Check availability",
    shippingTitle: "Shipping",
    shippingStatus: "Available",
  },
  brandLabel,
  brandHref,
  mobileStickyTrustLines,
  cartBrand = "go-natural",
  cartPath,
}: Props) {
  const L = surface === "light";
  const gi = resolvePdpBrandTheme(cartBrand) === "good-ideas";
  const { formatMoney } = useCurrency();
  const searchParams = useSearchParams();
  const isFramingDirector = isPdpGalleryFramingDirectorMode(
    searchParams,
    product.id
  );
  const [galleryLayout, setGalleryLayout] = useState<PdpGalleryLayout>(() =>
    normalizePdpGalleryLayout(productImages.pdpGalleryLayout)
  );
  const [framingImageIndex, setFramingImageIndex] = useState(0);

  useEffect(() => {
    const fromJson = normalizePdpGalleryLayout(productImages.pdpGalleryLayout);
    if (isFramingDirector) {
      const draft = loadPdpGalleryFramingDraft(product.id);
      setGalleryLayout(draft ? normalizePdpGalleryLayout(draft) : fromJson);
    } else {
      setGalleryLayout(fromJson);
    }
  }, [isFramingDirector, product.id, productImages.pdpGalleryLayout]);

  const baseFeatured =
    productImages.featured || product.images[0] || "";
  const baseGallery =
    productImages.gallery.length > 0
      ? productImages.gallery
      : product.images.slice(1);

  const initialSelections = useMemo(() => {
    if (!productVariants) return {};
    return getDefaultSelections(productVariants.variants);
  }, [productVariants]);

  const [selections, setSelections] = useState<Record<string, string>>(
    initialSelections
  );
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState<AddedToCartLineSnapshot | null>(
    null
  );

  const handleAfterAddToCart = useCallback((item: AddToCartLinePayload) => {
    setAddedToCart({
      title: item.title,
      price: item.price,
      image: item.image,
      variantSelections: item.variantSelections,
    });
  }, []);

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
  }, [
    baseFeatured,
    baseGallery,
    productImages,
    productVariants,
    selections,
  ]);

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
      .filter(
        (entry): entry is NonNullable<typeof entry> => Boolean(entry)
      );
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

  const { color: colorDef, size: sizeDef, other: otherVariantDefs } =
    useMemo(
      () => splitVariantDefinitions(productVariants?.variants ?? []),
      [productVariants]
    );

  const needsSizePick = Boolean(sizeDef);
  const [sizeConfirmed, setSizeConfirmed] = useState(!sizeDef);
  useEffect(() => {
    setSizeConfirmed(!sizeDef);
  }, [product.id, sizeDef]);

  const ctaDisabled = needsSizePick && !sizeConfirmed;
  const mobileCtaText = ctaDisabled ? selectSizeLabel : ctaLabel;

  const panelCommon = {
    productId: product.id,
    surface,
    brandLabel,
    brandHref,
    seoH1,
    resolvedPrice,
    freeShipping: product.freeShipping,
    freeShippingLabel,
    taxNote,
    reviewsAverage,
    reviewsCount,
    reviewsLinkLabel,
    productVariants,
    colorDef,
    sizeDef,
    otherVariantDefs,
    selections,
    onSelectionsChange: setSelections,
    quantity,
    onQuantityChange: setQuantity,
    quantityLabel,
    availabilityCopy,
    sizeGuideHref,
    sizeGuideLabel,
    selectSizeLabel,
    ctaLabel,
    pdpDesktop,
    cartPayload: {
      id: product.id,
      title: product.title,
      price: resolvedPrice,
      image: cartImage,
      variantSelections,
    },
    onAfterAdd: handleAfterAddToCart,
    cartBrand,
    sizeConfirmed,
    onSizeInteract: () => setSizeConfirmed(true),
  };

  const galleryColumns = resolvePdpGalleryColumns(galleryLayout, 2);

  const gallery = (
    <ProductGalleryRei
      images={pdpGalleryImages}
      title={product.title}
      noImageLabel={noImageLabel}
      surface={surface}
      galleryLayout={galleryLayout}
      columns={galleryColumns}
      galleryWidthPx={gi ? null : PDP_GALLERY_WIDTH_PX}
      debugHighlightIndex={isFramingDirector ? framingImageIndex : null}
    />
  );

  return (
    <>
      {/* Mobile: imágenes primero, panel de compra debajo */}
      <section className="mx-auto grid max-w-full gap-6 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-0 lg:hidden">
        <div className="min-w-0">{gallery}</div>
        <ProductInfoPanel {...buildInfoPanelProps(panelCommon, false)} />
      </section>

      {/*
        Desktop REI: 68/32 — panel sticky dentro de la fila del grid.
        El sticky termina al final de esta sección (antes de Features).
      */}
      <section className="hidden lg:grid lg:grid-cols-[minmax(0,1.68fr)_minmax(280px,0.32fr)] lg:items-start lg:gap-x-10 xl:gap-x-12">
        <div className="min-w-0">{gallery}</div>
        <div className="min-w-0">
          <ProductInfoPanel {...buildInfoPanelProps(panelCommon, true)} />
        </div>
      </section>

      {isFramingDirector ? (
        <PdpGalleryFramingPanel
          productId={product.id}
          imageCount={pdpGalleryImages.length}
          layout={galleryLayout}
          onChange={setGalleryLayout}
          selectedIndex={framingImageIndex}
          onSelectIndex={setFramingImageIndex}
        />
      ) : null}

      {/* Sticky CTA móvil */}
      <div
        className={
          gi
            ? "fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.08] bg-[#0B0F14]/98 px-4 pt-3 shadow-[0_-4px_20px_rgba(0,0,0,0.45)] backdrop-blur-md pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
            : L
              ? "fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 bg-white/95 px-4 pt-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur-md pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
              : "fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-dark-base/98 px-4 pt-3 shadow-[0_-4px_20px_rgba(0,0,0,0.4)] backdrop-blur-md pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
        }
      >
        <div className="mx-auto max-w-full">
          <div className="mb-2 text-center">
            <p
              className={
                gi
                  ? "text-2xl font-bold tabular-nums text-[#E8ECF1]"
                  : L
                    ? "text-2xl font-bold text-neutral-900"
                    : "text-2xl font-bold text-text-primary"
              }
            >
              {formatMoney(resolvedPrice)}
            </p>
          </div>

          {cartBrand === "good-ideas" ? (
            <GoodIdeasAddToCartButton
              id={product.id}
              title={product.title}
              price={resolvedPrice}
              image={cartImage}
              variantSelections={variantSelections}
              label={mobileCtaText}
              disabled={ctaDisabled}
              className="mt-0 w-full rounded-md py-3.5 text-base"
              onAfterAdd={handleAfterAddToCart}
            />
          ) : (
            <AddToCartButton
              id={product.id}
              title={product.title}
              price={resolvedPrice}
              image={cartImage}
              variantSelections={variantSelections}
              label={mobileCtaText}
              disabled={ctaDisabled}
              variant="forest"
              quantity={quantity}
              className="mt-0 w-full rounded-md py-3.5 text-base"
              surface={surface}
              onAfterAdd={handleAfterAddToCart}
            />
          )}

          <div
            className={
              gi
                ? "mt-2.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[10px] leading-tight text-[rgba(232,236,241,0.5)]"
                : L
                  ? "mt-2.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[10px] leading-tight text-neutral-500"
                  : "mt-2.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[10px] leading-tight text-text-muted/70"
            }
          >
            <span>{mobileStickyTrustLines[0]}</span>
            <span
              aria-hidden
              className={gi ? "text-white/20" : L ? "text-neutral-300" : "text-white/25"}
            >
              ·
            </span>
            <span>{mobileStickyTrustLines[1]}</span>
            <span
              aria-hidden
              className={gi ? "text-white/20" : L ? "text-neutral-300" : "text-white/25"}
            >
              ·
            </span>
            <span>{mobileStickyTrustLines[2]}</span>
          </div>
        </div>
      </div>

      <AddedToCartModal
        open={addedToCart !== null}
        item={addedToCart}
        onClose={() => setAddedToCart(null)}
        cartPath={cartPath}
      />
    </>
  );
}
