"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { AddToCartLinePayload } from "@/lib/cart-line";
import GoodIdeasAddToCartButton from "@/components/good-ideas/GoodIdeasAddToCartButton";
import ProductGalleryDtc from "@/components/pdp/ProductGalleryDtc";
import ProductGalleryRei, {
  PDP_GALLERY_WIDTH_PX,
} from "@/components/pdp/ProductGalleryRei";
import PdpGalleryFramingPanel from "@/components/pdp/PdpGalleryFramingPanel";
import ProductInfoPanel from "@/components/pdp/ProductInfoPanel";
import type { AvailabilityCopy } from "@/components/pdp/PdpAvailabilityCards";
import { usePdpProductStateContext } from "@/context/PdpProductStateContext";
import type { ProductImages } from "@/lib/product-images";
import {
  isPdpGalleryFramingDirectorMode,
  loadPdpGalleryFramingDraft,
  normalizePdpGalleryLayout,
  resolvePdpGalleryColumns,
  type PdpGalleryLayout,
} from "@/lib/pdp-gallery-framing";
import type { ProductVariants, VariantDefinition } from "@/lib/product-variants";
import { useCurrency } from "@/context/CurrencyContext";
import { resolvePdpBrandTheme } from "@/lib/ui/pdp-theme";
import { GI_DTC } from "@/lib/ui/gi-pdp-dtc";
import {
  GI_PDP_CTA_CLASS,
  GI_PDP_GALLERY_STICKY,
  GI_PDP_GRID,
} from "@/lib/ui/gi-pdp-layout";
import type { UISurface } from "@/lib/ui-surface";
import type { BreadcrumbItem } from "@/components/Breadcrumbs";
import type { GoodIdeasPdpAccordionBundle } from "@/lib/good-ideas-pdp-content";

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
  salesBadge?: string;
  mobileStickyTrustLines: [string, string, string];
  cartBrand?: "good-ideas";
  breadcrumbItems?: BreadcrumbItem[];
  accordionBundle?: GoodIdeasPdpAccordionBundle;
  /** Fase 4: el sticky inteligente reemplaza la barra móvil legacy. */
  suppressMobileSticky?: boolean;
};

