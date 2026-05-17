import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { getProducts } from "@/lib/products";
import { getCategorySlugs } from "@/lib/categories";
import { getMessages } from "@/lib/i18n/messages";
import { blogSections } from "@/lib/blog-sections";
import { LEGAL_SLUGS, getSiteUrl } from "@/lib/seo";

const BASE_PAGES = [
  "",
  "go-natural",
  "good-ideas",
  "products",
  "categories",
  "about",
  "contact",
  "blog",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const now = new Date();
  const urls: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    BASE_PAGES.forEach((path) => {
      const url = `${baseUrl}/${locale}${path ? `/${path}` : ""}`;
      urls.push({ url, lastModified: now });
    });
  });

  const categorySlugs = getCategorySlugs();
  locales.forEach((locale) => {
    categorySlugs.forEach((slug) => {
      urls.push({
        url: `${baseUrl}/${locale}/category/${slug}`,
        lastModified: now,
      });
    });
  });

  const products = getProducts();
  locales.forEach((locale) => {
    products.forEach((product) => {
      urls.push({
        url: `${baseUrl}/${locale}/products/${product.id}`,
        lastModified: now,
      });
    });
  });

  const messages = await getMessages("en");
  const postSlugs = Object.keys(messages.blog.posts);
  locales.forEach((locale) => {
    postSlugs.forEach((slug) => {
      urls.push({
        url: `${baseUrl}/${locale}/blog/${slug}`,
        lastModified: now,
      });
    });
  });

  locales.forEach((locale) => {
    blogSections.forEach((section) => {
      urls.push({
        url: `${baseUrl}/${locale}/blog/${section.slug}`,
        lastModified: now,
      });
    });
  });

  locales.forEach((locale) => {
    urls.push({
      url: `${baseUrl}/${locale}/${LEGAL_SLUGS.privacy[locale]}`,
      lastModified: now,
    });
    urls.push({
      url: `${baseUrl}/${locale}/${LEGAL_SLUGS.cookies[locale]}`,
      lastModified: now,
    });
    urls.push({
      url: `${baseUrl}/${locale}/${LEGAL_SLUGS.terms[locale]}`,
      lastModified: now,
    });
    urls.push({
      url: `${baseUrl}/${locale}/${LEGAL_SLUGS.disclaimer[locale]}`,
      lastModified: now,
    });
  });

  return urls;
}

