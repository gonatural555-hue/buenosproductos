"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AddToCartButton, {
  type AddToCartLinePayload,
} from "@/components/AddToCartButton";
import VariantSelector from "@/components/VariantSelector";
import ColorSwatchSelector from "@/components/pdp/ColorSwatchSelector";
import SizeSelector from "@/components/pdp/SizeSelector";
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
  seoH1: string;
  description: string;
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
  sizeGuideHref?: string;
  sizeGuideLabel: string;
  selectSizeLabel: string;
  ctaLabel: string;
  trustMicrocopy: string;
  /** Texto del enlace a reseñas (incluye número), ya traducido. */
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
          className={`h-3.5 w-3.5 ${i < rounded ? "text-accent-gold" : empty}`}
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
  seoH1,
  description,
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
  sizeGuideHref,
  sizeGuideLabel,
  selectSizeLabel,
  ctaLabel,
  trustMicrocopy,
  reviewsLinkLabel,
  pdpDesktop,
  cartPayload,
  onAfterAdd,
}: Props) {
  const L = surface === "light";
  const matrix = productVariants?.variantMatrix;
  const [sizeConfirmed, setSizeConfirmed] = useState(() => !sizeDef);

  useEffect(() => {
    setSizeConfirmed(!sizeDef);
  }, [productId, sizeDef]);

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

  const pillCta =
    "w-full rounded-full py-3.5 px-6 text-[0.95rem] font-semibold tracking-wide shadow-lg transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0";

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
    <div className="flex w-full min-w-0 max-w-xl flex-col gap-8 lg:max-w-[23rem] lg:gap-7 lg:sticky lg:top-28 xl:max-w-[24rem] xl:gap-8 2xl:max-w-[25rem]">
      <header className="space-y-5 lg:space-y-4">
        <h1
          className={
            L
              ? "font-sans text-[1.7rem] font-semibold leading-[1.12] tracking-tight text-neutral-900 xl:text-[2rem]"
              : "font-sans text-[1.7rem] font-semibold leading-[1.12] tracking-tight text-text-primary xl:text-[2rem]"
          }
        >
          {seoH1}
        </h1>

        <div
          className={
            L ? "space-y-2 border-t border-neutral-200/90 pt-5" : "space-y-2 border-t border-white/[0.08] pt-5"
          }
        >
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p
              className={
                L
                  ? "text-[1.65rem] font-medium tabular-nums tracking-tight text-neutral-900"
                  : "text-[1.65rem] font-medium tabular-nums tracking-tight text-text-primary"
              }
            >
              ${resolvedPrice.toFixed(2)}
            </p>
            {freeShipping && freeShippingLabel ? (
              <span
                className={
                  L
                    ? "text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-500"
                    : "text-[10px] font-medium uppercase tracking-[0.16em] text-text-muted/85"
                }
              >
                {freeShippingLabel}
              </span>
            ) : null}
          </div>
          {taxNote ? (
            <p
              className={
                L ? "text-xs text-neutral-500" : "text-xs text-text-muted/80"
              }
            >
              {taxNote}
            </p>
          ) : null}
          <p
            className={
              L
                ? "text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-600"
                : "text-[11px] font-medium uppercase tracking-[0.18em] text-text-muted/90"
            }
          >
            {trustMicrocopy}
          </p>
        </div>

        {showReviews ? (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <MiniStars rating={reviewsAverage} surface={surface} />
            <span className={L ? "text-neutral-700" : "text-text-muted"}>
              {reviewsAverage.toFixed(1)}
            </span>
            <span className={L ? "text-neutral-400" : "text-white/30"} aria-hidden>
              ·
            </span>
            <Link
              href="#pdp-reviews"
              className={
                L
                  ? "text-neutral-600 underline-offset-2 hover:text-accent-gold hover:underline"
                  : "text-text-muted underline-offset-2 hover:text-accent-gold hover:underline"
              }
            >
              {reviewsLinkLabel ||
                `${reviewsCount} ${reviewsCount === 1 ? "reseña" : "reseñas"}`}
            </Link>
          </div>
        ) : null}
      </header>

      <div className="flex flex-col gap-7 lg:gap-6">
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
            onInteract={() => setSizeConfirmed(true)}
            onSelect={(value, label) => pick(sizeDef.type, value, label)}
          />
        ) : null}

        {otherVariantsBlock}

        <div className="space-y-4">
          <AddToCartButton
            id={cartPayload.id}
            title={cartPayload.title}
            price={cartPayload.price}
            image={cartPayload.image}
            variantSelections={cartPayload.variantSelections}
            label={ctaText}
            disabled={ctaDisabled}
            surface={surface}
            className={pillCta}
            onAfterAdd={onAfterAdd}
          />
          <TrustBadges copy={trustBadgeCopy} surface={surface} />
        </div>
      </div>

      <div
        className={
          L
            ? "border-t border-neutral-200/90 pt-7"
            : "border-t border-white/[0.08] pt-7"
        }
      >
        <p
          className={
            L
              ? "line-clamp-3 text-sm leading-relaxed text-neutral-600 lg:leading-[1.55]"
              : "line-clamp-3 text-sm leading-relaxed text-text-muted lg:leading-[1.55]"
          }
        >
          {description}
        </p>
      </div>
    </div>
  );
}
