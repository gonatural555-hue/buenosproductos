import { getSiteUrl } from "@/lib/seo";
import { blogPostPath } from "@/lib/routing/paths";
import type { Locale } from "@/lib/i18n/config";
import type { GoodIdeasBlogPostEntry } from "@/lib/good-ideas-blog-loader";

type Props = {
  locale: Locale;
  entries: GoodIdeasBlogPostEntry[];
  listName: string;
};

export default function GoodIdeasBlogListJsonLd({
  locale,
  entries,
  listName,
}: Props) {
  const base = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${base}${blogPostPath(locale, entry.slug)}`,
      name: entry.title,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
