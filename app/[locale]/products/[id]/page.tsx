import { notFound } from "next/navigation";
import {
  getGoodIdeasProductById,
  getGoodIdeasProducts,
  localizeGoodIdeasProduct,
  getGoodIdeasProductCopy,
  resolveGoodIdeasProductVariants,
} from "@/lib/good-ideas-products";
import { getGoodIdeasProductImages, getAllGoodIdeasProductCardImages } from "@/lib/good-ideas-product-images";
import { getMessages } from "@/lib/i18n/messages";
import { createTranslator } from "@/lib/i18n/translate";
import { locales, type Locale } from "@/lib/i18n/config";
import { buildMetadata, formatTemplate } from "@/lib/seo";
import { buildPathByLocale, productPath } from "@/lib/routing/paths";
import { getGoodIdeasBrandName } from "@/lib/good-ideas-brand";
import { buildGoodIdeasPdpAccordionBundle } from "@/lib/good-ideas-pdp-content";
import { resolveGoodIdeasProductBrandLink } from "@/lib/good-ideas-plp-brands";
import PdpDtcPostSections from "@/components/good-ideas/PdpDtcPostSections";
import { GI_DTC } from "@/lib/ui/gi-pdp-dtc";
import { GI_PDP_DTC_TOP_PAD } from "@/lib/ui/goodideas-design";
import ProductDetailClient from "@/components/ProductDetailClient";
import PdpPhase4Shell from "@/components/pdp/PdpPhase4Shell";
import VideoShowcaseSection from "@/components/pdp/VideoShowcaseSection";
import ReviewsSection from "@/components/pdp/ReviewsSection";
import CrossSellCarousel from "@/components/pdp/CrossSellCarousel";
import PdpGoodIdeasProductManual from "@/components/good-ideas/PdpGoodIdeasProductManual";
import { getGoodIdeasProductManual } from "@/lib/good-ideas-product-manual";
import { parseFeatureSpecRows } from "@/lib/pdp-spec-rows";

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

  const brandName = getGoodIdeasBrandName(locale);

  if (!product) {
    return { title: `Producto no encontrado | ${brandName}` };
  }

  const localized = localizeGoodIdeasProduct(product, locale);
  const messages = await getMessages(locale);
  const seo = messages.seo?.goodIdeas?.product;

  return buildMetadata({
    locale,
    title:
      formatTemplate(seo?.titleTemplate ?? `{title} | ${brandName}`, {
        title: localized.title,
      }) ?? `${localized.title} | ${brandName}`,
    description:
      localized.shortDescription ??
      localized.description ??
      createTranslator(messages)("seo.goodIdeas.description"),
    pathByLocale: buildPathByLocale((l) => productPath(l, id)),
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
  const productImages = await getGoodIdeasProductImages(product.id);
  const cardImagesById = getAllGoodIdeasProductCardImages();
  const productVariants = resolveGoodIdeasProductVariants(localizedProduct);
  const productManual = getGoodIdeasProductManual(product.id);
  const brandLink = resolveGoodIdeasProductBrandLink(product, locale);

  const featureBullets = benefits.slice(0, 4);
  const specRows =
    benefits.length > 4 ? parseFeatureSpecRows(benefits.slice(4)) : [];

  const accordionBundle = buildGoodIdeasPdpAccordionBundle({
    messages,
    locale,
    useCase,
    whyBetter,
    longDescription: localizedProduct.longDescription,
    benefits: featureBullets,
    specRows,
    idealFor,
  });

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
    specBullets: benefits.slice(4, 12),
    idealForLine: idealFor.join(" · "),
  };

  return (
    <main className={`relative overflow-x-hidden bg-white text-[#111111] ${GI_PDP_DTC_TOP_PAD}`}>
      <PdpPhase4Shell
        product={{ ...localizedProduct, freeShipping: true }}
        productImages={productImages}
        productVariants={productVariants}
        seoH1={localizedProduct.title}
        selectSizeLabel={t("productPage.pdpDesktop.selectSize")}
        sizeGuideLabel={t("productPage.pdpDesktop.sizeGuide")}
      >
      <div className="relative z-[1]">
        <div className={`${GI_DTC.container} pb-10 pt-6 md:pb-16 md:pt-10`}>
          <ProductDetailClient
            product={{ ...localizedProduct, freeShipping: true }}
            seoH1={localizedProduct.title}
            productImages={productImages}
            productVariants={productVariants}
            ctaLabel={t("common.addToCart")}
            noImageLabel={t("common.noImage")}
            freeShippingLabel={t("productPage.freeShipping")}
            pdpDesktop={pdpDesktop}
            surface="light"
            taxNote={t("productPage.pdpDesktop.taxNote")}
            selectSizeLabel={t("productPage.pdpDesktop.selectSize")}
            sizeGuideLabel={t("productPage.pdpDesktop.sizeGuide")}
            quantityLabel={t("productPage.pdpDesktop.quantityLabel")}
            mobileStickyTrustLines={[
              t("goodIdeas.pdp.dtc.trustSecure"),
              t("goodIdeas.pdp.dtc.trustGuarantee"),
              t("goodIdeas.pdp.dtc.trustShipping"),
            ]}
            salesBadge={localizedProduct.salesBadge}
            cartBrand="good-ideas"
            brandLabel={brandLink?.label}
            brandHref={brandLink?.href}
            accordionBundle={accordionBundle}
            suppressMobileSticky
          />
        </div>

        <PdpDtcPostSections
          productId={product.id}
          accordionBundle={accordionBundle}
          specRows={specRows}
        />

        <div id="pdp-videos" className="border-t border-[#E5E7EB] bg-white">
          <VideoShowcaseSection productId={product.id} />
        </div>
        <div id="pdp-reviews" className="border-t border-[#E5E7EB] bg-[#FAFAFA]">
          <ReviewsSection productId={product.id} surface="light" />
        </div>
        <div id="pdp-cross-sell" className="border-t border-[#E5E7EB] bg-white">
          <CrossSellCarousel productId={product.id} cardImagesById={cardImagesById} />
        </div>

        {productManual ? (
          <PdpGoodIdeasProductManual
            manual={productManual}
            title={t("goodIdeas.product.manualTitle")}
            description={t("goodIdeas.product.manualDescription")}
            downloadLabel={t("goodIdeas.product.manualDownload")}
            openLabel={t("goodIdeas.product.manualOpen")}
            surface="light"
          />
        ) : null}
      </div>
      </PdpPhase4Shell>
    </main>
  );
}
