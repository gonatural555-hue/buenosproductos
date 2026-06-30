import { blogPath, blogPostPath, buildPathByLocale } from "@/lib/routing/paths";
import GoodIdeasBlogHero from "@/components/good-ideas/GoodIdeasBlogHero";
import GoodIdeasBlogPostRow from "@/components/good-ideas/GoodIdeasBlogPostRow";
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
    <main>
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
        className={`relative isolate scroll-mt-[calc(env(safe-area-inset-top,0px)+6.5rem)] border-t border-white/[0.08] bg-[#0B0F14] py-14 text-[#E8ECF1] md:py-20 ${GI_CART_OUTER}`}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(59,130,246,0.12),transparent_55%)]"
          aria-hidden
        />
        <div className={`relative ${GI_CART_INNER}`}>
          <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-[#E8ECF1] md:text-2xl">
            {t("goodIdeas.blog.articlesLabel")}
          </h2>
          <ul className="mt-8 flex flex-col gap-4 md:mt-10 md:gap-5">
            {entries.map((entry) => (
              <li key={entry.slug}>
                <GoodIdeasBlogPostRow
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
