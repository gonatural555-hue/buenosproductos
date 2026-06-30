"use client";

import { useEffect, useState } from "react";
import GoodIdeasProductCardClient from "@/components/good-ideas/GoodIdeasProductCardClient";
import {
  useLocale,
  useTranslations,
} from "@/components/i18n/LocaleProvider";
import { PdpCarouselSkeleton } from "@/components/pdp/PdpSectionSkeletons";
import { usePdpLazySection } from "@/hooks/usePdpLazySection";
import { useRelatedProducts } from "@/hooks/useRelatedProducts";
import { GI_PDP_INNER } from "@/lib/ui/gi-pdp-layout";

type Props = {
  productId: string;
  cardImagesById: Record<string, string>;
};

function CrossSellContent({
  productId,
  cardImagesById,
  onEmpty,
}: {
  productId: string;
  cardImagesById: Record<string, string>;
  onEmpty?: () => void;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const { products, loading, hasProducts } = useRelatedProducts(productId);

  useEffect(() => {
    if (loading) return;
    if (!hasProducts) {
      onEmpty?.();
    }
  }, [loading, hasProducts, onEmpty]);

  if (loading) {
    return <PdpCarouselSkeleton />;
  }

  if (!hasProducts) return null;

  const title = t("goodIdeas.pdp.phase3.crossSellTitle");
  const subtitle = t("goodIdeas.pdp.phase3.crossSellSubtitle");

  return (
    <>
      <header className="mb-8 space-y-2">
        <h2 className="font-body text-2xl font-semibold tracking-tight text-[#E8ECF1] sm:text-[1.65rem]">
          {title}
        </h2>
        {subtitle ? (
          <p className="font-body text-[15px] leading-relaxed text-[rgba(232,236,241,0.65)]">
            {subtitle}
          </p>
        ) : null}
      </header>

      <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2 scrollbar-hidden snap-x snap-mandatory">
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[min(72vw,240px)] shrink-0 snap-start sm:w-[240px]"
          >
            <GoodIdeasProductCardClient
              product={product}
              locale={locale}
              viewProductLabel={t("common.viewProduct")}
              noImageLabel={t("common.noImage")}
              addNowLabel={t("common.addNow")}
              cardImage={cardImagesById[product.id] ?? ""}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default function CrossSellCarousel({ productId, cardImagesById }: Props) {
  const t = useTranslations();
  const title = t("goodIdeas.pdp.phase3.crossSellTitle");
  const { ref, visible } = usePdpLazySection();
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  return (
    <section
      ref={ref}
      aria-label={title}
      className="border-t border-white/[0.08] py-14 md:py-16"
    >
      <div className={GI_PDP_INNER}>
        {!visible ? (
          <PdpCarouselSkeleton />
        ) : (
          <CrossSellContent
            productId={productId}
            cardImagesById={cardImagesById}
            onEmpty={() => setHidden(true)}
          />
        )}
      </div>
    </section>
  );
}
