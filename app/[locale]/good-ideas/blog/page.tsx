import GoodIdeasBlogHero from "@/components/good-ideas/GoodIdeasBlogHero";
import GoodIdeasComingSoonBlock from "@/components/good-ideas/GoodIdeasComingSoonBlock";
import { GI_BLOG_POSTS_ANCHOR } from "@/lib/ui/goodideas-design";
import { getMessages } from "@/lib/i18n/messages";
import { createTranslator } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { BRAND_SEGMENTS } from "@/lib/routing/brands";

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
    pathByLocale: {
      en: `/en/${BRAND_SEGMENTS.goodIdeas}/blog`,
      es: `/es/${BRAND_SEGMENTS.goodIdeas}/blog`,
      fr: `/fr/${BRAND_SEGMENTS.goodIdeas}/blog`,
      it: `/it/${BRAND_SEGMENTS.goodIdeas}/blog`,
    },
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

  return (
    <main className="bg-[#0B0F14] text-[#E8ECF1]">
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
      <GoodIdeasComingSoonBlock
        id={GI_BLOG_POSTS_ANCHOR}
        title={t("goodIdeas.blog.comingSoonTitle")}
        body={t("goodIdeas.blog.comingSoonBody")}
      />
    </main>
  );
}
