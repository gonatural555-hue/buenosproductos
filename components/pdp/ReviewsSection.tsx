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
import { GI_DTC } from "@/lib/ui/gi-pdp-dtc";
import { GI_PDP_INNER } from "@/lib/ui/gi-pdp-layout";

type Props = {
  productId: string;
  surface?: "dark" | "light";
};

function ReviewsContent({
  productId,
  light,
}: {
  productId: string;
  light?: boolean;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const dateLocale = locale === "es" ? "es-AR" : "en-US";
  const { reviews, stats, loading, hasReviews } = useProductReviews(productId);

  if (loading) {
    return <PdpReviewsSkeleton light={light} />;
  }

  const title = t("goodIdeas.pdp.phase3.reviewsTitle");
  const subtitle = t("goodIdeas.pdp.phase3.reviewsSubtitle");
  const verifiedLabel = t("goodIdeas.pdp.phase3.verifiedPurchase");
  const anonymousLabel = t("goodIdeas.pdp.phase3.anonymousCustomer");
  const basedOnLabel = t("goodIdeas.pdp.phase3.reviewsBasedOn", "").replace(
    "{count}",
    String(stats.totalReviews)
  );

  const titleClass = light
    ? "font-body text-[28px] font-bold tracking-tight text-[#111111] md:text-[36px] lg:text-[40px]"
    : "font-body text-2xl font-semibold tracking-tight text-[#E8ECF1] sm:text-[1.65rem]";

  const subtitleClass = light
    ? "max-w-2xl font-body text-base leading-relaxed text-[#6B7280]"
    : "font-body text-[15px] leading-relaxed text-[rgba(232,236,241,0.65)]";

  const emptyWrapClass = light
    ? "rounded-[20px] border border-dashed border-[#ECECEC] bg-white px-6 py-12 text-center shadow-[0_4px_18px_rgba(0,0,0,0.04)]"
    : "rounded-xl border border-dashed border-white/[0.1] bg-[#151B24]/40 px-6 py-10 text-center";

  const emptyTitleClass = light
    ? "font-body text-base font-semibold text-[#111111]"
    : "font-body text-base font-semibold text-[#E8ECF1]";

  const emptyBodyClass = light
    ? "mt-2 font-body text-[15px] text-[#6B7280]"
    : "mt-2 font-body text-[15px] text-[rgba(232,236,241,0.6)]";

  return (
    <>
      <header className="mb-10 space-y-3 md:mb-12">
        <h2 className={titleClass}>{title}</h2>
        {subtitle ? <p className={subtitleClass}>{subtitle}</p> : null}
      </header>

      {hasReviews ? (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,28%)_minmax(0,72%)] lg:gap-12">
          <RatingSummary
            stats={stats}
            basedOnLabel={basedOnLabel}
            verifiedLabel={verifiedLabel}
            surface={light ? "light" : "dark"}
          />
          <div className="flex min-w-0 flex-col gap-5 sm:gap-6">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                verifiedLabel={verifiedLabel}
                anonymousLabel={anonymousLabel}
                locale={dateLocale}
                surface={light ? "light" : "dark"}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className={emptyWrapClass}>
          <p className={emptyTitleClass}>
            {t("goodIdeas.pdp.phase3.reviewsEmptyTitle")}
          </p>
          <p className={emptyBodyClass}>
            {t("goodIdeas.pdp.phase3.reviewsEmptyBody")}
          </p>
        </div>
      )}
    </>
  );
}

export default function ReviewsSection({
  productId,
  surface = "dark",
}: Props) {
  const t = useTranslations();
  const title = t("goodIdeas.pdp.phase3.reviewsTitle");
  const { ref, visible } = usePdpLazySection();
  const light = surface === "light";

  return (
    <section
      ref={ref}
      id="pdp-reviews-full"
      aria-label={title}
      className={
        light
          ? "bg-white py-12 md:py-16 lg:py-[72px] xl:py-[96px]"
          : "border-t border-white/[0.08] bg-transparent py-14 md:py-16"
      }
    >
      <div
        className={
          light
            ? `${GI_DTC.container} max-w-[1200px]`
            : GI_PDP_INNER
        }
      >
        {!visible ? (
          <PdpReviewsSkeleton light={light} />
        ) : (
          <ReviewsContent productId={productId} light={light} />
        )}
      </div>
    </section>
  );
}
