import Link from "next/link";
import { getAllCategories } from "@/lib/categories";
import { getMessages } from "@/lib/i18n/messages";
import { createTranslator } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const seo = messages.seo?.categories;

  return buildMetadata({
    locale,
    title: seo?.title,
    description: seo?.description,
    pathByLocale: {
      en: "/en/categories",
      es: "/es/categories",
      fr: "/fr/categories",
      it: "/it/categories",
    },
  });
}

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const t = createTranslator(messages);
  const categories = getAllCategories();

  return (
    <main className="max-w-7xl mx-auto px-4 py-16">
      <header className="mb-12">
        <h1 className="font-sans text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {t("header.nav.products")}
        </h1>
        <p className="text-gray-600 max-w-2xl">
          {t("productsPage.subtitle")}
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/${locale}/category/${category.slug}`}
            className="block p-6 border border-gray-200 rounded-lg hover:border-gray-900 hover:shadow-md transition-all duration-200"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {t(`categories.names.${category.slug}`, category.name)}
            </h2>
            <p className="text-sm text-gray-600">{category.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

