"use client";

import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import {
  formatGoodIdeasDeliveryShortDate,
  getGoodIdeasDeliveryDates,
} from "@/lib/good-ideas-delivery";
import type { GoodIdeasPdpAccordionBundle } from "@/lib/good-ideas-pdp-content";
import type { SpecRow } from "@/lib/pdp-spec-rows";
import { GI_DTC } from "@/lib/ui/gi-pdp-dtc";
import PdpDtcFaqSection from "@/components/good-ideas/PdpDtcFaqSection";

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

  return (
    <div className="bg-white">
      <section
        className={`${GI_DTC.sectionPad} border-t border-[#E5E7EB] bg-[#FAFAFA]`}
      >
        <div className={`${GI_DTC.container} max-w-3xl text-center`}>
          <h2 className="font-body text-2xl font-bold tracking-tight text-[#111111] sm:text-3xl">
            {t("goodIdeas.pdp.dtc.launchOfferTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-base leading-relaxed text-[#6B7280]">
            {t("goodIdeas.pdp.dtc.launchOfferBody")}
          </p>
        </div>
      </section>

      <section className={`${GI_DTC.sectionPad} border-t border-[#E5E7EB]`}>
        <div className={`${GI_DTC.container} max-w-3xl text-center`}>
          <h2 className="font-body text-2xl font-bold tracking-tight text-[#111111] sm:text-3xl">
            {t("goodIdeas.pdp.dtc.guaranteeTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-body text-base leading-relaxed text-[#6B7280]">
            {t("goodIdeas.pdp.dtc.guaranteeBody")}
          </p>
        </div>
      </section>

      <section
        className={`${GI_DTC.sectionPad} border-t border-[#E5E7EB] bg-[#FAFAFA]`}
      >
        <div className={`${GI_DTC.container} max-w-3xl text-center`}>
          <h2 className="font-body text-2xl font-bold tracking-tight text-[#111111] sm:text-3xl">
            {t("goodIdeas.pdp.dtc.shippingTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-body text-base leading-relaxed text-[#6B7280]">
            {shippingBody}
          </p>
        </div>
      </section>

      {specRows.length > 0 ? (
        <section className={`${GI_DTC.sectionPad} border-t border-[#E5E7EB]`}>
          <div className={GI_DTC.container}>
            <h2 className="font-body text-xl font-bold text-[#111111] sm:text-2xl">
              {t("goodIdeas.pdp.dtc.specsTitle")}
            </h2>
            <dl className="mt-8 divide-y divide-[#E5E7EB] border-y border-[#E5E7EB]">
              {specRows.map((row) => (
                <div
                  key={row.label}
                  className="grid gap-1 py-4 sm:grid-cols-[minmax(0,220px)_1fr] sm:gap-6"
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
        </section>
      ) : null}

      <PdpDtcFaqSection
        title={t("goodIdeas.pdp.dtc.faqTitle")}
        items={accordionBundle.faqs}
      />
    </div>
  );
}
