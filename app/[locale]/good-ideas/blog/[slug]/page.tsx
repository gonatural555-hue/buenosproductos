import { notFound } from "next/navigation";
import BlogPostHero from "@/components/blog/BlogPostHero";
import BlogPostFooter from "@/components/blog/BlogPostFooter";
import GoodIdeasBlogPostContent from "@/components/good-ideas/GoodIdeasBlogPostContent";
import GoodIdeasBlogProductRail from "@/components/good-ideas/GoodIdeasBlogProductRail";
import {
  getGoodIdeasBlogPosts,
  resolveGoodIdeasPostHeroImage,
  type GoodIdeasBlogPost,
} from "@/lib/good-ideas-blog";
import { getGoodIdeasProductById } from "@/lib/good-ideas-products";
import { getMessages } from "@/lib/i18n/messages";
import { createTranslator } from "@/lib/i18n/translate";
import { locales, type Locale } from "@/lib/i18n/config";
import { buildMetadata, formatTemplate } from "@/lib/seo";
import {
  BRAND_SEGMENTS,
  goodIdeasBlogPath,
} from "@/lib/routing/brands";
import { getGoodIdeasBrandName } from "@/lib/good-ideas-brand";
import { GI_HERO_TOP_PAD } from "@/lib/ui/goodideas-design";

export async function generateStaticParams() {
  const messages = await getMessages("en");
  const slugs = Object.keys(getGoodIdeasBlogPosts(messages));
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const messages = await getMessages(locale);
  const posts = getGoodIdeasBlogPosts(messages);
  const post = posts[slug];

  const brandName = getGoodIdeasBrandName(locale);

  if (!post) {
    return { title: `Post not found | ${brandName}` };
  }

  const seo = messages.seo?.goodIdeas?.blogPost;
  const title = formatTemplate(
    seo?.titleTemplate ?? `{title} | ${brandName} Blog`,
    { title: post.title }
  );
  const description = formatTemplate(
    seo?.descriptionTemplate ?? "{excerpt}",
    { excerpt: post.excerpt }
  );
  const ogImage = resolveGoodIdeasPostHeroImage(post);

  return buildMetadata({
    locale,
    title,
    description,
    ogImage,
    ogType: "article",
    pathByLocale: {
      en: `/en/${BRAND_SEGMENTS.goodIdeas}/blog/${slug}`,
      es: `/es/${BRAND_SEGMENTS.goodIdeas}/blog/${slug}`,
      fr: `/fr/${BRAND_SEGMENTS.goodIdeas}/blog/${slug}`,
      it: `/it/${BRAND_SEGMENTS.goodIdeas}/blog/${slug}`,
    },
  });
}

function resolveRelatedProducts(post: GoodIdeasBlogPost) {
  const ids = post.relatedProductIds ?? [];
  return ids
    .map((id) => getGoodIdeasProductById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 4);
}

export default async function GoodIdeasBlogPostPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const messages = await getMessages(locale);
  const t = createTranslator(messages);
  const posts = getGoodIdeasBlogPosts(messages);
  const post = posts[slug];

  if (!post) {
    notFound();
  }

  const heroImage = resolveGoodIdeasPostHeroImage(post);
  const intro = typeof post.intro === "string" ? post.intro : "";
  const sections = Array.isArray(post.sections) ? post.sections : [];
  const closing = typeof post.closing === "string" ? post.closing : "";
  const relatedProducts = resolveRelatedProducts(post);

  return (
    <main className={`bg-[#0B0F14] text-[#E8ECF1] ${GI_HERO_TOP_PAD}`}>
      <BlogPostHero
        title={post.title}
        subtitle={post.subtitle}
        image={heroImage}
      />
      <GoodIdeasBlogPostContent
        intro={intro}
        sections={sections}
        closing={closing}
        locale={locale}
      />
      <GoodIdeasBlogProductRail
        locale={locale}
        title={t("goodIdeas.products.heroDiscover")}
        products={relatedProducts}
        viewProductLabel={t("common.viewProduct")}
      />
      <BlogPostFooter
        href={goodIdeasBlogPath(locale)}
        label={t("goodIdeas.blog.backToBlog")}
      />
    </main>
  );
}
