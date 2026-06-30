"use client";

import { PdpAccordionGroup } from "@/components/pdp/accordion/PdpPremiumAccordion";
import ProductDetailsAccordion from "@/components/pdp/accordion/ProductDetailsAccordion";
import ShippingAccordion from "@/components/pdp/accordion/ShippingAccordion";
import FAQAccordion from "@/components/pdp/accordion/FAQAccordion";
import type {
  PdpAccordionLabels,
  PdpFaqItem,
  PdpProductDetailsContent,
  PdpShippingSection,
} from "@/lib/good-ideas-pdp-content";

type Props = {
  labels: PdpAccordionLabels;
  productDetails: PdpProductDetailsContent;
  shippingSections: PdpShippingSection[];
  faqs: PdpFaqItem[];
};

export default function GoodIdeasPdpAccordions({
  labels,
  productDetails,
  shippingSections,
  faqs,
}: Props) {
  const hasAny =
    productDetails.hasContent ||
    shippingSections.length > 0 ||
    faqs.length > 0;

  if (!hasAny) return null;

  return (
    <div className="mt-2 lg:mt-4">
      <PdpAccordionGroup>
        <ProductDetailsAccordion
          title={labels.productDetails}
          content={productDetails}
        />
        <ShippingAccordion
          title={labels.shippingReturns}
          sections={shippingSections}
        />
        <FAQAccordion title={labels.helpFaqs} items={faqs} />
      </PdpAccordionGroup>
    </div>
  );
}
