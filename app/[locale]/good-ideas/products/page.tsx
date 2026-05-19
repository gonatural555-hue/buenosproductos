import GoodIdeasProductsHero from "@/components/good-ideas/GoodIdeasProductsHero";
import GoodIdeasComingSoonBlock from "@/components/good-ideas/GoodIdeasComingSoonBlock";
import GoodIdeasProductCard from "@/components/good-ideas/GoodIdeasProductCard";
import { getGoodIdeasProducts } from "@/lib/good-ideas-products";
import { GI_CATALOG_SECTION_ID } from "@/lib/ui/goodideas-design";
import { getMessages } from "@/lib/i18n/messages";
import { createTranslator } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { BRAND_SEGMENTS } from "@/lib/routing/brands";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const seo = messages.seo?.goodIdeas?.products;

  return buildMetadata({
    locale,
    title: seo?.title,
    description: seo?.description,
    pathByLocale: {
      en: `/en/${BRAND_SEGMENTS.goodIdeas}/products`,
      es: `/es/${BRAND_SEGMENTS.goodIdeas}/products`,
      fr: `/fr/${BRAND_SEGMENTS.goodIdeas}/products`,
      it: `/it/${BRAND_SEGMENTS.goodIdeas}/products`,
    },
  });
}

export default async function GoodIdeasProductsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const t = createTranslator(messages);
  const products = getGoodIdeasProducts();

  const categoryCtas = [
    { id: "home", label: t("goodIdeas.products.categories.home"), tone: "mist" as const },
    { id: "tech", label: t("goodIdeas.products.categories.tech"), tone: "accent" as const },
    {
      id: "lifestyle",
      label: t("goodIdeas.products.categories.lifestyle"),
      tone: "slate" as const,
    },
    { id: "gifts", label: t("goodIdeas.products.categories.gifts"), tone: "soft" as const },
  ];

  return (
    <main className="bg-[#0B0F14] text-[#E8ECF1]">
      <GoodIdeasProductsHero
        title={t("goodIdeas.products.heroTitle")}
        subtitle={t("goodIdeas.products.heroSubtitle")}
        accentWord={t("goodIdeas.products.heroAccentWord")}
        categoryCtas={categoryCtas}
        discoverCtaLabel={t("goodIdeas.products.heroDiscover")}
        scrollHint={t("goodIdeas.products.scrollHint")}
        catalogSectionId={GI_CATALOG_SECTION_ID}
      />
      {products.length > 0 ? (
        <section
          id={GI_CATALOG_SECTION_ID}
          className="scroll-mt-24 border-t border-white/[0.06] px-6 py-16 sm:px-10 md:py-20"
          aria-label={t("goodIdeas.products.heroDiscover")}
        >
          <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {products.map((product) => (
              <GoodIdeasProductCard
                key={product.id}
                product={product}
                locale={locale}
                viewProductLabel={t("common.viewProduct")}
                noImageLabel={t("common.noImage")}
              />
            ))}
          </div>
        </section>
      ) : (
        <GoodIdeasComingSoonBlock
          id={GI_CATALOG_SECTION_ID}
          title={t("goodIdeas.products.comingSoonTitle")}
          body={t("goodIdeas.products.comingSoonBody")}
        />
      )}
    </main>
  );
}
