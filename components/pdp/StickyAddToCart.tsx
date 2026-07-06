"use client";

import { lazy, Suspense } from "react";
import { usePathname } from "next/navigation";
import GoodIdeasAddToCartButton from "@/components/good-ideas/GoodIdeasAddToCartButton";
import PdpVariantSelector from "@/components/pdp/VariantSelector";
import { useTranslations } from "@/components/i18n/LocaleProvider";
import { usePdpProductStateContext } from "@/context/PdpProductStateContext";
import { usePdpHeroVisibility } from "@/hooks/usePdpHeroVisibility";
import { useCurrency } from "@/context/CurrencyContext";
import { isProductPdpPath } from "@/lib/routing/paths";
import PdpPromoPriceBlock from "@/components/pdp/PdpPromoPriceBlock";
import { hasActivePromoPrice } from "@/lib/flash-sale-countdown";
import { GI_DTC } from "@/lib/ui/gi-pdp-dtc";

function StickyAddToCartInner({
  selectSizeLabel,
  sizeGuideHref,
  sizeGuideLabel,
}: {
  selectSizeLabel: string;
  sizeGuideHref?: string;
  sizeGuideLabel?: string;
}) {
  const t = useTranslations();
  const pathname = usePathname() ?? "";
  const dtc = isProductPdpPath(pathname);
  const { formatMoney } = useCurrency();
  const { pastHero } = usePdpHeroVisibility();

  const {
    product,
    resolvedPrice,
    resolvedCompareAtPrice,
    cartPayload,
    ctaDisabled,
    setSizeConfirmed,
    productVariants,
  } = usePdpProductStateContext();

  const hasVariants = Boolean(productVariants?.variants?.length);
  const addLabel = ctaDisabled ? selectSizeLabel : t("common.addToCart");
  const promoActive = hasActivePromoPrice(resolvedPrice, resolvedCompareAtPrice);

  return (
    <div
      role="region"
      aria-label={t("goodIdeas.pdp.phase4.stickyCartLabel")}
      aria-hidden={!pastHero}
      className={[
        "fixed inset-x-0 bottom-0 z-[60] transition-all duration-300 ease-out lg:hidden",
        dtc
          ? "border-t border-[#E5E7EB] bg-white/98 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
          : "border-t border-white/[0.08] bg-[rgba(11,15,20,0.88)] backdrop-blur-xl",
        "pb-[max(0.5rem,env(safe-area-inset-bottom))]",
        pastHero
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-full opacity-0 pointer-events-none",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-[1320px] items-center gap-3 px-4 py-2">
        <div className="min-w-0 flex-1">
          {promoActive ? (
            <PdpPromoPriceBlock
              productId={product.id}
              salePriceUsd={resolvedPrice}
              compareAtPriceUsd={resolvedCompareAtPrice}
              flashSaleHours={product.flashSaleHours}
              variant="sticky"
            />
          ) : (
            <p
              className={`font-body text-lg font-bold tabular-nums ${
                dtc ? "text-[#111111]" : "text-[#E8ECF1]"
              }`}
            >
              {formatMoney(resolvedPrice)}
            </p>
          )}
        </div>

        {hasVariants && !dtc ? (
          <div className="hidden shrink-0 md:block">
            <PdpVariantSelector
              mode="compact"
              sizeGuideHref={sizeGuideHref}
              sizeGuideLabel={sizeGuideLabel}
              onSizeInteract={() => setSizeConfirmed(true)}
            />
          </div>
        ) : null}

        <GoodIdeasAddToCartButton
          id={product.id}
          title={cartPayload.title}
          price={resolvedPrice}
          image={cartPayload.image}
          variantSelections={cartPayload.variantSelections}
          label={addLabel}
          disabled={ctaDisabled}
          variant={dtc ? "dtc" : "default"}
          className={
            dtc
              ? `${GI_DTC.cta} !w-auto shrink-0 whitespace-nowrap !min-h-0 !min-w-[8.5rem] px-4 py-2.5 text-sm`
              : "!w-auto shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 text-sm"
          }
        />
      </div>
    </div>
  );
}

type Props = {
  selectSizeLabel: string;
  sizeGuideHref?: string;
  sizeGuideLabel?: string;
};

const LazySticky = lazy(async () => ({
  default: StickyAddToCartInner,
}));

/** Sticky cart inferior — lazy mount, aparece al pasar el hero. */
export default function StickyAddToCart(props: Props) {
  return (
    <Suspense fallback={null}>
      <LazySticky {...props} />
    </Suspense>
  );
}
