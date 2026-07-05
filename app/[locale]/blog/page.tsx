import { blogPath, blogPostPath, buildPathByLocale } from "@/lib/routing/paths";
import GoodIdeasBlogHero from "@/components/good-ideas/GoodIdeasBlogHero";
import GoodIdeasBlogPostCard from "@/components/good-ideas/GoodIdeasBlogPostCard";
import {
  getGoodIdeasBlogPostEntries,
} from "@/lib/good-ideas-blog-loader";
import {
  resolveGoodIdeasPostHeroImage,
} from "@/lib/good-ideas-blog";
import { getGoodIdeasCategoryLabel } from "@/lib/good-ideas-plp-categories";
import { GI_BLOG_POSTS_ANCHOR } from "@/lib/ui/goodideas-design";
import { GI_CART_INNER, GI_CART_OUTER } from "@/lib/ui/gi-cart-light";
import { getMessages } from "@/lib/i18n/messages";
import { createTranslator } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import GoodIdeasBlogListJsonLd from "@/components/good-ideas/GoodIdeasBlogListJsonLd";

const FALLBACK_IMAGE = "/assets/images/blog/blog-hero.webp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const seo = messages.seo?.goodIdeas?.blog;

  return buildMetadata({
    locale,
    title: seo?.title,
    description: seo?.description,
    pathByLocale: buildPathByLocale(blogPath),
  });
}

export default async function GoodIdeasBlogPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const t = createTranslator(messages);
  const entries = getGoodIdeasBlogPostEntries(locale);

  return (
    <main className="bg-[#FFFFFF] text-[#111111]">
      <GoodIdeasBlogListJsonLd
        locale={locale}
        entries={entries}
        listName={t("goodIdeas.blog.articlesLabel")}
      />
      <GoodIdeasBlogHero
        locale={locale}
        title={t("goodIdeas.blog.heroTitle")}
        subtitle={t("goodIdeas.blog.heroSubtitle")}
        eyebrow={t("goodIdeas.blog.eyebrow")}
        exploreCtaLabel={t("goodIdeas.blog.exploreCta")}
        scrollHint={t("goodIdeas.blog.scrollHint")}
        postsAnchorId={GI_BLOG_POSTS_ANCHOR}
        sectionAriaLabel={t("goodIdeas.blog.sectionAria")}
      />

      <section
        id={GI_BLOG_POSTS_ANCHOR}
        className={`relative scroll-mt-[calc(env(safe-area-inset-top,0px)+6.5rem)] border-t border-[#E5E7EB] bg-[#FFFFFF] py-14 md:py-20 ${GI_CART_OUTER}`}
      >
        <div className={`relative ${GI_CART_INNER}`}>
          <h2 className="text-center font-display text-xl font-semibold tracking-[-0.02em] text-[#111111] md:text-2xl">
            {t("goodIdeas.blog.articlesLabel")}
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {entries.map((entry) => (
              <li key={entry.slug} className="min-w-0">
                <GoodIdeasBlogPostCard
                  href={blogPostPath(locale, entry.slug)}
                  title={entry.title}
                  excerpt={entry.excerpt}
                  categoryLabel={getGoodIdeasCategoryLabel(entry.categorySlug, t)}
                  image={resolveGoodIdeasPostHeroImage(entry) || FALLBACK_IMAGE}
                  ctaLabel={t("common.readArticle")}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
