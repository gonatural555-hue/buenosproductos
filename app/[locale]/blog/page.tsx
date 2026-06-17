import BlogEditorialHero from "@/components/blog/BlogEditorialHero";
import BlogHero from "@/components/blog/BlogHero";
import FeaturedStory from "@/components/blog/FeaturedStory";
import EditorialGrid from "@/components/blog/EditorialGrid";
import ImageSection from "@/components/blog/ImageSection";
import QuoteBlock from "@/components/blog/QuoteBlock";
import CommunityCTA from "@/components/blog/CommunityCTA";
import ScrollReveal from "@/components/blog/ScrollReveal";
import BlogSectionLinks from "@/components/blog/BlogSectionLinks";
import { blogSections } from "@/lib/blog-sections";
import { buildHomeHeroCarouselProps } from "@/lib/build-home-hero-carousel-props";
import { getMessages } from "@/lib/i18n/messages";
import { createTranslator } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { getProducts } from "@/lib/products";

const FEATURED_SLUG = "edge-of-water";
const FALLBACK_IMAGE = "/assets/images/blog/blog-hero.webp";
const BLOG_COVER_IMAGE = "/assets/images/blog/banner.png";
const BLOG_POSTS_ANCHOR = "blog-posts";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const seo = messages.seo?.blog;

  return buildMetadata({
    locale,
    title: seo?.title,
    description: seo?.description,
    pathByLocale: {
      en: "/en/blog",
      es: "/es/blog",
      fr: "/fr/blog",
      it: "/it/blog",
    },
    ogImage: BLOG_COVER_IMAGE,
  });
}

type JournalCopy = {
  tagline: string;
  manifesto: string;
  featuredLabel: string;
  sectionsLabel: string;
  quotes: string[];
  communityTitle: string;
  communityBody: string;
  communityCta: string;
  imageCaptionTrail: string;
  imageCaptionDawn: string;
  imageAria1: string;
  imageAria2: string;
};

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const t = createTranslator(messages);

  const journal = (messages.blog as { journal?: JournalCopy } | undefined)
    ?.journal;
  const quotes = Array.isArray(journal?.quotes) ? journal!.quotes : [];

  const entries = Object.entries(messages.blog.posts).map(([slug, post]) => {
    const p = post as {
      title?: string;
      excerpt?: string;
      sections?: { image?: string }[];
    };
    return {
      slug,
      href: `/${locale}/blog/${slug}`,
      title: String(p.title ?? ""),
      excerpt: String(p.excerpt ?? ""),
      image: p.sections?.[0]?.image || FALLBACK_IMAGE,
    };
  });

  const featured =
    entries.find((e) => e.slug === FEATURED_SLUG) ?? entries[0] ?? null;
  const rest = featured
    ? entries.filter((e) => e.slug !== featured.slug)
    : entries;

  const tagline = journal?.tagline ?? "";
  const blogTitle = t("blog.title");
  const blogHeroAriaLabel = blogTitle.split("\n")[0]?.trim() || blogTitle;

  const products = getProducts();
  const blogHeroProps = buildHomeHeroCarouselProps(locale, t, products, {
    tagline,
    title: blogTitle,
    subtitle: t("blog.subtitle"),
    ctaProducts: t("hero.cta"),
    ctaJournal: t("homeJournal.cta"),
    imageSrc: "/assets/images/blog/blog-hero.webp",
    imageAlt: `${blogTitle.split("\n")[0]?.trim() ?? blogTitle} — Go Natural`,
  });

  return (
    <main data-hero-bleed className="bg-gn-page-bg text-dark-base">
      <BlogEditorialHero
        locale={locale}
        title={blogTitle}
        subtitle={t("blog.subtitle")}
        eyebrow={t("blog.heroEyebrow")}
        exploreCtaLabel={t("blog.heroExploreArticles")}
        postsAnchorId={BLOG_POSTS_ANCHOR}
        sectionAriaLabel={blogHeroAriaLabel}
        coverImageSrc={BLOG_COVER_IMAGE}
        coverImageAlt={blogHeroAriaLabel}
      />

      <BlogHero {...blogHeroProps} />

      {featured ? (
        <FeaturedStory
          post={{
            href: featured.href,
            title: featured.title,
            excerpt: featured.excerpt,
            image: featured.image,
          }}
          eyebrow={journal?.featuredLabel ?? ""}
          ctaLabel={t("common.readArticle")}
          anchorId={BLOG_POSTS_ANCHOR}
        />
      ) : null}

      {quotes[0] ? <QuoteBlock text={quotes[0]} /> : null}

      <ImageSection
        imageSrc="/assets/images/hero/storysection.webp"
        caption={journal?.imageCaptionTrail}
        imageAlt={journal?.imageAria1 ?? ""}
      />

      <EditorialGrid posts={rest} ctaLabel={t("common.readArticle")} />

      {quotes[1] ? <QuoteBlock text={quotes[1]} /> : null}

      <section className="border-y border-earth-brown/12 bg-gn-page-bg py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6 sm:px-10 lg:px-12">
          <ScrollReveal>
            <p className="text-center text-[0.65rem] font-semibold uppercase tracking-[0.38em] text-accent-gold">
              {journal?.sectionsLabel ?? ""}
            </p>
            <div className="mt-10 flex justify-center">
              <BlogSectionLinks sections={blogSections} locale={locale} />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <ImageSection
        imageSrc="/assets/images/hero/trekking.webp"
        caption={journal?.imageCaptionDawn}
        imageAlt={journal?.imageAria2 ?? ""}
      />

      {quotes[2] ? <QuoteBlock text={quotes[2]} /> : null}

      {quotes[3] ? <QuoteBlock text={quotes[3]} /> : null}

      <CommunityCTA
        title={journal?.communityTitle ?? ""}
        body={journal?.communityBody ?? ""}
        ctaLabel={journal?.communityCta ?? ""}
        href={`/${locale}/contact`}
      />
    </main>
  );
}