function buildInfoPanelProps(
  common: {
    productId: string;
    surface: UISurface;
    brandLabel?: string;
    brandHref?: string;
    seoH1: string;
    salesBadge?: string;
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
    cartBrand: "good-ideas";
    sizeConfirmed: boolean;
    onSizeInteract: () => void;
    breadcrumbItems?: BreadcrumbItem[];
    accordionBundle?: GoodIdeasPdpAccordionBundle;
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
  surface = "light",
  reviewsAverage = 0,
  reviewsCount = 0,
  reviewsLinkLabel,
  taxNote,
  selectSizeLabel,
  sizeGuideLabel,
  sizeGuideHref,
  quantityLabel = "Quantity",
  availabilityCopy = {
    shippingTitle: "Shipping",
    shippingStatus: "Available",
  },
  brandLabel,
  brandHref,
  salesBadge,
  mobileStickyTrustLines,
  cartBrand = "good-ideas",
  breadcrumbItems,
  accordionBundle,
  suppressMobileSticky = false,
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

  const {
    selections,
    setSelections,
    quantity,
    setQuantity,
    resolvedPrice,
    variantSelections,
    cartImage,
    pdpGalleryImages,
    colorDef,
    sizeDef,
    otherVariantDefs,
    sizeConfirmed,
    setSizeConfirmed,
    ctaDisabled,
  } = usePdpProductStateContext();

  const mobileCtaText = ctaDisabled ? selectSizeLabel : ctaLabel;

  useEffect(() => {
    const fromJson = normalizePdpGalleryLayout(productImages.pdpGalleryLayout);
    if (isFramingDirector) {
      const draft = loadPdpGalleryFramingDraft(product.id);
      setGalleryLayout(draft ? normalizePdpGalleryLayout(draft) : fromJson);
    } else {
      setGalleryLayout(fromJson);
    }
  }, [isFramingDirector, product.id, productImages.pdpGalleryLayout]);

  const panelCommon = {
    productId: product.id,
    surface,
    brandLabel,
    brandHref,
    salesBadge,
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
    cartBrand,
    sizeConfirmed,
    onSizeInteract: () => setSizeConfirmed(true),
    breadcrumbItems,
    accordionBundle,
  };

  const galleryColumns = resolvePdpGalleryColumns(galleryLayout, 2);

  const giDtc = gi && surface === "light";

  const gallery = giDtc ? (
    <ProductGalleryDtc
      images={pdpGalleryImages}
      title={product.title}
      noImageLabel={noImageLabel}
    />
  ) : (
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

  const desktopGridClass = giDtc
    ? GI_DTC.heroGrid
    : gi
      ? GI_PDP_GRID
      : "hidden lg:grid lg:grid-cols-[minmax(0,1.68fr)_minmax(280px,0.32fr)] lg:items-start lg:gap-x-10 xl:gap-x-12";

  const galleryWrapClass = giDtc ? "min-w-0" : gi ? GI_PDP_GALLERY_STICKY : "min-w-0";

  const panelSticky = giDtc ? true : !gi;

  return (
    <div id="pdp-hero">
      {/* Mobile: galería → información (sin sticky) */}
      <section className={`mx-auto grid max-w-full gap-8 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-0 sm:gap-10 lg:hidden ${giDtc ? "px-0" : ""}`}>
        <div className="min-w-0">{gallery}</div>
        <ProductInfoPanel {...buildInfoPanelProps(panelCommon, false)} />
      </section>

      {/*
        Desktop: galería sticky izquierda (GI) o panel sticky derecha (framing / legacy).
        El sticky termina al final de esta sección (antes de Features).
      */}
      <section className={desktopGridClass}>
        <div className={galleryWrapClass}>{gallery}</div>
        <div className="min-w-0">
          <ProductInfoPanel {...buildInfoPanelProps(panelCommon, panelSticky)} />
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

      {/* Sticky CTA móvil legacy (desactivado con Fase 4) */}
      {!suppressMobileSticky ? (
      <div
        className={
          giDtc
            ? "fixed bottom-0 left-0 right-0 z-50 border-t border-[#E5E7EB] bg-white/98 px-4 pt-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-md pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
            : gi
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
                giDtc
                  ? "text-xl font-bold tabular-nums text-[#111111]"
                  : gi
                  ? "text-2xl font-bold tabular-nums text-[#E8ECF1]"
                  : L
                    ? "text-2xl font-bold text-neutral-900"
                    : "text-2xl font-bold text-text-primary"
              }
            >
              {formatMoney(resolvedPrice)}
            </p>
          </div>

          <GoodIdeasAddToCartButton
            id={product.id}
            title={product.title}
            price={resolvedPrice}
            image={cartImage}
            variantSelections={variantSelections}
            label={mobileCtaText}
            disabled={ctaDisabled}
            variant={giDtc ? "dtc" : "default"}
            className={
              giDtc
                ? `${GI_DTC.cta} mt-0`
                : gi
                  ? `${GI_PDP_CTA_CLASS} mt-0`
                  : "mt-0 w-full rounded-md py-3.5 text-base"
            }
          />

          <div
            className={
              giDtc
                ? "mt-2.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[10px] leading-tight text-[#6B7280]"
                : gi
                ? "mt-2.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[10px] leading-tight text-[rgba(232,236,241,0.5)]"
                : L
                  ? "mt-2.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[10px] leading-tight text-neutral-500"
                  : "mt-2.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[10px] leading-tight text-text-muted/70"
            }
          >
            <span>{mobileStickyTrustLines[0]}</span>
            <span
              aria-hidden
              className={giDtc ? "text-[#D1D5DB]" : gi ? "text-white/20" : L ? "text-neutral-300" : "text-white/25"}
            >
              ·
            </span>
            <span>{mobileStickyTrustLines[1]}</span>
            <span
              aria-hidden
              className={giDtc ? "text-[#D1D5DB]" : gi ? "text-white/20" : L ? "text-neutral-300" : "text-white/25"}
            >
              ·
            </span>
            <span>{mobileStickyTrustLines[2]}</span>
          </div>
        </div>
      </div>
      ) : null}
    </div>
  );
}
