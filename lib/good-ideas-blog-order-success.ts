import type { Locale } from "@/lib/i18n/config";
import postsFile from "../scripts/good-ideas-blog/posts.json";
import { blogPostPath } from "@/lib/routing/paths";

const ORDER_SUCCESS_SLUGS = [
  "portable-travel-kettle-450ml",
  "lenovo-thinkplus-xt80-wireless-sports-earbuds",
  "sokany-sk-999-2-5l-high-power-multifunction-blender",
] as const;

type StoredPost = (typeof postsFile.posts)[number];

function localizeStored(post: StoredPost, locale: Locale) {
  const es = locale === "es" ? post.translations?.es : undefined;
  return {
    slug: post.slug,
    title: es?.title ?? post.title,
    excerpt: es?.excerpt ?? post.excerpt,
    image:
      post.heroImage ||
      post.sections?.[0]?.image ||
      "/assets/images/blog/blog-hero.webp",
  };
}

export function getOrderSuccessBlogCards(locale: Locale) {
  const bySlug = new Map(postsFile.posts.map((p) => [p.slug, p]));
  return ORDER_SUCCESS_SLUGS.map((slug) => {
    const post = bySlug.get(slug);
    if (!post) return null;
    const card = localizeStored(post, locale);
    return {
      ...card,
      href: blogPostPath(locale, slug),
    };
  }).filter((c): c is NonNullable<typeof c> => Boolean(c));
}
