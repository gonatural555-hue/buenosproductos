import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCardSimple from "@/components/ProductCardSimple";
import { getProducts } from "@/lib/products";
import { getMessages } from "@/lib/i18n/messages";
import { createTranslator } from "@/lib/i18n/translate";
import { locales, type Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import {
  brandToSlug,
  productMatchesBrandSlug,
  resolveProductBrand,
} from "@/lib/pdp-brand";

type Props = {
  params: Promise<{ locale: Locale; slug: string }>;
};

export async function generateStaticParams() {
  const products = getProducts();
  const slugs = new Set<string>();
  products.forEach((product) => {
    slugs.add(brandToSlug(resolveProductBrand(product)));
  });
  return locales.flatMap((locale) =>
    Array.from(slugs).map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const products = getProducts().filter((p) => productMatchesBrandSlug(p, slug));
  if (products.length === 0) {
    return { title: "Marca | Go Natural" };
  }
  const brand = resolveProductBrand(products[0]);
  return buildMetadata({
    locale,
    title: `${brand} | Go Natural`,
    description: `Productos ${brand} en Go Natural — equipamiento outdoor seleccionado.`,
    pathByLocale: locales.reduce(
      (acc, loc) => ({ ...acc, [loc]: `/${loc}/brands/${slug}` }),
      {} as Record<Locale, string>
    ),
  });
}

export default async function BrandPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!locales.includes(locale)) notFound();

  const products = getProducts().filter((p) => productMatchesBrandSlug(p, slug));
  if (products.length === 0) notFound();

  const brand = resolveProductBrand(products[0]);
  const messages = await getMessages(locale);
  const t = createTranslator(messages);

  return (
    <main className="min-h-screen bg-gn-page-bg text-dark-base">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-10 md:py-16 lg:px-16">
        <nav className="mb-6 text-sm text-neutral-600">
          <Link href={`/${locale}/products`} className="hover:text-gn-forest hover:underline">
            {t("productsPage.catalogTitle")}
          </Link>
          <span className="mx-2" aria-hidden>
            /
          </span>
          <span className="text-neutral-900">{brand}</span>
        </nav>
        <header className="mb-10 max-w-2xl">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
            {brand}
          </h1>
          <p className="mt-3 font-inter text-sm leading-relaxed text-neutral-600 md:text-base">
            {products.length}{" "}
            {products.length === 1
              ? t("productPage.brandPage.productSingular")
              : t("productPage.brandPage.productPlural")}
          </p>
        </header>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCardSimple
              key={product.id}
              product={product}
              locale={locale}
              labels={{
                viewProduct: t("common.viewProduct"),
                addToCart: t("common.addToCart"),
                addNow: t("common.addNow"),
                noImage: t("common.noImage"),
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
