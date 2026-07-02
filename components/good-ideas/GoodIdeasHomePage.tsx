import GoodIdeasHomeHero from "@/components/good-ideas/GoodIdeasHomeHero";
import GoodIdeasHomeFeaturedSection from "@/components/good-ideas/home/GoodIdeasHomeFeaturedSection";
import GoodIdeasHomeCategoriesSection from "@/components/good-ideas/home/GoodIdeasHomeCategoriesSection";
import GoodIdeasHomeWhyChooseSection from "@/components/good-ideas/home/GoodIdeasHomeWhyChooseSection";
import GoodIdeasHomeSocialProofSection from "@/components/good-ideas/home/GoodIdeasHomeSocialProofSection";
import GoodIdeasHomePromoBanner from "@/components/good-ideas/home/GoodIdeasHomePromoBanner";
import GoodIdeasHomeNewsletterSection from "@/components/good-ideas/home/GoodIdeasHomeNewsletterSection";
import GoodIdeasHomeTrustBar from "@/components/good-ideas/home/GoodIdeasHomeTrustBar";
import type { GoodIdeasTrustBarItem } from "@/components/good-ideas/home/GoodIdeasTrustBarIcons";
import type { GoodIdeasHomeFeaturedEntry } from "@/lib/good-ideas-home-featured";
import type {
  GoodIdeasHomeCategorySlug,
  GoodIdeasHomeCategoryTileCopy,
  GoodIdeasHomeCategoryTileData,
} from "@/lib/good-ideas-home-categories";
import type { GoodIdeasHomePromoProductVisual } from "@/lib/good-ideas-home-promo";
import type { GoodIdeasHomeReviewCard } from "@/lib/good-ideas-home-reviews";
import type { GoodIdeasWhyChooseItem } from "@/lib/good-ideas-home-why-choose";
import type { HeroProductShowcaseLayers } from "@/lib/hero-product-showcase";
import type { ProductReviewStatsSnapshot } from "@/lib/good-ideas-product-review-stats";
import type { Locale } from "@/lib/i18n/config";

