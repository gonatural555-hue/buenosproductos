import MountainSideDecorations from "@/components/brand/MountainSideDecorations";
import HomeBrandHero from "@/components/home/HomeBrandHero";
import BrandStatement from "@/components/home/BrandStatement";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import ImageStorySection from "@/components/home/ImageStorySection";
import CategoryGrid from "@/components/home/CategoryGrid";
import BlogPreview from "@/components/home/BlogPreview";
import CommunityCTA from "@/components/blog/CommunityCTA";
import { getProducts } from "@/lib/products";
import { getMessages } from "@/lib/i18n/messages";
import { createTranslator } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { LUMINOUS_EDGE_LIGHT } from "@/lib/ui/luminous-edge";

type HomePageMessages = {
  heroTagline: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaProducts: string;
  ctaJournal: string;
  brandStatement: string;
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
  heroImageAlt: string;
  heroSlide2Eyebrow?: string;
  heroSlide2Headline?: string;
  heroSlide2TrekkingTitle?: string;
  heroSlide3Eyebrow?: string;
  heroSlide3Headline?: string;
  heroSlide3Subline?: string;
  heroSlide3Cta?: string;
  heroSlide3StripLabel?: string;
};

const JOURNAL_PREVIEW_SLUGS = [
  "edge-of-water",
  "winter-lines",
  "calm-motion",
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const seo = messages.seo?.home;

  return buildMetadata({
    locale,
    title: seo?.title,
    description: seo?.description,
    pathByLocale: {
      en: "/en",
      es: "/es",
      fr: "/fr",
      it: "/it",
    },
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
  const products = getProducts();

  const hp = (messages as { homePage?: HomePageMessages }).homePage;
  const h = hp ?? ({} as Partial<HomePageMessages>);

  const cardLabels = {
    viewProduct: t("common.viewProduct"),
    addToCart: t("common.addToCart"),
    noImage: t("common.noImage"),
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
      className={`relative overflow-x-hidden flex min-h-screen flex-col bg-[#F4EBDD] text-dark-base ${LUMINOUS_EDGE_LIGHT}`}
    >
      <MountainSideDecorations />

      <div className="relative z-10 flex flex-1 flex-col">
        <HomeBrandHero
          locale={locale}
          eyebrow={t("homeBrandHero.eyebrow")}
          title={t("homeBrandHero.title")}
          subtitle={t("homeBrandHero.subtitle")}
          ctaPrimary={t("homeBrandHero.ctaPrimary")}
          ctaSecondary={t("homeBrandHero.ctaSecondary")}
          scrollHint={t("homeBrandHero.scrollHint")}
          cardinalLabels={{
            north: t("homeCompass.north"),
            south: t("homeCompass.south"),
            east: t("homeCompass.east"),
            west: t("homeCompass.west"),
          }}
          compassAriaLabel={t("homeCompass.compassAria")}
        />

        <BrandStatement text={h.brandStatement ?? t("story.title")} />

        <FeaturedProducts
          products={products}
          locale={locale}
          title={h.essentialTitle ?? t("featured.title")}
          subtitle={h.essentialSubtitle ?? t("featured.subtitle")}
          labels={cardLabels}
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
        />
      </div>
    </main>
  );
}
