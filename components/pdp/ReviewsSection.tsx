"use client";

import ReviewCard from "@/components/pdp/ReviewCard";
import RatingSummary from "@/components/pdp/RatingSummary";
import { PdpReviewsSkeleton } from "@/components/pdp/PdpSectionSkeletons";
import {
  useLocale,
  useTranslations,
} from "@/components/i18n/LocaleProvider";
import { usePdpLazySection } from "@/hooks/usePdpLazySection";
import { useProductReviews } from "@/hooks/useProductReviews";
import { GI_PDP_INNER } from "@/lib/ui/gi-pdp-layout";

type Props = {
  productId: string;
};

function ReviewsContent({ productId }: { productId: string }) {
  const t = useTranslations();
  const locale = useLocale();
  const dateLocale = locale === "es" ? "es-AR" : "en-US";
  const { reviews, stats, loading, hasReviews } = useProductReviews(productId);

  if (loading) {
    return <PdpReviewsSkeleton />;
  }

  const title = t("goodIdeas.pdp.phase3.reviewsTitle");
  const subtitle = t("goodIdeas.pdp.phase3.reviewsSubtitle");

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

      {hasReviews ? (
        <div className="grid gap-10 lg:grid-cols-[minmax(0,220px)_1fr] lg:gap-14">
          <RatingSummary
            stats={stats}
            reviewsLabel={t("goodIdeas.pdp.phase3.reviewsCountLabel")}
          />
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                verifiedLabel={t("goodIdeas.pdp.phase3.verifiedPurchase")}
                locale={dateLocale}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/[0.1] bg-[#151B24]/40 px-6 py-10 text-center">
          <p className="font-body text-base font-semibold text-[#E8ECF1]">
            {t("goodIdeas.pdp.phase3.reviewsEmptyTitle")}
          </p>
          <p className="mt-2 font-body text-[15px] text-[rgba(232,236,241,0.6)]">
            {t("goodIdeas.pdp.phase3.reviewsEmptyBody")}
          </p>
        </div>
      )}
    </>
  );
}

export default function ReviewsSection({ productId }: Props) {
  const t = useTranslations();
  const title = t("goodIdeas.pdp.phase3.reviewsTitle");
  const { ref, visible } = usePdpLazySection();

  return (
    <section
      ref={ref}
      id="pdp-reviews"
      aria-label={title}
      className="border-t border-white/[0.08] py-14 md:py-16"
    >
      <div className={GI_PDP_INNER}>
        {!visible ? (
          <PdpReviewsSkeleton />
        ) : (
          <ReviewsContent productId={productId} />
        )}
      </div>
    </section>
  );
}
