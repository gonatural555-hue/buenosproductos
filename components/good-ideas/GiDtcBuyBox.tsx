"use client";

import { useCallback } from "react";
import Link from "next/link";
import type { AddToCartLinePayload } from "@/lib/cart-line";
import GoodIdeasAddToCartButton from "@/components/good-ideas/GoodIdeasAddToCartButton";
import ColorSwatchSelector from "@/components/pdp/ColorSwatchSelector";
import SizeSelector from "@/components/pdp/SizeSelector";
import PdpQuantitySelector from "@/components/pdp/PdpQuantitySelector";
import VariantSelector from "@/components/VariantSelector";
import CurrencyDisclaimer from "@/components/currency/CurrencyDisclaimer";
import { useTranslations } from "@/components/i18n/LocaleProvider";
import { useCurrency } from "@/context/CurrencyContext";
import type { PdpDesktopContent } from "@/components/ProductDetailClient";
import { resolvePdpSalesBadge } from "@/lib/pdp-sales-badge";
import { isValidCombination } from "@/lib/product-variant-matrix";
import type {
  ProductVariants,
  VariantDefinition,
} from "@/lib/product-variants";
import { getPdpBuyBoxTheme } from "@/lib/ui/pdp-theme";
import { GI_DTC } from "@/lib/ui/gi-pdp-dtc";

function MiniStars({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <span className="flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${i < rounded ? "text-[#FBBF24]" : "text-[#E5E7EB]"}`}
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.157c.969 0 1.371 1.24.588 1.81l-3.363 2.444a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.538 1.118l-3.364-2.444a1 1 0 00-1.175 0l-3.364 2.444c-.783.57-1.838-.197-1.538-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.03 9.382c-.783-.57-.38-1.81.588-1.81h4.157a1 1 0 00.95-.69l1.286-3.955z" />
        </svg>
      ))}
    </span>
  );
}

type Props = {
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
  onAfterAdd?: (item: AddToCartLinePayload) => void;
  sticky?: boolean;
  sizeConfirmed: boolean;
  onSizeInteract: () => void;
};

export default function GiDtcBuyBox({
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
  reviewsLinkLabel,
  productVariants,
  colorDef,
  sizeDef,
  otherVariantDefs,
  selections,
  onSelectionsChange,
  quantity,
  onQuantityChange,
  quantityLabel,
  sizeGuideHref,
  sizeGuideLabel,
  selectSizeLabel,
  ctaLabel,
  pdpDesktop,
  cartPayload,
  onAfterAdd,
  sticky = true,
  sizeConfirmed,
  onSizeInteract,
}: Props) {
  const t = useTranslations();
  const { formatMoney } = useCurrency();
  const theme = getPdpBuyBoxTheme("good-ideas", "light");
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

  const quickBenefits =
    pdpDesktop.benefits.length >= 3
      ? pdpDesktop.benefits.slice(0, 3)
      : [
          t("goodIdeas.pdp.dtc.benefitCompact"),
          t("goodIdeas.pdp.dtc.benefitEasy"),
          t("goodIdeas.pdp.dtc.benefitShipping"),
        ];

  const socialProof = showReviews
    ? t("goodIdeas.pdp.dtc.socialProofWithCount", "").replace(
        "{count}",
        String(Math.max(reviewsCount, 100))
      )
    : t("goodIdeas.pdp.dtc.socialProof");

  const shellClass = [
    "flex w-full min-w-0 flex-col gap-6 max-lg:gap-5 lg:gap-7",
    sticky ? GI_DTC.buyBoxSticky : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={shellClass}>
      <span className={GI_DTC.badge}>
        {displaySalesBadge ?? t("goodIdeas.pdp.dtc.viralBadge")}
      </span>

      <h1 className={theme.title}>{seoH1}</h1>

      {brandLabel && brandHref ? (
        <Link href={brandHref} className={theme.brandLink}>
          {brandLabel}
        </Link>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        {showReviews ? (
          <MiniStars rating={reviewsAverage} />
        ) : (
          <MiniStars rating={5} />
        )}
        <p className="font-body text-sm text-[#6B7280]">{socialProof}</p>
      </div>

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

      <ul className="space-y-2.5">
        {quickBenefits.map((benefit) => (
          <li
            key={benefit}
            className="flex items-start gap-2.5 font-body text-sm leading-snug text-[#374151]"
          >
            <span className="mt-0.5 text-[#16A34A]" aria-hidden>
              ✓
            </span>
            <span>{benefit}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-5">
        {colorDef ? (
          <ColorSwatchSelector
            variant={colorDef}
            selections={selections}
            variantMatrix={matrix}
            surface="light"
            pdpBrand="good-ideas"
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
            surface="light"
            appearance="rei"
            pdpBrand="good-ideas"
            onInteract={onSizeInteract}
            onSelect={(value, label) => pick(sizeDef.type, value, label)}
          />
        ) : null}

        {otherVariantDefs.length > 0 && productVariants ? (
          <VariantSelector
            variants={{
              variants: otherVariantDefs,
              variantMatrix: matrix,
            }}
            value={selections}
            onChange={onSelectionsChange}
            appearance="premium"
            surface="light"
            pdpBrand="good-ideas"
          />
        ) : null}

        <PdpQuantitySelector
          value={quantity}
          onChange={onQuantityChange}
          label={quantityLabel}
          surface="light"
          pdpBrand="good-ideas"
        />

        <GoodIdeasAddToCartButton
          id={cartPayload.id}
          title={cartPayload.title}
          price={cartPayload.price}
          image={cartPayload.image}
          variantSelections={cartPayload.variantSelections}
          label={ctaText}
          disabled={ctaDisabled}
          variant="dtc"
          onAfterAdd={onAfterAdd}
        />

        <p className="font-body text-sm font-medium text-[#16A34A]">
          {t("goodIdeas.pdp.dtc.inStock")}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-y border-[#E5E7EB] py-4 text-center font-body text-xs text-[#6B7280]">
        <span>{t("goodIdeas.pdp.dtc.trustSecure")}</span>
        <span aria-hidden className="text-[#D1D5DB]">
          ·
        </span>
        <span>{t("goodIdeas.pdp.dtc.trustGuarantee")}</span>
        <span aria-hidden className="text-[#D1D5DB]">
          ·
        </span>
        <span>{t("goodIdeas.pdp.dtc.trustShipping")}</span>
      </div>

      <div className="rounded-sm border border-[#E5E7EB] bg-[#FAFAFA] px-4 py-4">
        <p className="font-body text-xs font-semibold uppercase tracking-[0.12em] text-[#111111]">
          {t("goodIdeas.pdp.dtc.updateLabel")}
        </p>
        <p className="mt-2 font-body text-sm leading-relaxed text-[#6B7280]">
          {t("goodIdeas.pdp.dtc.updateBody")}
        </p>
      </div>

      {showReviews && reviewsLinkLabel ? (
        <Link
          href="#pdp-reviews"
          className="font-body text-sm text-[#6B7280] underline-offset-2 hover:text-[#111111] hover:underline"
        >
          {reviewsLinkLabel}
        </Link>
      ) : null}
    </div>
  );
}
