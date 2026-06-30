"use client";

import PdpRichText from "@/components/pdp/PdpRichText";
import { PdpPremiumAccordion } from "@/components/pdp/accordion/PdpPremiumAccordion";
import type { PdpFaqItem } from "@/lib/good-ideas-pdp-content";

type Props = {
  title: string;
  items: PdpFaqItem[];
};

export default function FAQAccordion({ title, items }: Props) {
  if (items.length === 0) return null;

  return (
    <PdpPremiumAccordion id="help-faqs" title={title}>
      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.question} className="space-y-2">
            <h4 className="font-body text-[15px] font-semibold text-[#E8ECF1]">
              {item.question}
            </h4>
            <PdpRichText text={item.answer} />
          </div>
        ))}
      </div>
    </PdpPremiumAccordion>
  );
}