export default function GoodIdeasHomePage({
  locale,
  eyebrow,
  titleBefore,
  titleAccent,
  subtitle,
  cta,
  socialProof,
  showcaseBadge,
  showcaseProductLayers,
  trustBarItems,
  trustBarAriaLabel,
  sectionAriaLabel,
  featuredEyebrow,
  featuredTitle,
  featuredViewAll,
  featuredViewProduct,
  featuredAddNow,
  featuredNoImage,
  featuredSectionAria,
  featuredEntries,
  featuredReviewStatsMap,
  shopByCategoryEyebrow,
  shopByCategoryTitle,
  shopByCategoryViewAll,
  shopByCategoryViewMore,
  shopByCategorySectionAria,
  shopByCategoryTiles,
  shopByCategoryTileCopyBySlug,
  whyChooseTitleBefore,
  whyChooseTitleAccent,
  whyChooseTitleAfter,
  whyChooseSectionAria,
  whyChooseItems,
  socialProofEyebrow,
  socialProofTitle,
  socialProofViewMore,
  socialProofSectionAria,
  socialProofAnonymous,
  socialProofReviews,
  socialProofViewMoreHref,
  promoTitle,
  promoHighlight,
  promoSubtitle,
  promoCta,
  promoCtaHref,
  promoSectionAria,
  promoProducts,
  newsletterTitle,
  newsletterSubtitle,
  newsletterEmailPlaceholder,
  newsletterCta,
  newsletterMarketingLabel,
  newsletterPrivacyLink,
  newsletterSectionAria,
  newsletterSuccessMessage,
  newsletterSubmitLoading,
}: {
  locale: Locale;
  eyebrow: string;
  titleBefore: string;
  titleAccent: string;
  subtitle: string;
  cta: string;
  socialProof: string;
  showcaseBadge: string;
  showcaseProductLayers: HeroProductShowcaseLayers;
  trustBarItems: GoodIdeasTrustBarItem[];
  trustBarAriaLabel: string;
  sectionAriaLabel: string;
  featuredEyebrow: string;
  featuredTitle: string;
  featuredViewAll: string;
  featuredViewProduct: string;
  featuredAddNow: string;
  featuredNoImage: string;
  featuredSectionAria: string;
  featuredEntries: GoodIdeasHomeFeaturedEntry[];
  featuredReviewStatsMap: Record<string, ProductReviewStatsSnapshot>;
  shopByCategoryEyebrow: string;
  shopByCategoryTitle: string;
  shopByCategoryViewAll: string;
  shopByCategoryViewMore: string;
  shopByCategorySectionAria: string;
  shopByCategoryTiles: GoodIdeasHomeCategoryTileData[];
  shopByCategoryTileCopyBySlug: Record<
    GoodIdeasHomeCategorySlug,
    GoodIdeasHomeCategoryTileCopy
  >;
  whyChooseTitleBefore: string;
  whyChooseTitleAccent: string;
  whyChooseTitleAfter: string;
  whyChooseSectionAria: string;
  whyChooseItems: GoodIdeasWhyChooseItem[];
  socialProofEyebrow: string;
  socialProofTitle: string;
  socialProofViewMore: string;
  socialProofSectionAria: string;
  socialProofAnonymous: string;
  socialProofReviews: GoodIdeasHomeReviewCard[];
  socialProofViewMoreHref: string;
  promoTitle: string;
  promoHighlight: string;
  promoSubtitle: string;
  promoCta: string;
  promoCtaHref: string;
  promoSectionAria: string;
  promoProducts: GoodIdeasHomePromoProductVisual[];
  newsletterTitle: string;
  newsletterSubtitle: string;
  newsletterEmailPlaceholder: string;
  newsletterCta: string;
  newsletterMarketingLabel: string;
  newsletterPrivacyLink: string;
  newsletterSectionAria: string;
  newsletterSuccessMessage: string;
  newsletterSubmitLoading: string;
}) {
  return (
    <main className="bg-[#0B0F14] text-[#E8ECF1]">
      <GoodIdeasHomeHero
        locale={locale}
        eyebrow={eyebrow}
        titleBefore={titleBefore}
        titleAccent={titleAccent}
        subtitle={subtitle}
        ctaLabel={cta}
        socialProof={socialProof}
        showcaseBadge={showcaseBadge}
        showcaseProductLayers={showcaseProductLayers}
        sectionAriaLabel={sectionAriaLabel}
      />
      <GoodIdeasHomeTrustBar items={trustBarItems} ariaLabel={trustBarAriaLabel} />
      <GoodIdeasHomeFeaturedSection
        locale={locale}
        eyebrow={featuredEyebrow}
        title={featuredTitle}
        viewAllLabel={featuredViewAll}
        viewProductLabel={featuredViewProduct}
        addNowLabel={featuredAddNow}
        noImageLabel={featuredNoImage}
        sectionAriaLabel={featuredSectionAria}
        entries={featuredEntries}
        reviewStatsMap={featuredReviewStatsMap}
      />
      <GoodIdeasHomeCategoriesSection
        locale={locale}
        eyebrow={shopByCategoryEyebrow}
        title={shopByCategoryTitle}
        viewAllLabel={shopByCategoryViewAll}
        viewMoreLabel={shopByCategoryViewMore}
        sectionAriaLabel={shopByCategorySectionAria}
        tiles={shopByCategoryTiles}
        tileCopyBySlug={shopByCategoryTileCopyBySlug}
      />
      <GoodIdeasHomeWhyChooseSection
        titleBefore={whyChooseTitleBefore}
        titleAccent={whyChooseTitleAccent}
        titleAfter={whyChooseTitleAfter}
        sectionAriaLabel={whyChooseSectionAria}
        items={whyChooseItems}
      />
      <GoodIdeasHomeSocialProofSection
        eyebrow={socialProofEyebrow}
        title={socialProofTitle}
        viewMoreLabel={socialProofViewMore}
        viewMoreHref={socialProofViewMoreHref}
        sectionAriaLabel={socialProofSectionAria}
        anonymousLabel={socialProofAnonymous}
        reviews={socialProofReviews}
      />
      <GoodIdeasHomePromoBanner
        title={promoTitle}
        highlight={promoHighlight}
        subtitle={promoSubtitle}
        ctaLabel={promoCta}
        ctaHref={promoCtaHref}
        sectionAriaLabel={promoSectionAria}
        products={promoProducts}
      />
      <GoodIdeasHomeNewsletterSection
        title={newsletterTitle}
        subtitle={newsletterSubtitle}
        emailPlaceholder={newsletterEmailPlaceholder}
        ctaLabel={newsletterCta}
        marketingLabel={newsletterMarketingLabel}
        privacyLinkLabel={newsletterPrivacyLink}
        sectionAriaLabel={newsletterSectionAria}
        successMessage={newsletterSuccessMessage}
        submitLoadingLabel={newsletterSubmitLoading}
      />
    </main>
  );
}
