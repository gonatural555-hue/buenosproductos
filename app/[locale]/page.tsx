import GoodIdeasHomePage from "@/components/good-ideas/GoodIdeasHomePage";
import { resolveGoodIdeasHomeFeaturedProducts } from "@/lib/good-ideas-home-featured";
import {
  buildGoodIdeasHomeCategoryTileCopyMap,
  resolveGoodIdeasHomeCategoryTiles,
} from "@/lib/good-ideas-home-categories";
import { resolveGoodIdeasHomeHeroShowcase } from "@/lib/good-ideas-home-showcase";
import { buildHeroProductShowcaseLayers } from "@/lib/hero-product-showcase";
import { buildGoodIdeasHomeTrustBarItems } from "@/lib/good-ideas-home-trust-bar";
import { buildGoodIdeasHomeWhyChooseItems } from "@/lib/good-ideas-home-why-choose";
import {
  buildGoodIdeasHomeReviewPlaceholders,
  resolveGoodIdeasHomeReviews,
} from "@/lib/good-ideas-home-reviews";
import {
  resolveGoodIdeasHomePromoCtaHref,
  resolveGoodIdeasHomePromoProducts,
} from "@/lib/good-ideas-home-promo";
import { fetchGoodIdeasProductReviewStatsMap } from "@/lib/good-ideas-product-review-stats";
import { getMessages } from "@/lib/i18n/messages";
import { createTranslator } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { buildPathByLocale, homePath } from "@/lib/routing/paths";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const seo = messages.seo?.goodIdeas;

  return buildMetadata({
    locale,
    title: seo?.title,
    description: seo?.description,
    pathByLocale: buildPathByLocale(homePath),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const t = createTranslator(messages);
  const showcaseItems = resolveGoodIdeasHomeHeroShowcase(locale);
  const showcaseProductLayers = buildHeroProductShowcaseLayers(showcaseItems);
  const featuredEntries = resolveGoodIdeasHomeFeaturedProducts(4);
  const featuredReviewStatsMap = await fetchGoodIdeasProductReviewStatsMap(
    featuredEntries.map((entry) => entry.product.id)
  );
  const shopByCategoryTiles = resolveGoodIdeasHomeCategoryTiles(locale);
  const shopByCategoryTileCopyBySlug =
    buildGoodIdeasHomeCategoryTileCopyMap(t);
  const trustBarItems = buildGoodIdeasHomeTrustBarItems({
    shippingTitle: t("goodIdeas.trustBar.shippingTitle"),
    shippingDesc: t("goodIdeas.trustBar.shippingDesc"),
    secureTitle: t("goodIdeas.trustBar.secureTitle"),
    secureDesc: t("goodIdeas.trustBar.secureDesc"),
    innovativeTitle: t("goodIdeas.trustBar.innovativeTitle"),
    innovativeDesc: t("goodIdeas.trustBar.innovativeDesc"),
    supportTitle: t("goodIdeas.trustBar.supportTitle"),
    supportDesc: t("goodIdeas.trustBar.supportDesc"),
  });
  const whyChooseItems = buildGoodIdeasHomeWhyChooseItems({
    qualityTitle: t("goodIdeas.whyChoose.items.quality.title"),
    qualityDesc: t("goodIdeas.whyChoose.items.quality.description"),
    innovationTitle: t("goodIdeas.whyChoose.items.innovation.title"),
    innovationDesc: t("goodIdeas.whyChoose.items.innovation.description"),
    pricingTitle: t("goodIdeas.whyChoose.items.pricing.title"),
    pricingDesc: t("goodIdeas.whyChoose.items.pricing.description"),
    returnsTitle: t("goodIdeas.whyChoose.items.returns.title"),
    returnsDesc: t("goodIdeas.whyChoose.items.returns.description"),
  });
  const homeReviewsPayload = await resolveGoodIdeasHomeReviews(
    locale,
    buildGoodIdeasHomeReviewPlaceholders(t)
  );
  const promoProducts = resolveGoodIdeasHomePromoProducts(locale, 3);
  const promoCtaHref = resolveGoodIdeasHomePromoCtaHref(locale);

  return (
    <GoodIdeasHomePage
      locale={locale}
      eyebrow={t("goodIdeas.hero.eyebrow")}
      titleBefore={t("goodIdeas.hero.titleBefore")}
      titleAccent={t("goodIdeas.hero.titleAccent")}
      subtitle={t("goodIdeas.hero.subtitle")}
      cta={t("goodIdeas.hero.cta")}
      socialProof={t("goodIdeas.hero.socialProof")}
      showcaseBadge={t("goodIdeas.hero.showcaseBadge")}
      showcaseProductLayers={showcaseProductLayers}
      trustBarItems={trustBarItems}
      trustBarAriaLabel={t("goodIdeas.trustBar.ariaLabel")}
      sectionAriaLabel={t("goodIdeas.hero.sectionAria")}
      featuredEyebrow={t("goodIdeas.featured.eyebrow")}
      featuredTitle={t("goodIdeas.featured.title")}
      featuredViewAll={t("goodIdeas.featured.viewAll")}
      featuredViewProduct={t("common.viewProduct")}
      featuredAddNow={t("common.addNow")}
      featuredNoImage={t("common.noImage")}
      featuredSectionAria={t("goodIdeas.featured.sectionAria")}
      featuredEntries={featuredEntries}
      featuredReviewStatsMap={featuredReviewStatsMap}
      shopByCategoryEyebrow={t("goodIdeas.shopByCategory.eyebrow")}
      shopByCategoryTitle={t("goodIdeas.shopByCategory.title")}
      shopByCategoryViewAll={t("goodIdeas.shopByCategory.viewAll")}
      shopByCategoryViewMore={t("goodIdeas.shopByCategory.viewMore")}
      shopByCategorySectionAria={t("goodIdeas.shopByCategory.sectionAria")}
      shopByCategoryTiles={shopByCategoryTiles}
      shopByCategoryTileCopyBySlug={shopByCategoryTileCopyBySlug}
      whyChooseTitleBefore={t("goodIdeas.whyChoose.titleBefore")}
      whyChooseTitleAccent={t("goodIdeas.whyChoose.titleAccent")}
      whyChooseTitleAfter={t("goodIdeas.whyChoose.titleAfter")}
      whyChooseSectionAria={t("goodIdeas.whyChoose.sectionAria")}
      whyChooseItems={whyChooseItems}
      socialProofEyebrow={t("goodIdeas.socialProof.eyebrow")}
      socialProofTitle={t("goodIdeas.socialProof.title")}
      socialProofViewMore={t("goodIdeas.socialProof.viewMore")}
      socialProofSectionAria={t("goodIdeas.socialProof.sectionAria")}
      socialProofAnonymous={t("goodIdeas.socialProof.anonymous")}
      socialProofReviews={homeReviewsPayload.reviews}
      socialProofViewMoreHref={homeReviewsPayload.viewMoreHref}
      promoTitle={t("goodIdeas.promoBanner.title")}
      promoHighlight={t("goodIdeas.promoBanner.highlight")}
      promoSubtitle={t("goodIdeas.promoBanner.subtitle")}
      promoCta={t("goodIdeas.promoBanner.cta")}
      promoCtaHref={promoCtaHref}
      promoSectionAria={t("goodIdeas.promoBanner.sectionAria")}
      promoProducts={promoProducts}
      newsletterTitle={t("goodIdeas.newsletter.title")}
      newsletterSubtitle={t("goodIdeas.newsletter.subtitle")}
      newsletterEmailPlaceholder={t("goodIdeas.newsletter.emailPlaceholder")}
      newsletterCta={t("goodIdeas.newsletter.cta")}
      newsletterMarketingLabel={t("goodIdeas.newsletter.marketingLabel")}
      newsletterPrivacyLink={t("goodIdeas.newsletter.privacyLink")}
      newsletterSectionAria={t("goodIdeas.newsletter.sectionAria")}
      newsletterSuccessMessage={t("goodIdeas.newsletter.successMessage")}
      newsletterSubmitLoading={t("registrationCTA.submitLoading")}
    />
  );
}
