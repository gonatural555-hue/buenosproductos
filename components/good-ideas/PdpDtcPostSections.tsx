"use client";

import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import {
  PdpDtcHorizontalTile,
  PdpDtcHorizontalTileRow,
} from "@/components/good-ideas/PdpDtcHorizontalTileRow";
import PdpDtcFaqSection from "@/components/good-ideas/PdpDtcFaqSection";
import {
  formatGoodIdeasDeliveryShortDate,
  getGoodIdeasDeliveryDates,
} from "@/lib/good-ideas-delivery";
import type { GoodIdeasPdpAccordionBundle } from "@/lib/good-ideas-pdp-content";
import type { SpecRow } from "@/lib/pdp-spec-rows";
import { GI_DTC } from "@/lib/ui/gi-pdp-dtc";

const promoTileContentClass =
  "flex h-full flex-col items-center justify-center px-6 py-5 text-center";

const promoTileTitleClass =
  "font-body text-xl font-bold tracking-tight text-[#111111] sm:text-2xl";

const promoTileBodyClass =
  "mt-4 font-body text-sm leading-relaxed text-[#6B7280] sm:text-base";

type Props = {
  accordionBundle: GoodIdeasPdpAccordionBundle;
  specRows: SpecRow[];
};

export default function PdpDtcPostSections({
  accordionBundle,
  specRows,
}: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const { start, end } = getGoodIdeasDeliveryDates();

  const shippingBody = t("goodIdeas.pdp.dtc.shippingBody", "")
    .replace("{start}", formatGoodIdeasDeliveryShortDate(start, locale))
    .replace("{end}", formatGoodIdeasDeliveryShortDate(end, locale));

  const faqItems = accordionBundle.faqs;
  const showSpecsFaqSection = specRows.length > 0 || faqItems.length > 0;

  return (
    <div className="bg-white">
      <section className="border-t border-[#E5E7EB] bg-white">
        <div className={`${GI_DTC.container} py-10 md:py-14`}>
          <PdpDtcHorizontalTileRow>
            <PdpDtcHorizontalTile
              className={`bg-[#FAFAFA] ${GI_DTC.promoTileHoverHighlight}`}
              heightPx={GI_DTC.horizontalPromoTileHeightPx}
            >
              <div className={promoTileContentClass}>
                <h2 className={`${promoTileTitleClass} ${GI_DTC.promoTileHoverTitle}`}>
                  {t("goodIdeas.pdp.dtc.launchOfferTitle")}
                </h2>
                <p className={promoTileBodyClass}>
                  {t("goodIdeas.pdp.dtc.launchOfferBody")}
                </p>
              </div>
            </PdpDtcHorizontalTile>

            <PdpDtcHorizontalTile
              className="bg-white"
              heightPx={GI_DTC.horizontalPromoTileHeightPx}
            >
              <div className={promoTileContentClass}>
                <h2 className={promoTileTitleClass}>
                  {t("goodIdeas.pdp.dtc.guaranteeTitle")}
                </h2>
                <p className={promoTileBodyClass}>
                  {t("goodIdeas.pdp.dtc.guaranteeBody")}
                </p>
              </div>
            </PdpDtcHorizontalTile>

            <PdpDtcHorizontalTile
              className={`bg-[#FAFAFA] ${GI_DTC.promoTileHoverHighlight}`}
              heightPx={GI_DTC.horizontalPromoTileHeightPx}
            >
              <div className={promoTileContentClass}>
                <h2 className={`${promoTileTitleClass} ${GI_DTC.promoTileHoverTitle}`}>
                  {t("goodIdeas.pdp.dtc.shippingTitle")}
                </h2>
                <p className={promoTileBodyClass}>{shippingBody}</p>
              </div>
            </PdpDtcHorizontalTile>
          </PdpDtcHorizontalTileRow>
        </div>
      </section>

      {showSpecsFaqSection ? (
        <section className="border-t border-[#E5E7EB] bg-white">
          <div className={`${GI_DTC.container} py-10 md:py-14`}>
            <div
              className={`${GI_DTC.horizontalThreeTileRowContainer} grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-12`}
            >
              {specRows.length > 0 ? (
                <div className="min-w-0">
                  <h2 className="font-body text-xl font-bold text-[#111111] sm:text-2xl">
                    {t("goodIdeas.pdp.dtc.specsTitle")}
                  </h2>
                  <dl className="mt-8 divide-y divide-[#E5E7EB] border-y border-[#E5E7EB]">
                    {specRows.map((row) => (
                      <div
                        key={row.label}
                        className="grid gap-1 py-4 sm:grid-cols-[minmax(0,140px)_1fr] sm:gap-4"
                      >
                        <dt className="font-body text-sm font-semibold text-[#111111]">
                          {row.label}
                        </dt>
                        <dd className="font-body text-sm leading-relaxed text-[#6B7280]">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}

              {faqItems.length > 0 ? (
                <div className="min-w-0">
                  <PdpDtcFaqSection
                    embedded
                    title={t("goodIdeas.pdp.dtc.faqTitle")}
                    items={faqItems}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
