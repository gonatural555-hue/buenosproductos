import GoodIdeasHomeReviewCard from "@/components/good-ideas/home/GoodIdeasHomeReviewCard";
import { SecondaryButton } from "@/components/good-ideas/home";
import HomeContainer from "@/components/good-ideas/home/HomeContainer";
import SectionEyebrow from "@/components/good-ideas/home/SectionEyebrow";
import SectionTitle from "@/components/good-ideas/home/SectionTitle";
import type { GoodIdeasHomeReviewCard as HomeReview } from "@/lib/good-ideas-home-reviews";

type Props = {
  eyebrow: string;
  title: string;
  viewMoreLabel: string;
  viewMoreHref: string;
  sectionAriaLabel: string;
  anonymousLabel: string;
  reviews: HomeReview[];
};

export default function GoodIdeasHomeSocialProofSection({
  eyebrow,
  title,
  viewMoreLabel,
  viewMoreHref,
  sectionAriaLabel,
  anonymousLabel,
  reviews,
}: Props) {
  if (reviews.length === 0) return null;

  return (
    <section
      className="border-t border-white/[0.08] bg-[#0B0F14] py-16 md:py-20 lg:py-24"
      aria-label={sectionAriaLabel}
    >
      <HomeContainer innerClassName="max-w-[1320px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="max-w-2xl">
            <SectionEyebrow>{eyebrow}</SectionEyebrow>
            <SectionTitle className="mt-3">{title}</SectionTitle>
          </div>
          <SecondaryButton
            href={viewMoreHref}
            className="w-full shrink-0 sm:w-auto lg:mb-1"
          >
            {viewMoreLabel}
          </SecondaryButton>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {reviews.map((review) => (
            <GoodIdeasHomeReviewCard
              key={review.id}
              review={review}
              anonymousLabel={anonymousLabel}
            />
          ))}
        </div>
      </HomeContainer>
    </section>
  );
}
