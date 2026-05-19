import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getGoodIdeasProductById,
  getGoodIdeasProducts,
  localizeGoodIdeasProduct,
  getGoodIdeasProductCopy,
} from "@/lib/good-ideas-products";
import { getProductImages } from "@/lib/product-images";
import { getMessages } from "@/lib/i18n/messages";
import { createTranslator } from "@/lib/i18n/translate";
import { locales, type Locale } from "@/lib/i18n/config";
import { buildMetadata, formatTemplate } from "@/lib/seo";
import {
  BRAND_SEGMENTS,
  goodIdeasCartPath,
  goodIdeasProductsPath,
} from "@/lib/routing/brands";
import { GI_HERO_TOP_PAD } from "@/lib/ui/goodideas-design";
import ProductDetailClient from "@/components/ProductDetailClient";
import PdpBenefitsSection from "@/components/pdp/PdpBenefitsSection";
import PdpSpecsAccordion from "@/components/pdp/PdpSpecsAccordion";

type Props = {
  params: Promise<{ locale: Locale; id: string }>;
};

export async function generateStaticParams() {
  const products = getGoodIdeasProducts();
  return locales.flatMap((locale) =>
    products.map((product) => ({
      locale,
      id: product.id,
    }))
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, id } = await params;
  const product = getGoodIdeasProductById(id);

  if (!product) {
    return { title: "Producto no encontrado | Good Ideas" };
  }

  const localized = localizeGoodIdeasProduct(product, locale);
  const messages = await getMessages(locale);
  const seo = messages.seo?.goodIdeas?.product;

  return buildMetadata({
    locale,
    title:
      formatTemplate(seo?.titleTemplate ?? "{title} | Good Ideas", {
        title: localized.title,
      }) ?? `${localized.title} | Good Ideas`,
    description:
      localized.shortDescription ??
      localized.description ??
      createTranslator(messages)("seo.goodIdeas.description"),
    pathByLocale: {
      en: `/en/${BRAND_SEGMENTS.goodIdeas}/products/${id}`,
      es: `/es/${BRAND_SEGMENTS.goodIdeas}/products/${id}`,
      fr: `/fr/${BRAND_SEGMENTS.goodIdeas}/products/${id}`,
      it: `/it/${BRAND_SEGMENTS.goodIdeas}/products/${id}`,
    },
    ogImage: product.images[0],
  });
}

export default async function GoodIdeasProductPage({ params }: Props) {
  const { locale, id } = await params;
  const product = getGoodIdeasProductById(id);

  if (!product) {
    notFound();
  }

  const localizedProduct = localizeGoodIdeasProduct(product, locale);
  const { useCase, whyBetter, benefits, idealFor } =
    getGoodIdeasProductCopy(localizedProduct);
  const messages = await getMessages(locale);
  const t = createTranslator(messages);
  const productImages = await getProductImages(product.id);

  const pdpDesktop = {
    benefitsTitle: t("productPage.pdpDesktop.benefitsTitle"),
    specsToggle: t("productPage.pdpDesktop.specsToggle"),
    idealForLabel: t("productPage.pdpDesktop.idealForLabel"),
    trustMicrocopy: t("productPage.pdpDesktop.trustMicrocopy"),
    shippingHeading: t("productPage.pdpDesktop.shippingHeading"),
    shippingEurope: t("productPage.pdpDesktop.shippingEurope"),
    shippingLatam: t("productPage.pdpDesktop.shippingLatam"),
    secureAndWarranty: t("productPage.pdpDesktop.secureAndWarranty"),
    returns: t("productPage.pdpDesktop.returns"),
    benefits: benefits.slice(0, 4),
    specBullets: benefits.slice(0, 8),
    idealForLine: idealFor.join(" · "),
  };

  const detailLines = [
    useCase,
    whyBetter,
    `${t("productPage.pdpDesktop.idealForLabel")} ${idealFor.join(" · ")}`,
    ...(localizedProduct.longDescription ?? []),
  ].filter((line) => line && line.trim().length > 0);

  const accordionItems: { id: string; title: string; lines: string[] }[] = [];
  if (benefits.length > 0) {
    accordionItems.push({
      id: "specs",
      title: t("productPage.pdpDesktop.specsAccordionTitle"),
      lines: benefits.slice(0, 12),
    });
  }
  if (detailLines.length > 0) {
    accordionItems.push({
      id: "details",
      title: t("productPage.pdpDesktop.detailsAccordionTitle"),
      lines: detailLines,
    });
  }

  return (
    <main className={`overflow-x-hidden bg-[#0B0F14] text-[#E8ECF1] ${GI_HERO_TOP_PAD}`}>
      <div className="mx-auto max-w-7xl px-6 pb-28 pt-6 sm:px-10 md:pb-32 lg:px-16">
        <Link
          href={goodIdeasProductsPath(locale)}
          className="mb-8 inline-flex font-inter text-[11px] font-semibold uppercase tracking-[0.14em] text-[rgba(232,236,241,0.55)] transition hover:text-[#3B82F6]"
        >
          ← {t("goodIdeas.product.backToProducts")}
        </Link>

        <ProductDetailClient
          product={localizedProduct}
          seoH1={localizedProduct.title}
          productImages={productImages}
          productVariants={null}
          ctaLabel={t("common.addToCart")}
          noImageLabel={t("common.noImage")}
          freeShippingLabel={t("productPage.freeShipping")}
          pdpDesktop={pdpDesktop}
          surface="dark"
          taxNote={t("productPage.pdpDesktop.taxNote")}
          selectSizeLabel={t("productPage.pdpDesktop.selectSize")}
          sizeGuideLabel={t("productPage.pdpDesktop.sizeGuide")}
          mobileStickyTrustLines={[
            t("productPage.pdpDesktop.mobileStickyLine1"),
            t("productPage.pdpDesktop.mobileStickyLine2"),
            t("productPage.pdpDesktop.mobileStickyLine3"),
          ]}
          cartBrand="good-ideas"
          cartPath={goodIdeasCartPath(locale)}
        />
      </div>

      {pdpDesktop.benefits.length > 0 ? (
        <PdpBenefitsSection
          title={t("productPage.pdpDesktop.benefitsSectionHeading")}
          bullets={pdpDesktop.benefits}
          surface="dark"
        />
      ) : null}

      {accordionItems.length > 0 ? (
        <PdpSpecsAccordion items={accordionItems} surface="dark" />
      ) : null}
    </main>
  );
}
