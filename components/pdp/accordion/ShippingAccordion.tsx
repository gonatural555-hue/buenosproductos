"use client";

import PdpRichText from "@/components/pdp/PdpRichText";
import { PdpPremiumAccordion } from "@/components/pdp/accordion/PdpPremiumAccordion";
import type { PdpShippingSection } from "@/lib/good-ideas-pdp-content";

type Props = {
  title: string;
  sections: PdpShippingSection[];
};

export default function ShippingAccordion({ title, sections }: Props) {
  if (sections.length === 0) return null;

  return (
    <PdpPremiumAccordion id="shipping-returns" title={title}>
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="space-y-2">
            <h4 className="font-body text-[15px] font-semibold text-[#E8ECF1]">
              {section.title}
            </h4>
            <PdpRichText text={section.body} />
          </div>
        ))}
      </div>
    </PdpPremiumAccordion>
  );
}
