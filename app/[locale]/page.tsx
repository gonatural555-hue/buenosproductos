import HomeHero from "@/components/home/HomeHero";
import HomeCompassCategories from "@/components/home/HomeCompassCategories";
import BrandStatement from "@/components/home/BrandStatement";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import ImageStorySection from "@/components/home/ImageStorySection";
import CategoryGrid from "@/components/home/CategoryGrid";
import BlogPreview from "@/components/home/BlogPreview";
import CommunityCTA from "@/components/blog/CommunityCTA";
import { getProducts } from "@/lib/products";
import type { Product } from "@/lib/products";
import { getMessages } from "@/lib/i18n/messages";
import { createTranslator } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { CATEGORIES } from "@/lib/categories";
import { HOME_CATEGORY_IMAGE } from "@/lib/home-category-visuals";
import type { HeroCategoryCard } from "@/components/home/slides/HomeHeroCategorySlide";
import type { HeroProductPayload } from "@/components/home/slides/HomeHeroProductsSlide";

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
  /** Carrusel hero — slide categorías / productos (opcional, hay fallback en página) */
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

const HERO_PRODUCT_MAIN_ID = "gn-ski-snow-001";
const HERO_PRODUCT_STRIP_IDS = ["gn-water-007", "gn-outdoor-009", "gn-cycling-eq-001"] as const;

const FALLBACK_IMG = "/assets/images/hero/hero.webp";

function categoryDescription(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)?.description ?? "";
}

function heroCategoryImage(slug: string) {
  return HOME_CATEGORY_IMAGE[slug] ?? FALLBACK_IMG;
}

function toHeroProductPayload(locale: Locale, p: Product): HeroProductPayload {
  const loc = p.translations?.[locale];
  return {
    id: p.id,
    title: loc?.title ?? p.title,
    image: p.images?.[0] ?? null,
    price: p.price,
    href: `/${locale}/products/${p.id}`,
  };
}

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

  const categoryCards = Array.isArray(h.categoryCards)
    ? h.categoryCards
    : [];

  const trekkingTitle =
    h.heroSlide2TrekkingTitle ??
    (locale === "es"
      ? "Trekking y camping"
      : locale === "fr"
        ? "Trekking et camping"
        : locale === "it"
          ? "Trekking e campeggio"
          : "Trekking & Camping");

  const heroCategoryCards: HeroCategoryCard[] = [
    {
      slug: "mountain-snow",
      title: t("categories.names.mountain-snow"),
      subtitle: categoryDescription("mountain-snow"),
      image: heroCategoryImage("mountain-snow"),
    },
    {
      slug: "water-sports",
      title: t("categories.names.water-sports"),
      subtitle: categoryDescription("water-sports"),
      image: heroCategoryImage("water-sports"),
    },
    {
      slug: "outdoor-adventure",
      title: trekkingTitle,
      subtitle: categoryDescription("outdoor-adventure"),
      image: heroCategoryImage("outdoor-adventure"),
    },
    {
      slug: "active-sports",
      title: t("categories.names.active-sports"),
      subtitle: categoryDescription("active-sports"),
      image: heroCategoryImage("active-sports"),
    },
  ];

  const mainProduct =
    products.find((p) => p.id === HERO_PRODUCT_MAIN_ID) ?? products[0];
  const stripProducts = HERO_PRODUCT_STRIP_IDS.map((id) =>
    products.find((p) => p.id === id)
  ).filter((p): p is Product => Boolean(p));

  const productsSlidePayload =
    mainProduct != null
      ? {
          eyebrow: h.heroSlide3Eyebrow ?? "Featured",
          headline:
            h.heroSlide3Headline ??
            "Built for cold starts, long approaches, and uncertain forecasts.",
          subline:
            h.heroSlide3Subline ??
            "Layers, hydration, and kit we trust when the trail outlasts the daylight.",
          ctaLabel: h.heroSlide3Cta ?? t("common.viewProduct"),
          stripLabel: h.heroSlide3StripLabel ?? "Also shop",
          main: toHeroProductPayload(locale, mainProduct),
          strip: stripProducts.map((p) => toHeroProductPayload(locale, p)),
        }
      : {
          eyebrow: "Featured",
          headline: "Gear that moves with you.",
          subline: "Explore the catalog.",
          ctaLabel: t("common.viewProduct"),
          stripLabel: "Also shop",
          main: {
            id: "fallback",
            title: "Products",
            image: FALLBACK_IMG,
            price: 0,
            href: `/${locale}/products`,
          },
          strip: [] as HeroProductPayload[],
        };

  return (
    <main className="flex min-h-screen flex-col bg-warm-sand text-dark-base">
      <HomeHero
        locale={locale}
        tagline={h.heroTagline ?? "Go Natural"}
        title={h.heroTitle ?? t("homeImmersive.heroHeading")}
        subtitle={h.heroSubtitle ?? t("hero.subtitle")}
        ctaProducts={h.ctaProducts ?? t("hero.cta")}
        ctaJournal={h.ctaJournal ?? t("homeJournal.cta")}
        imageSrc="/assets/images/hero/hero.webp"
        imageAlt={h.heroImageAlt ?? ""}
        categorySlide={{
          eyebrow: h.heroSlide2Eyebrow ?? "Collections",
          headline: h.heroSlide2Headline ?? "Choose your line",
          cards: heroCategoryCards,
        }}
        productsSlide={productsSlidePayload}
      />

      <HomeCompassCategories
        locale={locale}
        cards={heroCategoryCards}
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
    </main>
  );
}
