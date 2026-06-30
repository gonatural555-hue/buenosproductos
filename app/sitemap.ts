import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/lib/i18n/config";
import { getGoodIdeasProducts } from "@/lib/good-ideas-products";
import {
  blogPostPath,
  homePath,
  productPath,
} from "@/lib/routing/paths";
import { getGoodIdeasBlogPostEntries } from "@/lib/good-ideas-blog-loader";
import { getSiteUrl, legalPathByLocale, type LegalSlugKey } from "@/lib/seo";

const BASE_PAGE_SUFFIXES = ["", "products", "about", "contact", "blog"] as const;

const LEGAL_PAGE_KEYS: LegalSlugKey[] = [
  "privacy",
  "cookies",
  "terms",
  "disclaimer",
  "returns",
  "shipping",
  "regret",
];

function localePageUrl(locale: Locale, suffix: string): string {
  const base = getSiteUrl();
  if (!suffix) return `${base}${homePath(locale)}`;
  return `${base}/${locale}/${suffix}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const urls: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    BASE_PAGE_SUFFIXES.forEach((suffix) => {
      urls.push({ url: localePageUrl(locale, suffix), lastModified: now });
    });
  });

  const giProducts = getGoodIdeasProducts();
  locales.forEach((locale) => {
    giProducts.forEach((product) => {
      urls.push({
        url: `${getSiteUrl()}${productPath(locale, product.id)}`,
        lastModified: now,
      });
    });
  });

  locales.forEach((locale) => {
    getGoodIdeasBlogPostEntries(locale).forEach((entry) => {
      urls.push({
        url: `${getSiteUrl()}${blogPostPath(locale, entry.slug)}`,
        lastModified: entry.publishedAt ? new Date(entry.publishedAt) : now,
      });
    });
  });

  locales.forEach((locale) => {
    LEGAL_PAGE_KEYS.forEach((key) => {
      urls.push({
        url: `${getSiteUrl()}${legalPathByLocale(key)[locale]}`,
        lastModified: now,
      });
    });
  });

  return urls;
}
