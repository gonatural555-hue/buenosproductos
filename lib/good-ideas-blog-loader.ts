import { readFileSync } from "fs";
import { join } from "path";
import type { Locale } from "@/lib/i18n/config";
import type { GoodIdeasBlogPost, GoodIdeasBlogPostsMap } from "@/lib/good-ideas-blog";

type StoredPost = GoodIdeasBlogPost & {
  slug: string;
  productId: string;
  categorySlug: string;
  sortOrder: number;
  publishedAt?: string;
  translations?: {
    es?: Omit<
      GoodIdeasBlogPost,
      "relatedProductIds" | "heroImage"
    > & {
      title: string;
      excerpt: string;
    };
  };
};

type PostsFile = {
  posts: StoredPost[];
};

const POSTS_PATH = join(process.cwd(), "scripts", "good-ideas-blog", "posts.json");

let cachedPosts: StoredPost[] | null = null;

function loadStoredPosts(): StoredPost[] {
  if (cachedPosts) return cachedPosts;
  try {
    const raw = readFileSync(POSTS_PATH, "utf-8");
    const data = JSON.parse(raw) as PostsFile;
    cachedPosts = Array.isArray(data.posts) ? data.posts : [];
  } catch {
    cachedPosts = [];
  }
  return cachedPosts;
}

function localizePost(stored: StoredPost, locale: Locale): GoodIdeasBlogPost & {
  slug: string;
  productId: string;
  categorySlug: string;
  sortOrder: number;
  publishedAt?: string;
} {
  const es = locale === "es" ? stored.translations?.es : undefined;
  const localized: GoodIdeasBlogPost = {
    title: es?.title ?? stored.title,
    excerpt: es?.excerpt ?? stored.excerpt,
    subtitle: es?.subtitle ?? stored.subtitle,
    intro: es?.intro ?? stored.intro,
    sections: es?.sections ?? stored.sections,
    closing: es?.closing ?? stored.closing,
    heroImage: stored.heroImage,
    relatedProductIds: stored.relatedProductIds ?? [stored.productId],
  };
  return {
    slug: stored.slug,
    productId: stored.productId,
    categorySlug: stored.categorySlug,
    sortOrder: stored.sortOrder,
    publishedAt: stored.publishedAt,
    ...localized,
  };
}

export type GoodIdeasBlogPostEntry = ReturnType<typeof localizePost>;

export function getGoodIdeasBlogPostEntries(locale: Locale): GoodIdeasBlogPostEntry[] {
  return loadStoredPosts()
    .map((post) => localizePost(post, locale))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getGoodIdeasBlogPostsMap(locale: Locale): GoodIdeasBlogPostsMap {
  const map: GoodIdeasBlogPostsMap = {};
  for (const entry of getGoodIdeasBlogPostEntries(locale)) {
    const { slug, productId, categorySlug, sortOrder, publishedAt, ...post } = entry;
    void slug;
    void productId;
    void categorySlug;
    void sortOrder;
    void publishedAt;
    map[entry.slug] = post;
  }
  return map;
}

export function getGoodIdeasBlogPostBySlug(
  locale: Locale,
  slug: string
): GoodIdeasBlogPostEntry | null {
  return getGoodIdeasBlogPostEntries(locale).find((p) => p.slug === slug) ?? null;
}

export function getAllGoodIdeasBlogSlugs(): string[] {
  return loadStoredPosts().map((p) => p.slug);
}
