"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import {
  PdpDtcHorizontalTile,
  PdpDtcHorizontalTileRow,
} from "@/components/good-ideas/PdpDtcHorizontalTileRow";
import PdpDtcFaqSection from "@/components/good-ideas/PdpDtcFaqSection";
import PdpDtcSpecsSection from "@/components/good-ideas/PdpDtcSpecsSection";
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

type MobileTab = "specs" | "faq";

type Props = {
  accordionBundle: GoodIdeasPdpAccordionBundle;
  specRows: SpecRow[];
};

function MobileSpecsFaqTabs({
  active,
  onChange,
  hasSpecs,
  hasFaq,
}: {
  active: MobileTab;
  onChange: (tab: MobileTab) => void;
  hasSpecs: boolean;
  hasFaq: boolean;
}) {
  const t = useTranslations();

  if (!hasSpecs || !hasFaq) return null;

  const tabs: { id: MobileTab; label: string }[] = [
    {
      id: "specs",
      label: t("goodIdeas.pdp.dtc.specsTab", "Especificaciones"),
    },
    {
      id: "faq",
      label: t("goodIdeas.pdp.dtc.faqTab", "Preguntas frecuentes"),
    },
  ];

  return (
    <div
      className="mb-6 flex gap-1 rounded-full border border-[#E5E7EB] bg-[#FAFAFA] p-1 lg:hidden"
      role="tablist"
      aria-label={t("goodIdeas.pdp.dtc.specsFaqTabsAria", "Especificaciones y preguntas")}
    >
      {tabs.map((tab) => {
        const selected = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={[
              "flex-1 rounded-full px-3 py-2 font-body text-xs font-semibold transition-colors duration-200 motion-reduce:transition-none sm:text-sm",
              selected
                ? "bg-white text-[#111111] shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
                : "text-[#6B7280] hover:text-[#111111]",
            ].join(" ")}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export default function PdpDtcPostSections({
  accordionBundle,
  specRows,
}: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const { start, end } = getGoodIdeasDeliveryDates();
  const hasSpecs = specRows.length > 0;
  const faqItems = accordionBundle.faqs;
  const hasFaq = faqItems.length > 0;
  const showSpecsFaqSection = hasSpecs || hasFaq;

  const [mobileTab, setMobileTab] = useState<MobileTab>(
    hasSpecs ? "specs" : "faq"
  );

  const shippingBody = t("goodIdeas.pdp.dtc.shippingBody", "")
    .replace("{start}", formatGoodIdeasDeliveryShortDate(start, locale))
    .replace("{end}", formatGoodIdeasDeliveryShortDate(end, locale));

  const specsBlock = hasSpecs ? (
    <PdpDtcSpecsSection
      title={t("goodIdeas.pdp.dtc.specsTitle")}
      rows={specRows}
    />
  ) : null;

  const faqBlock = hasFaq ? (
    <PdpDtcFaqSection
      embedded
      title={t("goodIdeas.pdp.dtc.faqTitle")}
      items={faqItems}
    />
  ) : null;

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
          <div className={`${GI_DTC.container} py-8 md:py-10`}>
            <MobileSpecsFaqTabs
              active={mobileTab}
              onChange={setMobileTab}
              hasSpecs={hasSpecs}
              hasFaq={hasFaq}
            />

            <div
              className={[
                GI_DTC.horizontalThreeTileRowContainer,
                hasSpecs && hasFaq
                  ? "grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-10"
                  : "max-w-2xl",
              ].join(" ")}
            >
              {hasSpecs ? (
                <div
                  className={[
                    "min-w-0",
                    hasFaq && mobileTab !== "specs" ? "hidden lg:block" : "",
                  ].join(" ")}
                >
                  {specsBlock}
                </div>
              ) : null}

              {hasFaq ? (
                <div
                  className={[
                    "min-w-0",
                    hasSpecs && mobileTab !== "faq" ? "hidden lg:block" : "",
                  ].join(" ")}
                >
                  {faqBlock}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
