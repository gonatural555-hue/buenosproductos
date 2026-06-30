"use client";

import { lazy, Suspense, useCallback } from "react";
import { useRouter } from "next/navigation";
import SmartImage from "@/components/SmartImage";
import GoodIdeasAddToCartButton from "@/components/good-ideas/GoodIdeasAddToCartButton";
import PdpVariantSelector from "@/components/pdp/VariantSelector";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import { usePdpProductStateContext } from "@/context/PdpProductStateContext";
import { usePdpHeroVisibility } from "@/hooks/usePdpHeroVisibility";
import { useCurrency } from "@/context/CurrencyContext";
import { useGoodIdeasCart } from "@/context/GoodIdeasCartContext";
import { checkoutPath } from "@/lib/routing/paths";
import { isValidImageSrc } from "@/lib/image-src";
import { GI_PDP_CTA_CLASS } from "@/lib/ui/gi-pdp-layout";

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
  const locale = useLocale();
  const router = useRouter();
  const { formatMoney } = useCurrency();
  const { addItem } = useGoodIdeasCart();
  const { pastHero } = usePdpHeroVisibility();

  const {
    product,
    seoH1,
    resolvedPrice,
    cartImage,
    cartPayload,
    ctaDisabled,
    setSizeConfirmed,
    productVariants,
  } = usePdpProductStateContext();

  const shortTitle =
    seoH1.length > 48 ? `${seoH1.slice(0, 45).trim()}…` : seoH1;
  const imageSrc = isValidImageSrc(cartImage) ? cartImage : null;
  const hasVariants = Boolean(productVariants?.variants?.length);
  const addLabel = ctaDisabled ? selectSizeLabel : t("common.addToCart");
  const buyNowLabel = t("goodIdeas.pdp.phase4.buyNow");

  const handleBuyNow = useCallback(() => {
    if (ctaDisabled) return;
    addItem(cartPayload);
    router.push(checkoutPath(locale));
  }, [addItem, cartPayload, ctaDisabled, locale, router]);

  return (
    <div
      role="region"
      aria-label={t("goodIdeas.pdp.phase4.stickyCartLabel")}
      aria-hidden={!pastHero}
      className={[
        "fixed inset-x-0 bottom-0 z-[60] transition-all duration-300 ease-out",
        "border-t border-white/[0.08] bg-[rgba(11,15,20,0.88)] backdrop-blur-xl",
        "pb-[max(0.65rem,env(safe-area-inset-bottom))]",
        pastHero
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-full opacity-0 pointer-events-none",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-[1292px] items-center gap-3 px-4 py-2.5 sm:gap-4 sm:py-3">
        {/* Imagen + título + precio */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="relative hidden h-11 w-11 shrink-0 overflow-hidden rounded-md border border-white/[0.1] bg-[#151B24] sm:block">
            {imageSrc ? (
              <SmartImage
                src={imageSrc}
                alt=""
                fill
                sizes="44px"
                className="object-cover"
              />
            ) : null}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate font-body text-sm font-medium text-[#E8ECF1]">
              {shortTitle}
            </p>
            <p className="font-body text-base font-bold tabular-nums text-[#E8ECF1] sm:text-lg">
              {formatMoney(resolvedPrice)}
            </p>
          </div>
        </div>

        {/* Variantes compactas (desktop) */}
        {hasVariants ? (
          <div className="hidden shrink-0 md:block">
            <PdpVariantSelector
              mode="compact"
              sizeGuideHref={sizeGuideHref}
              sizeGuideLabel={sizeGuideLabel}
              onSizeInteract={() => setSizeConfirmed(true)}
            />
          </div>
        ) : null}

        {/* CTAs */}
        <div className="flex shrink-0 items-center gap-2">
          <GoodIdeasAddToCartButton
            id={product.id}
            title={cartPayload.title}
            price={resolvedPrice}
            image={cartPayload.image}
            variantSelections={cartPayload.variantSelections}
            label={addLabel}
            disabled={ctaDisabled}
            className={`${GI_PDP_CTA_CLASS} !w-auto whitespace-nowrap px-4 py-2.5 text-sm sm:px-5`}
          />
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={ctaDisabled}
            className={[
              "hidden rounded-full border border-white/20 px-4 py-2.5 font-body text-sm font-semibold text-[#E8ECF1]",
              "transition-all duration-200 hover:border-white/35 hover:bg-white/[0.06]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/50",
              "disabled:cursor-not-allowed disabled:opacity-50 sm:inline-flex",
            ].join(" ")}
          >
            {buyNowLabel}
          </button>
        </div>
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
