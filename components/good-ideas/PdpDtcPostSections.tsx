"use client";

import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import { useProductReviews } from "@/hooks/useProductReviews";
import {
  formatGoodIdeasDeliveryShortDate,
  getGoodIdeasDeliveryDates,
} from "@/lib/good-ideas-delivery";
import type { GoodIdeasPdpAccordionBundle } from "@/lib/good-ideas-pdp-content";
import type { SpecRow } from "@/lib/pdp-spec-rows";
import { GI_DTC } from "@/lib/ui/gi-pdp-dtc";
import PdpDtcFaqSection from "@/components/good-ideas/PdpDtcFaqSection";

type Props = {
  productId: string;
  accordionBundle: GoodIdeasPdpAccordionBundle;
  specRows: SpecRow[];
};

function StarRow({ rating = 5 }: { rating?: number }) {
  const rounded = Math.round(rating);
  return (
    <span className="flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${i < rounded ? "text-[#FBBF24]" : "text-[#E5E7EB]"}`}
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.157c.969 0 1.371 1.24.588 1.81l-3.363 2.444a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.538 1.118l-3.364-2.444a1 1 0 00-1.175 0l-3.364 2.444c-.783.57-1.838-.197-1.538-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.03 9.382c-.783-.57-.38-1.81.588-1.81h4.157a1 1 0 00.95-.69l1.286-3.955z" />
        </svg>
      ))}
    </span>
  );
}

function ReviewCardDtc({
  author,
  text,
  rating = 5,
}: {
  author: string;
  text: string;
  rating?: number;
}) {
  return (
    <article className="rounded-sm border border-[#E5E7EB] bg-white p-5 sm:p-6">
      <StarRow rating={rating} />
      <p className="mt-4 font-body text-[15px] leading-relaxed text-[#374151]">
        {text}
      </p>
      <p className="mt-4 font-body text-sm font-semibold text-[#111111]">
        {author}
      </p>
    </article>
  );
}

export default function PdpDtcPostSections({
  productId,
  accordionBundle,
  specRows,
}: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const { reviews, hasReviews, loading } = useProductReviews(productId);
  const { start, end } = getGoodIdeasDeliveryDates();

  const featured = hasReviews
    ? reviews.slice(0, 3).map((r) => ({
        author: r.author || "Cliente",
        text: r.text || r.title || "",
        rating: r.rating,
      }))
    : [
        {
          author: t("goodIdeas.pdp.dtc.placeholderReview1.author"),
          text: t("goodIdeas.pdp.dtc.placeholderReview1.text"),
          rating: 5,
        },
        {
          author: t("goodIdeas.pdp.dtc.placeholderReview2.author"),
          text: t("goodIdeas.pdp.dtc.placeholderReview2.text"),
          rating: 5,
        },
        {
          author: t("goodIdeas.pdp.dtc.placeholderReview3.author"),
          text: t("goodIdeas.pdp.dtc.placeholderReview3.text"),
          rating: 5,
        },
      ];

  const shippingBody = t("goodIdeas.pdp.dtc.shippingBody", "")
    .replace("{start}", formatGoodIdeasDeliveryShortDate(start, locale))
    .replace("{end}", formatGoodIdeasDeliveryShortDate(end, locale));

  return (
    <div className="bg-white">
      <section
        id="pdp-dtc-reviews"
        className={`${GI_DTC.sectionPad} border-t border-[#E5E7EB]`}
      >
        <div className={GI_DTC.container}>
          <h2 className="text-center font-body text-2xl font-bold tracking-tight text-[#111111] sm:text-3xl">
            {t("goodIdeas.pdp.dtc.featuredReviewsTitle")}
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3 md:gap-6">
            {!loading
              ? featured.map((item, index) => (
                  <ReviewCardDtc
                    key={`${item.author}-${index}`}
                    author={item.author}
                    text={item.text}
                    rating={item.rating}
                  />
                ))
              : null}
          </div>
        </div>
      </section>

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
