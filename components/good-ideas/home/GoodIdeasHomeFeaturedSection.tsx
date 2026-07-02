import GoodIdeasHomeFeaturedProductCard from "@/components/good-ideas/home/GoodIdeasHomeFeaturedProductCard";
import { SecondaryButton } from "@/components/good-ideas/home";
import HomeContainer from "@/components/good-ideas/home/HomeContainer";
import SectionEyebrow from "@/components/good-ideas/home/SectionEyebrow";
import SectionTitle from "@/components/good-ideas/home/SectionTitle";
import type { GoodIdeasHomeFeaturedEntry } from "@/lib/good-ideas-home-featured";
import type { ProductReviewStatsSnapshot } from "@/lib/good-ideas-product-review-stats";
import type { Locale } from "@/lib/i18n/config";
import { productsPath } from "@/lib/routing/paths";

type Props = {
  locale: Locale;
  eyebrow: string;
  title: string;
  viewAllLabel: string;
  viewProductLabel: string;
  addNowLabel: string;
  noImageLabel: string;
  sectionAriaLabel: string;
  entries: GoodIdeasHomeFeaturedEntry[];
  reviewStatsMap: Record<string, ProductReviewStatsSnapshot>;
};

export default function GoodIdeasHomeFeaturedSection({
  locale,
  eyebrow,
  title,
  viewAllLabel,
  viewProductLabel,
  addNowLabel,
  noImageLabel,
  sectionAriaLabel,
  entries,
  reviewStatsMap,
}: Props) {
  if (entries.length === 0) return null;

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
            href={productsPath(locale)}
            className="w-full shrink-0 sm:w-auto lg:mb-1"
          >
            {viewAllLabel}
          </SecondaryButton>
        </div>

        <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:mt-12 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:pb-0 lg:grid-cols-4 lg:gap-6 [&::-webkit-scrollbar]:hidden">
          {entries.map((entry) => (
            <div
              key={entry.product.id}
              className="w-[min(82vw,300px)] shrink-0 snap-start sm:w-auto sm:shrink"
            >
              <GoodIdeasHomeFeaturedProductCard
                product={entry.product}
                cardImage={entry.cardImage}
                reviewStats={reviewStatsMap[entry.product.id]}
                viewProductLabel={viewProductLabel}
                addNowLabel={addNowLabel}
                noImageLabel={noImageLabel}
              />
            </div>
          ))}
        </div>
      </HomeContainer>
    </section>
  );
}
