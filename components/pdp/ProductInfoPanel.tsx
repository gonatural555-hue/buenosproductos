"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AddToCartButton, {
  type AddToCartLinePayload,
} from "@/components/AddToCartButton";
import GoodIdeasAddToCartButton from "@/components/good-ideas/GoodIdeasAddToCartButton";
import VariantSelector from "@/components/VariantSelector";
import ColorSwatchSelector from "@/components/pdp/ColorSwatchSelector";
import SizeSelector from "@/components/pdp/SizeSelector";
import PdpQuantitySelector from "@/components/pdp/PdpQuantitySelector";
import PdpAvailabilityCards, {
  type AvailabilityCopy,
} from "@/components/pdp/PdpAvailabilityCards";
import TrustBadges from "@/components/pdp/TrustBadges";
import type { PdpDesktopContent } from "@/components/ProductDetailClient";
import { isValidCombination } from "@/lib/product-variant-matrix";
import type {
  ProductVariants,
  VariantDefinition,
} from "@/lib/product-variants";
import type { UISurface } from "@/lib/ui-surface";

type Props = {
  productId: string;
  surface: UISurface;
  brandLabel?: string;
  brandHref?: string;
  seoH1: string;
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
  cartBrand?: "go-natural" | "good-ideas";
  sticky?: boolean;
  sizeConfirmed: boolean;
  onSizeInteract: () => void;
};

function MiniStars({ rating, surface }: { rating: number; surface: UISurface }) {
  const L = surface === "light";
  const rounded = Math.round(rating);
  const empty = L ? "text-neutral-300" : "text-white/25";
  return (
    <span className="flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${i < rounded ? "text-gn-mustard" : empty}`}
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.157c.969 0 1.371 1.24.588 1.81l-3.363 2.444a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.538 1.118l-3.364-2.444a1 1 0 00-1.175 0l-3.364 2.444c-.783.57-1.838-.197-1.538-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.03 9.382c-.783-.57-.38-1.81.588-1.81h4.157a1 1 0 00.95-.69l1.286-3.955z" />
        </svg>
      ))}
    </span>
  );
}

export default function ProductInfoPanel({
  productId,
  surface,
  brandLabel,
  brandHref,
  seoH1,
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
  cartBrand = "go-natural",
  sticky = true,
  sizeConfirmed,
  onSizeInteract,
}: Props) {
  const L = surface === "light";
  const matrix = productVariants?.variantMatrix;

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

  const forestCta =
    "w-full rounded-md py-3.5 px-6 text-[0.95rem] font-semibold tracking-wide transition-all duration-200 ease-out hover:-translate-y-px active:translate-y-0";

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
      />
    ) : null;

  return (
    <div
      className={[
        "flex w-full min-w-0 flex-col gap-5 max-lg:gap-4 lg:max-w-none lg:gap-6",
        sticky ? "lg:sticky lg:top-28 lg:self-start" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {brandLabel && brandHref ? (
        <Link
          href={brandHref}
          className={
            L
              ? "text-sm font-medium text-gn-forest underline-offset-2 hover:underline"
              : "text-sm font-medium text-accent-moss underline-offset-2 hover:underline"
          }
        >
          {brandLabel}
        </Link>
      ) : null}

      <header className="space-y-3">
        <h1
          className={
            L
              ? "font-sans text-[1.55rem] font-semibold leading-[1.15] tracking-tight text-neutral-900 xl:text-[1.75rem]"
              : "font-sans text-[1.55rem] font-semibold leading-[1.15] tracking-tight text-text-primary xl:text-[1.75rem]"
          }
        >
          {seoH1}
        </h1>

        {showReviews ? (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <MiniStars rating={reviewsAverage} surface={surface} />
            <span className={L ? "font-medium text-neutral-800" : "text-text-muted"}>
              {reviewsAverage.toFixed(1)}
            </span>
            <span className={L ? "text-neutral-300" : "text-white/30"} aria-hidden>
              ·
            </span>
            <Link
              href="#pdp-reviews"
              className={
                L
                  ? "text-neutral-600 underline-offset-2 hover:text-gn-forest hover:underline"
                  : "text-text-muted underline-offset-2 hover:text-accent-gold hover:underline"
              }
            >
              {reviewsLinkLabel ||
                `${reviewsCount} ${reviewsCount === 1 ? "reseña" : "reseñas"}`}
            </Link>
          </div>
        ) : null}

        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 pt-1">
          <p
            className={
              L
                ? "text-2xl font-semibold tabular-nums tracking-tight text-neutral-900"
                : "text-2xl font-semibold tabular-nums tracking-tight text-text-primary"
            }
          >
            ${resolvedPrice.toFixed(2)}
          </p>
          {freeShipping && freeShippingLabel ? (
            <span
              className={
                L
                  ? "text-[10px] font-semibold uppercase tracking-[0.14em] text-gn-forest"
                  : "text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-moss"
              }
            >
              {freeShippingLabel}
            </span>
          ) : null}
        </div>
        {taxNote ? (
          <p className={L ? "text-xs text-neutral-500" : "text-xs text-text-muted/80"}>
            {taxNote}
          </p>
        ) : null}
      </header>

      <div className="flex flex-col gap-5 max-lg:gap-4 lg:gap-5">
        {colorDef ? (
          <ColorSwatchSelector
            variant={colorDef}
            selections={selections}
            variantMatrix={matrix}
            surface={surface}
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
            onInteract={onSizeInteract}
            onSelect={(value, label) => pick(sizeDef.type, value, label)}
          />
        ) : null}

        {otherVariantsBlock}

        <PdpQuantitySelector
          value={quantity}
          onChange={onQuantityChange}
          label={quantityLabel}
          surface={surface}
        />

        <PdpAvailabilityCards copy={availabilityCopy} surface={surface} />

        <div className="space-y-4">
          <div className="max-lg:hidden">
            {cartBrand === "good-ideas" ? (
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
            ) : (
              <AddToCartButton
                id={cartPayload.id}
                title={cartPayload.title}
                price={cartPayload.price}
                image={cartPayload.image}
                variantSelections={cartPayload.variantSelections}
                label={ctaText}
                disabled={ctaDisabled}
                surface={surface}
                variant="forest"
                quantity={quantity}
                className={forestCta}
                onAfterAdd={onAfterAdd}
              />
            )}
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
