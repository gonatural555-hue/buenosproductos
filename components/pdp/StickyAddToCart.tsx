"use client";

import { lazy, Suspense, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import SmartImage from "@/components/SmartImage";
import GoodIdeasAddToCartButton from "@/components/good-ideas/GoodIdeasAddToCartButton";
import PdpVariantSelector from "@/components/pdp/VariantSelector";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import { usePdpProductStateContext } from "@/context/PdpProductStateContext";
import { usePdpHeroVisibility } from "@/hooks/usePdpHeroVisibility";
import { useCurrency } from "@/context/CurrencyContext";
import { useGoodIdeasCart } from "@/context/GoodIdeasCartContext";
import { checkoutPath, isProductPdpPath } from "@/lib/routing/paths";
import { isValidImageSrc } from "@/lib/image-src";
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
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const dtc = isProductPdpPath(pathname);
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
        "fixed inset-x-0 bottom-0 z-[60] transition-all duration-300 ease-out lg:hidden",
        dtc
          ? "border-t border-[#E5E7EB] bg-white/98 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
          : "border-t border-white/[0.08] bg-[rgba(11,15,20,0.88)] backdrop-blur-xl",
        "pb-[max(0.65rem,env(safe-area-inset-bottom))]",
        pastHero
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-full opacity-0 pointer-events-none",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-[1320px] items-center gap-3 px-4 py-2.5 sm:gap-4">
        <div className="min-w-0 flex-1">
          <p
            className={`truncate font-body text-sm font-medium ${
              dtc ? "text-[#111111]" : "text-[#E8ECF1]"
            }`}
          >
            {shortTitle}
          </p>
          <p
            className={`font-body text-base font-bold tabular-nums sm:text-lg ${
              dtc ? "text-[#111111]" : "text-[#E8ECF1]"
            }`}
          >
            {formatMoney(resolvedPrice)}
          </p>
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

        <div className="flex shrink-0 items-center gap-2">
          {imageSrc && dtc ? (
            <div className="relative hidden h-10 w-10 shrink-0 overflow-hidden rounded-sm border border-[#E5E7EB] bg-white sm:block">
              <SmartImage
                src={imageSrc}
                alt=""
                fill
                sizes="40px"
                className="object-contain p-0.5"
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
                ? `${GI_DTC.cta} !w-auto whitespace-nowrap !min-h-0 px-5 py-2.5 text-sm`
                : "!w-auto whitespace-nowrap rounded-full px-4 py-2.5 text-sm sm:px-5"
            }
          />
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
