"use client";

import { useCallback } from "react";
import Link from "next/link";
import type { AddToCartLinePayload } from "@/lib/cart-line";
import Breadcrumbs, { type BreadcrumbItem } from "@/components/Breadcrumbs";
import GoodIdeasAddToCartButton from "@/components/good-ideas/GoodIdeasAddToCartButton";
import GoodIdeasPdpAccordions from "@/components/good-ideas/GoodIdeasPdpAccordions";
import VariantSelector from "@/components/VariantSelector";
import ColorSwatchSelector from "@/components/pdp/ColorSwatchSelector";
import SizeSelector from "@/components/pdp/SizeSelector";
import PdpQuantitySelector from "@/components/pdp/PdpQuantitySelector";
import PdpAvailabilityCards, {
  type AvailabilityCopy,
} from "@/components/pdp/PdpAvailabilityCards";
import TrustBadges from "@/components/pdp/TrustBadges";
import CurrencyDisclaimer from "@/components/currency/CurrencyDisclaimer";
import { giType } from "@/lib/ui/gi-typography";
import { useCurrency } from "@/context/CurrencyContext";
import type { PdpDesktopContent } from "@/components/ProductDetailClient";
import type { GoodIdeasPdpAccordionBundle } from "@/lib/good-ideas-pdp-content";
import { resolvePdpSalesBadge } from "@/lib/pdp-sales-badge";
import { isValidCombination } from "@/lib/product-variant-matrix";
import type {
  ProductVariants,
  VariantDefinition,
} from "@/lib/product-variants";
import type { UISurface } from "@/lib/ui-surface";
import {
  getPdpBuyBoxTheme,
  resolvePdpBrandTheme,
  type PdpBrandTheme,
} from "@/lib/ui/pdp-theme";
import { GI_PDP_CTA_CLASS } from "@/lib/ui/gi-pdp-layout";

type Props = {
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
  reviewsAverage?: number;
  reviewsCount?: number;
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
  reviewsLinkLabel?: string;
  pdpDesktop: PdpDesktopContent;
  cartPayload: {
    id: string;
    title: string;
    price: number;
    image?: string;
    variantSelections?: {
      type: string;
      typeLabel?: string;
      value: string;
      label?: string;
    }[];
  };
  onAfterAdd?: (item: AddToCartLinePayload) => void;
  cartBrand?: "good-ideas";
  sticky?: boolean;
  sizeConfirmed: boolean;
  onSizeInteract: () => void;
  breadcrumbItems?: BreadcrumbItem[];
  accordionBundle?: GoodIdeasPdpAccordionBundle;
};

function MiniStars({
  rating,
  surface,
  pdpBrand,
}: {
  rating: number;
  surface: UISurface;
  pdpBrand: PdpBrandTheme;
}) {
  const L = surface === "light";
  const gi = pdpBrand === "good-ideas";
  const rounded = Math.round(rating);
  const filled = gi ? "text-[#FBBF24]" : "text-gn-mustard";
  const empty = L ? "text-neutral-300" : "text-white/25";
  return (
    <span className="flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${i < rounded ? filled : empty}`}
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.157c.969 0 1.371 1.24.588 1.81l-3.363 2.444a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.538 1.118l-3.364-2.444a1 1 0 00-1.175 0l-3.364 2.444c-.783.57-1.838-.197-1.538-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.03 9.382c-.783-.57-.38-1.81.588-1.81h4.157a1 1 0 00.95-.69l1.286-3.955z" />
        </svg>
      ))}
    </span>
  );
}

