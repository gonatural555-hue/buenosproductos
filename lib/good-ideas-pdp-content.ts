import {
  formatGoodIdeasDeliveryShortDate,
  getGoodIdeasDeliveryDates,
} from "@/lib/good-ideas-delivery";
import type { Locale } from "@/lib/i18n/config";
import { formatTemplate } from "@/lib/seo";
import type { SpecRow } from "@/lib/pdp-spec-rows";

export type PdpFaqItem = {
  question: string;
  answer: string;
};

export type PdpShippingSection = {
  title: string;
  body: string;
};

export type PdpAccordionLabels = {
  productDetails: string;
  shippingReturns: string;
  helpFaqs: string;
};

export type PdpProductDetailsSection = {
  id: string;
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
  specRows?: SpecRow[];
  tags?: string[];
};

export type PdpProductDetailsContent = {
  sections: PdpProductDetailsSection[];
  hasContent: boolean;
};

type Messages = Record<string, unknown>;

function getMessagesValue(messages: Messages, key: string): unknown {
  return key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, messages);
}

function interpolateDelivery(
  text: string,
  locale: Locale,
  refDate?: Date
): string {
  const { start, end } = getGoodIdeasDeliveryDates(refDate);
  return formatTemplate(text, {
    start: formatGoodIdeasDeliveryShortDate(start, locale),
    end: formatGoodIdeasDeliveryShortDate(end, locale),
  });
}

export function getGoodIdeasPdpAccordionLabels(
  messages: Messages
): PdpAccordionLabels {
  const accordions = getMessagesValue(messages, "goodIdeas.pdp.accordions") as
    | PdpAccordionLabels
    | undefined;
  return {
    productDetails: accordions?.productDetails ?? "Product details",
    shippingReturns: accordions?.shippingReturns ?? "Shipping & returns",
    helpFaqs: accordions?.helpFaqs ?? "Help & FAQs",
  };
}

export function getGoodIdeasPdpShippingSections(
  messages: Messages,
  locale: Locale,
  refDate?: Date
): PdpShippingSection[] {
  const raw = getMessagesValue(messages, "goodIdeas.pdp.shipping.sections");
  if (!Array.isArray(raw)) return [];

  return raw
    .map((entry) => {
      const item = entry as { title?: string; body?: string };
      if (!item.title || !item.body) return null;
      return {
        title: item.title,
        body: interpolateDelivery(item.body, locale, refDate),
      };
    })
    .filter((item): item is PdpShippingSection => Boolean(item));
}

export function getGoodIdeasPdpFaqs(
  messages: Messages,
  locale: Locale,
  refDate?: Date
): PdpFaqItem[] {
  const raw = getMessagesValue(messages, "goodIdeas.pdp.faqs");
  if (!Array.isArray(raw)) return [];

  return raw
    .map((entry) => {
      const item = entry as { question?: string; answer?: string };
      if (!item.question || !item.answer) return null;
      return {
        question: item.question,
        answer: interpolateDelivery(item.answer, locale, refDate),
      };
    })
    .filter((item): item is PdpFaqItem => Boolean(item));
}

export type GoodIdeasPdpAccordionBundle = {
  labels: PdpAccordionLabels;
  productDetails: PdpProductDetailsContent;
  shippingSections: PdpShippingSection[];
  faqs: PdpFaqItem[];
};

export function buildPdpProductDetailsContent(input: {
  messages: Messages;
  useCase?: string;
  whyBetter?: string;
  longDescription?: string[];
  benefits?: string[];
  specRows?: SpecRow[];
  idealFor?: string[];
}): PdpProductDetailsContent {
  const headings = getMessagesValue(input.messages, "goodIdeas.pdp.details") as
    | Record<string, string>
    | undefined;

  const sections: PdpProductDetailsSection[] = [];

  const descriptionParagraphs = [
    input.useCase,
    input.whyBetter,
    ...(input.longDescription ?? []),
  ].filter((line): line is string => Boolean(line?.trim()));

  if (descriptionParagraphs.length > 0) {
    sections.push({
      id: "description",
      heading: headings?.descriptionHeading,
      paragraphs: descriptionParagraphs,
    });
  }

  const benefits = (input.benefits ?? []).filter((line) => line.trim());
  if (benefits.length > 0) {
    sections.push({
      id: "features",
      heading: headings?.featuresHeading,
      bullets: benefits,
    });
  }

  if ((input.specRows ?? []).length > 0) {
    sections.push({
      id: "materials",
      heading: headings?.materialsHeading,
      specRows: input.specRows,
    });
  }

  if ((input.idealFor ?? []).length > 0) {
    sections.push({
      id: "ideal-for",
      heading: headings?.idealForHeading,
      tags: input.idealFor,
    });
  }

  return {
    sections,
    hasContent: sections.length > 0,
  };
}

export function buildGoodIdeasPdpAccordionBundle(input: {
  messages: Messages;
  locale: Locale;
  useCase?: string;
  whyBetter?: string;
  longDescription?: string[];
  benefits?: string[];
  specRows?: SpecRow[];
  idealFor?: string[];
  refDate?: Date;
}): GoodIdeasPdpAccordionBundle {
  return {
    labels: getGoodIdeasPdpAccordionLabels(input.messages),
    productDetails: buildPdpProductDetailsContent(input),
    shippingSections: getGoodIdeasPdpShippingSections(
      input.messages,
      input.locale,
      input.refDate
    ),
    faqs: getGoodIdeasPdpFaqs(input.messages, input.locale, input.refDate),
  };
}
