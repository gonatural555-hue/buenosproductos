import { notFound } from "next/navigation";
import BlogPostHero from "@/components/blog/BlogPostHero";
import BlogPostContent from "@/components/blog/BlogPostContent";
import BlogPostFooter from "@/components/blog/BlogPostFooter";
import BlogSectionLinks from "@/components/blog/BlogSectionLinks";
import EditorialProductCards from "@/components/editorial/EditorialProductCards";
import { blogSections } from "@/lib/blog-sections";
import { getMessages } from "@/lib/i18n/messages";
import { locales, type Locale } from "@/lib/i18n/config";
import { buildMetadata, formatTemplate } from "@/lib/seo";
import { getProducts } from "@/lib/products";
import { getProductImages } from "@/lib/product-images";
import { pickProductsForPost } from "@/lib/internal-links";

export async function generateStaticParams() {
  const messages = await getMessages("en");
  const slugs = Object.keys(messages.blog.posts);
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
  const post = messages.blog.posts[slug];

  if (!post) {
    return {
      title: "Post no encontrado | Go Natural",
    };
  }

  const seo = messages.seo?.blogPost;
  const title = formatTemplate(seo?.titleTemplate || "{title} | Journal", {
    title: post.title,
  });
  const description = formatTemplate(seo?.descriptionTemplate || "{excerpt}", {
    excerpt: post.excerpt || post.subtitle || post.title,
  });
  const heroImage =
    post.heroImage ||
    post.sections?.[0]?.image ||
    "/assets/images/blog/blog-hero.webp";
  const pathByLocale = locales.reduce(
    (acc, localeKey) => ({
      ...acc,
      [localeKey]: `/${localeKey}/blog/${slug}`,
    }),
    {} as Record<Locale, string>
  );

  return buildMetadata({
    locale,
    title,
    description,
    pathByLocale,
    ogImage: heroImage,
    ogType: "article",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const messages = await getMessages(locale);
  const post = messages.blog.posts[slug];
  const products = getProducts();

  if (!post) {
    notFound();
  }

  const heroImage =
    post.heroImage ||
    post.sections?.[0]?.image ||
    "/assets/images/blog/blog-hero.webp";

  const intro = typeof post.intro === "string" ? post.intro : "";
  const sections = Array.isArray(post.sections) ? post.sections : [];
  const closing = typeof post.closing === "string" ? post.closing : "";

  const gearProducts = pickProductsForPost(slug, post, products);
  const gearCards = await Promise.all(
    gearProducts.map(async (product) => {
      const images = await getProductImages(product.id);
      const image =
        images.featured ||
        images.gallery[0] ||
        product.images?.[0] ||
        "";
      return {
        id: product.id,
        title: product.title,
        image,
      };
    })
  );

  return (
    <main className="bg-dark-base">
      <BlogPostHero
        title={post.title}
        subtitle={post.subtitle}
        image={heroImage}
      />
      <BlogPostContent
        intro={intro}
        sections={sections}
        closing={closing}
        locale={locale}
      />
      <EditorialProductCards
        title={messages.blog.fieldGear.title}
        locale={locale}
        caption={messages.blog.fieldGear.caption}
        products={gearCards.filter((item) => item.image)}
      />
      <section className="py-10 md:py-12">
        <div className="max-w-3xl mx-auto px-6 sm:px-10 lg:px-16">
          <h2 className="sr-only">Blog sections</h2>
          <BlogSectionLinks sections={blogSections} locale={locale} />
        </div>
      </section>
      <BlogPostFooter
        label={messages.common.backToJournal}
        href={`/${locale}/blog`}
      />
    </main>
  );
}

