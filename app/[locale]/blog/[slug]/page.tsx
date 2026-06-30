import { notFound } from "next/navigation";
import GoodIdeasBlogArticleHero from "@/components/good-ideas/GoodIdeasBlogArticleHero";
import GoodIdeasBlogPostContent from "@/components/good-ideas/GoodIdeasBlogPostContent";
import GoodIdeasBlogProductRail from "@/components/good-ideas/GoodIdeasBlogProductRail";
import {
  getGoodIdeasBlogPostBySlug,
  resolveGoodIdeasPostHeroImage,
} from "@/lib/good-ideas-blog";
import { getAllGoodIdeasBlogSlugs } from "@/lib/good-ideas-blog-loader";
import { getGoodIdeasCategoryLabel } from "@/lib/good-ideas-plp-categories";
import { getGoodIdeasProductById } from "@/lib/good-ideas-products";
import { getMessages } from "@/lib/i18n/messages";
import { createTranslator } from "@/lib/i18n/translate";
import { locales, type Locale } from "@/lib/i18n/config";
import { buildMetadata, formatTemplate } from "@/lib/seo";
import {
  blogPath,
  blogPostPath,
  buildPathByLocale,
  productPath,
} from "@/lib/routing/paths";
import { getGoodIdeasBrandName } from "@/lib/good-ideas-brand";
import { GI_CART_INNER, GI_CART_OUTER } from "@/lib/ui/gi-cart-light";
import { GI_HERO_TOP_PAD } from "@/lib/ui/goodideas-design";
import Link from "next/link";
import GoodIdeasBlogArticleJsonLd from "@/components/good-ideas/GoodIdeasBlogArticleJsonLd";

export async function generateStaticParams() {
  const slugs = getAllGoodIdeasBlogSlugs();
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
  const post = getGoodIdeasBlogPostBySlug(locale, slug);
  const messages = await getMessages(locale);
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
    pathByLocale: buildPathByLocale((l) => blogPostPath(l, slug)),
  });
}

export default async function GoodIdeasBlogPostPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const messages = await getMessages(locale);
  const t = createTranslator(messages);
  const post = getGoodIdeasBlogPostBySlug(locale, slug);

  if (!post) {
    notFound();
  }

  const heroImage = resolveGoodIdeasPostHeroImage(post);
  const intro = typeof post.intro === "string" ? post.intro : "";
  const sections = Array.isArray(post.sections) ? post.sections : [];
  const closing = typeof post.closing === "string" ? post.closing : "";
  const product = post.productId ? getGoodIdeasProductById(post.productId) : null;
  const relatedProducts = product ? [product] : [];

  return (
    <main className={`bg-white text-[#111111] ${GI_HERO_TOP_PAD}`}>
      <GoodIdeasBlogArticleJsonLd
        locale={locale}
        post={post}
        heroImage={heroImage}
        brandName={getGoodIdeasBrandName(locale)}
      />
      <GoodIdeasBlogArticleHero
        title={post.title}
        subtitle={post.subtitle}
        categoryLabel={getGoodIdeasCategoryLabel(post.categorySlug, t)}
        image={heroImage}
      />
      <GoodIdeasBlogPostContent
        intro={intro}
        sections={sections}
        closing={closing}
        locale={locale}
        productHref={post.productId ? productPath(locale, post.productId) : undefined}
        productCtaLabel={t("goodIdeas.blog.viewProductCta")}
      />
      {relatedProducts.length > 0 ? (
        <div className="border-t border-[#E5E5E5] bg-white">
          <GoodIdeasBlogProductRail
            locale={locale}
            title={t("goodIdeas.products.heroDiscover")}
            products={relatedProducts}
            viewProductLabel={t("common.viewProduct")}
          />
        </div>
      ) : null}
      <section className={`border-t border-[#E5E5E5] bg-white py-10 ${GI_CART_OUTER}`}>
        <div className={GI_CART_INNER}>
          <Link
            href={blogPath(locale)}
            className="font-body text-sm font-medium text-[#111111] underline underline-offset-2 transition hover:text-[#3B82F6]"
          >
            {t("goodIdeas.blog.backToBlog")}
          </Link>
        </div>
      </section>
    </main>
  );
}
