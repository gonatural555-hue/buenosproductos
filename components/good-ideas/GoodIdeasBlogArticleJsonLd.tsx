import { getSiteUrl } from "@/lib/seo";
import { blogPostPath, productPath } from "@/lib/routing/paths";
import type { Locale } from "@/lib/i18n/config";
import type { GoodIdeasBlogPostEntry } from "@/lib/good-ideas-blog-loader";

type Props = {
  locale: Locale;
  post: GoodIdeasBlogPostEntry;
  heroImage: string;
  brandName: string;
};

export default function GoodIdeasBlogArticleJsonLd({
  locale,
  post,
  heroImage,
  brandName,
}: Props) {
  const base = getSiteUrl();
  const url = `${base}${blogPostPath(locale, post.slug)}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: heroImage.startsWith("http") ? heroImage : `${base}${heroImage}`,
    datePublished: post.publishedAt,
    author: {
      "@type": "Organization",
      name: brandName,
    },
    publisher: {
      "@type": "Organization",
      name: brandName,
    },
    mainEntityOfPage: url,
    ...(post.productId
      ? {
          mentions: {
            "@type": "Product",
            url: `${base}${productPath(locale, post.productId)}`,
            name: post.title.split(" — ")[0],
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
