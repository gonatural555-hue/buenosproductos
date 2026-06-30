import type { Locale } from "@/lib/i18n/config";
import {
  getAllGoodIdeasBlogSlugs,
  getGoodIdeasBlogPostBySlug,
  getGoodIdeasBlogPostEntries,
  getGoodIdeasBlogPostsMap,
} from "@/lib/good-ideas-blog-loader";

export type GoodIdeasBlogSection = {
  heading?: string;
  paragraphs: string[];
  image?: string;
};

export type GoodIdeasBlogPost = {
  title: string;
  excerpt: string;
  subtitle?: string;
  intro?: string;
  sections?: GoodIdeasBlogSection[];
  closing?: string;
  heroImage?: string;
  relatedProductIds?: string[];
  productId?: string;
  categorySlug?: string;
  sortOrder?: number;
  publishedAt?: string;
};

export type GoodIdeasBlogPostsMap = Record<string, GoodIdeasBlogPost>;

const FALLBACK_HERO = "/assets/images/blog/blog-hero.webp";

/** @deprecated Posts live in scripts/good-ideas-blog/posts.json — pass locale. */
export function getGoodIdeasBlogPosts(
  _messages: Record<string, unknown>,
  locale: Locale = "en"
): GoodIdeasBlogPostsMap {
  return getGoodIdeasBlogPostsMap(locale);
}

export function getGoodIdeasBlogPostSlugs(_messages?: Record<string, unknown>): string[] {
  return getAllGoodIdeasBlogSlugs();
}

export function resolveGoodIdeasPostHeroImage(post: GoodIdeasBlogPost): string {
  return (
    post.heroImage ||
    post.sections?.find((s) => s.image)?.image ||
    FALLBACK_HERO
  );
}

export async function loadGoodIdeasBlogPosts(locale: Locale) {
  return getGoodIdeasBlogPostsMap(locale);
}

export { getGoodIdeasBlogPostBySlug, getGoodIdeasBlogPostEntries };
