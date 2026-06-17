import { Suspense } from "react";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import ImageStorySection from "@/components/home/ImageStorySection";
import CategoryGrid from "@/components/home/CategoryGrid";
import BlogPreview from "@/components/home/BlogPreview";
import CommunityCTA from "@/components/blog/CommunityCTA";
import ProductsHero from "@/components/products/ProductsHero";
import MembershipPromotionBanner from "@/components/products/MembershipPromotionBanner";
import { getProducts } from "@/lib/products";
import { getMessages } from "@/lib/i18n/messages";
import { createTranslator } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/config";
import { pickHomeEssentialProducts } from "@/lib/home-featured-products";
import { getColorImageMapsForProducts } from "@/lib/plp-product-color-images";
import { goNaturalCatalogPath } from "@/lib/routing/brands";
import { homePrimaryCtaClass } from "@/lib/ui/premium-cta-classes";

type HomePageMessages = {
  essentialTitle: string;
  essentialSubtitle: string;
  imageStoryTitle: string;
  imageStoryAria: string;
  categoriesTitle: string;
  categoriesSubtitle: string;
  categoryCards: {
    label: string;
    slug?: string;
    path?: string;
    imageKey?: string;
  }[];
  journalTitle: string;
  journalIntro: string;
  journalCta: string;
  communityTitle: string;
  communityTagline?: string;
  communityBody: string;
  communityCta: string;
};

const JOURNAL_PREVIEW_SLUGS = [
  "edge-of-water",
  "winter-lines",
  "calm-motion",
] as const;

export default async function GoNaturalHomePage({
  locale,
}: {
  locale: Locale;
}) {
  const messages = await getMessages(locale);
  const t = createTranslator(messages);
  const products = getProducts();
  const essentialProducts = pickHomeEssentialProducts(products);
  const colorImageMaps = await getColorImageMapsForProducts(essentialProducts);

  const hp = (messages as { homePage?: HomePageMessages }).homePage;
  const h = hp ?? ({} as Partial<HomePageMessages>);

  const cardLabels = {
    viewProduct: t("common.viewProduct"),
    addToCart: t("common.addToCart"),
    addNow: t("common.addNow"),
    noImage: t("common.noImage"),
    newColor: t("productsPage.badgeNewColor"),
    salePercentTemplate: t("productsPage.badgeSalePercent"),
  };

  const journalCtaHref = `/${locale}/blog`;
  const featuredPosts = JOURNAL_PREVIEW_SLUGS.map((slug) => {
    const post = messages.blog?.posts?.[slug];
    if (!post) return null;
    return {
      href: `/${locale}/blog/${slug}`,
      title: post.title,
      excerpt: post.excerpt,
      image:
        (post as { heroImage?: string }).heroImage ||
        post.sections?.[0]?.image ||
        "/assets/images/blog/blog-hero.webp",
    };
  }).filter(Boolean) as {
    href: string;
    title: string;
    excerpt: string;
    image: string;
  }[];

  const categoryCards = Array.isArray(h.categoryCards) ? h.categoryCards : [];

  return (
    <main
      data-hero-bleed
      className="relative flex min-h-screen flex-col overflow-x-hidden text-dark-base"
    >
      <div className="bg-gn-page-bg">
        <Suspense fallback={null}>
          <ProductsHero locale={locale} />
        </Suspense>

        <Suspense fallback={null}>
          <MembershipPromotionBanner locale={locale} />
        </Suspense>
      </div>

      <div className="relative z-10 flex flex-1 flex-col bg-gn-page-bg">
        <FeaturedProducts
          products={products}
          locale={locale}
          title={h.essentialTitle ?? t("featured.title")}
          subtitle={h.essentialSubtitle ?? t("featured.subtitle")}
          colorImageMaps={colorImageMaps}
          labels={cardLabels}
          viewAllHref={goNaturalCatalogPath(locale)}
          viewAllLabel={t("productsPage.searchViewAll")}
        />

        <ImageStorySection
          imageSrc="/assets/images/hero/trekking.webp"
          imageAlt={h.imageStoryAria ?? ""}
          title={h.imageStoryTitle ?? t("story.lines.0")}
        />

        {categoryCards.length > 0 ? (
          <CategoryGrid
            locale={locale}
            title={h.categoriesTitle ?? t("homePage.categoriesTitle")}
            subtitle={h.categoriesSubtitle ?? t("homePage.categoriesSubtitle")}
            cards={categoryCards}
          />
        ) : null}

        <BlogPreview
          title={h.journalTitle ?? t("homeJournal.title")}
          intro={h.journalIntro ?? t("homeJournal.intro")}
          ctaLabel={h.journalCta ?? t("homeJournal.cta")}
          ctaHref={journalCtaHref}
          readLabel={t("common.readArticle")}
          posts={featuredPosts}
        />

        <CommunityCTA
          title={h.communityTitle ?? t("blog.journal.communityTitle")}
          tagline={h.communityTagline}
          body={h.communityBody ?? t("blog.journal.communityBody")}
          ctaLabel={h.communityCta ?? t("blog.journal.communityCta")}
          href={`/${locale}/contact`}
          ctaClassName={homePrimaryCtaClass}
        />
      </div>
    </main>
  );
}