export default function ProductInfoPanel({
  surface,
  brandLabel,
  brandHref,
  seoH1,
  salesBadge,
  resolvedPrice,
  freeShipping,
  freeShippingLabel,
  taxNote,
  reviewsAverage = 0,
  reviewsCount = 0,
  productVariants,
  colorDef,
  sizeDef,
  otherVariantDefs,
  selections,
  onSelectionsChange,
  quantity,
  onQuantityChange,
  quantityLabel,
  availabilityCopy,
  sizeGuideHref,
  sizeGuideLabel,
  selectSizeLabel,
  ctaLabel,
  reviewsLinkLabel,
  pdpDesktop,
  cartPayload,
  onAfterAdd,
  cartBrand = "good-ideas",
  sticky = true,
  sizeConfirmed,
  onSizeInteract,
  breadcrumbItems,
  accordionBundle,
}: Props) {
  const pdpBrand = resolvePdpBrandTheme(cartBrand);
  const theme = getPdpBuyBoxTheme(pdpBrand, surface);
  const { formatMoney } = useCurrency();
  const matrix = productVariants?.variantMatrix;
  const displaySalesBadge = resolvePdpSalesBadge(salesBadge);

  const pick = useCallback(
    (type: string, value: string, label: string) => {
      const next = { ...selections, [type]: value || label };
      if (isValidCombination(next, matrix)) {
        onSelectionsChange(next);
      }
    },
    [selections, matrix, onSelectionsChange]
  );

  const showReviews = reviewsCount > 0 && reviewsAverage > 0;
  const needsSizePick = Boolean(sizeDef) && !sizeConfirmed;
  const ctaDisabled = needsSizePick;
  const ctaText = needsSizePick ? selectSizeLabel : ctaLabel;
  const isGi = pdpBrand === "good-ideas";

  const forestCta = isGi
    ? GI_PDP_CTA_CLASS
    : "w-full rounded-md py-3.5 px-6 text-[0.95rem] font-semibold tracking-wide transition-all duration-200 ease-out hover:-translate-y-px active:translate-y-0";

  const trustBadgeCopy = {
    shippingEurope: pdpDesktop.shippingEurope,
    shippingLatam: pdpDesktop.shippingLatam,
    returns: pdpDesktop.returns,
    secureAndWarranty: pdpDesktop.secureAndWarranty,
  };

  const otherVariantsBlock =
    otherVariantDefs.length > 0 && productVariants ? (
      <VariantSelector
        variants={{
          variants: otherVariantDefs,
          variantMatrix: matrix,
        }}
        value={selections}
        onChange={onSelectionsChange}
        appearance="premium"
        surface={surface}
        pdpBrand={pdpBrand}
      />
    ) : null;

  const variantsBlock = (
    <>
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
          onInteract={onSizeInteract}
          onSelect={(value, label) => pick(sizeDef.type, value, label)}
        />
      ) : null}

      {otherVariantsBlock}
    </>
  );

  const shellClass = [
    "flex w-full min-w-0 flex-col",
    isGi ? "gap-8 max-lg:gap-6 lg:gap-10" : "gap-5 max-lg:gap-4 lg:max-w-none lg:gap-6",
    sticky ? "lg:sticky lg:top-28 lg:self-start" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (isGi) {
    return (
      <div className={shellClass}>
        {breadcrumbItems && breadcrumbItems.length > 0 ? (
          <Breadcrumbs
            variant="gi-dark"
            items={breadcrumbItems}
            className="!mb-0 lg:!mb-2"
          />
        ) : null}

        {displaySalesBadge ? (
          <span
            className={`inline-flex w-fit items-center rounded-md bg-[var(--gi-primary)] px-2.5 py-1 ${giType.badge} text-white`}
          >
            {displaySalesBadge}
          </span>
        ) : null}

        <h1 className={theme.title}>{seoH1}</h1>

        {brandLabel && brandHref ? (
          <Link href={brandHref} className={theme.brandLink}>
            {brandLabel}
          </Link>
        ) : null}

        {showReviews ? (
          <div className="flex flex-wrap items-center gap-2">
            <MiniStars
              rating={reviewsAverage}
              surface={surface}
              pdpBrand={pdpBrand}
            />
            <span className={theme.reviewsScore}>
              {reviewsAverage.toFixed(1)}
            </span>
            <span className={theme.reviewsDot} aria-hidden>
              ·
            </span>
            <Link href="#pdp-accordions" className={theme.reviewsLink}>
              {reviewsLinkLabel ||
                `${reviewsCount} ${reviewsCount === 1 ? "reseña" : "reseñas"}`}
            </Link>
          </div>
        ) : null}

        <div className="space-y-2">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className={theme.price}>{formatMoney(resolvedPrice)}</p>
            {freeShipping && freeShippingLabel ? (
              <span className={theme.freeShipping}>{freeShippingLabel}</span>
            ) : null}
          </div>
          {taxNote ? <p className={theme.taxNote}>{taxNote}</p> : null}
          <CurrencyDisclaimer className={theme.currencyDisclaimer} />
        </div>

        <div className="flex flex-col gap-7 max-lg:gap-5 lg:gap-8">
          {variantsBlock}

          <PdpQuantitySelector
            value={quantity}
            onChange={onQuantityChange}
            label={quantityLabel}
            surface={surface}
            pdpBrand={pdpBrand}
          />

          <div className="max-lg:hidden">
            <GoodIdeasAddToCartButton
              id={cartPayload.id}
              title={cartPayload.title}
              price={cartPayload.price}
              image={cartPayload.image}
              variantSelections={cartPayload.variantSelections}
              label={ctaText}
              disabled={ctaDisabled}
              className={forestCta}
              onAfterAdd={onAfterAdd}
            />
          </div>
        </div>

        {accordionBundle ? (
          <div id="pdp-accordions">
            <GoodIdeasPdpAccordions
              labels={accordionBundle.labels}
              productDetails={accordionBundle.productDetails}
              shippingSections={accordionBundle.shippingSections}
              faqs={accordionBundle.faqs}
            />
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={shellClass}>
      {brandLabel && brandHref ? (
        <Link href={brandHref} className={theme.brandLink}>
          {brandLabel}
        </Link>
      ) : null}

      <header className="space-y-3">
        <div className="space-y-2">
          <h1 className={theme.title}>{seoH1}</h1>
          {displaySalesBadge ? (
            <span
              className={`inline-flex w-fit items-center rounded-md bg-[var(--gi-primary)] px-2.5 py-1 ${giType.badge} text-white`}
            >
              {displaySalesBadge}
            </span>
          ) : null}
        </div>

        {showReviews ? (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <MiniStars
              rating={reviewsAverage}
              surface={surface}
              pdpBrand={pdpBrand}
            />
            <span className={theme.reviewsScore}>
              {reviewsAverage.toFixed(1)}
            </span>
            <span className={theme.reviewsDot} aria-hidden>
              ·
            </span>
            <Link href="#pdp-reviews" className={theme.reviewsLink}>
              {reviewsLinkLabel ||
                `${reviewsCount} ${reviewsCount === 1 ? "reseña" : "reseñas"}`}
            </Link>
          </div>
        ) : null}

        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 pt-1">
          <p className={theme.price}>{formatMoney(resolvedPrice)}</p>
          {freeShipping && freeShippingLabel ? (
            <span className={theme.freeShipping}>{freeShippingLabel}</span>
          ) : null}
        </div>
        {taxNote ? <p className={theme.taxNote}>{taxNote}</p> : null}
        <CurrencyDisclaimer className={theme.currencyDisclaimer} />
      </header>

      <div className="flex flex-col gap-5 max-lg:gap-4 lg:gap-5">
        {variantsBlock}

        <PdpQuantitySelector
          value={quantity}
          onChange={onQuantityChange}
          label={quantityLabel}
          surface={surface}
          pdpBrand={pdpBrand}
        />

        <PdpAvailabilityCards
          copy={availabilityCopy}
          surface={surface}
          pdpBrand={pdpBrand}
        />

        <div className="space-y-4">
          <div className="max-lg:hidden">
            <GoodIdeasAddToCartButton
              id={cartPayload.id}
              title={cartPayload.title}
              price={cartPayload.price}
              image={cartPayload.image}
              variantSelections={cartPayload.variantSelections}
              label={ctaText}
              disabled={ctaDisabled}
              className={forestCta}
              onAfterAdd={onAfterAdd}
            />
          </div>

          <TrustBadges
            copy={trustBadgeCopy}
            surface={surface}
            className="border-t-0 pt-0 lg:border-t lg:border-neutral-200/90 lg:pt-5"
          />
        </div>
      </div>
    </div>
  );
}
