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
import { buildPathByLocale, productPath, productsPath } from "@/lib/routing/paths";
import { getGoodIdeasBrandName } from "@/lib/good-ideas-brand";
import { buildGoodIdeasPdpAccordionBundle } from "@/lib/good-ideas-pdp-content";
import { resolveGoodIdeasProductBrandLink } from "@/lib/good-ideas-plp-brands";
import { GI_PDP_INNER } from "@/lib/ui/gi-pdp-layout";
import { GI_PDP_TOP_PAD } from "@/lib/ui/goodideas-design";
import { parseFeatureSpecRows } from "@/lib/pdp-spec-rows";
import GiHeroGridOverlay from "@/components/good-ideas/GiHeroGridOverlay";
import ProductDetailClient from "@/components/ProductDetailClient";
import PdpPhase4Shell from "@/components/pdp/PdpPhase4Shell";
import VideoShowcaseSection from "@/components/pdp/VideoShowcaseSection";
import ReviewsSection from "@/components/pdp/ReviewsSection";
import CrossSellCarousel from "@/components/pdp/CrossSellCarousel";
import PdpGoodIdeasProductManual from "@/components/good-ideas/PdpGoodIdeasProductManual";
import { getGoodIdeasProductManual } from "@/lib/good-ideas-product-manual";

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
    <main className={`relative overflow-x-hidden bg-[#0B0F14] text-[#E8ECF1] ${GI_PDP_TOP_PAD}`}>
      <GiHeroGridOverlay />
      <PdpPhase4Shell
        product={{ ...localizedProduct, freeShipping: true }}
        productImages={productImages}
        productVariants={productVariants}
        seoH1={localizedProduct.title}
        selectSizeLabel={t("productPage.pdpDesktop.selectSize")}
        sizeGuideLabel={t("productPage.pdpDesktop.sizeGuide")}
      >
      <div className="relative z-[1]">
        <div className={`${GI_PDP_INNER} pb-16 pt-0 md:pb-32 lg:pb-28`}>
          <ProductDetailClient
            product={{ ...localizedProduct, freeShipping: true }}
            seoH1={localizedProduct.title}
            productImages={productImages}
            productVariants={productVariants}
            ctaLabel={t("common.addToCart")}
            noImageLabel={t("common.noImage")}
            freeShippingLabel={t("productPage.freeShipping")}
            pdpDesktop={pdpDesktop}
            surface="dark"
            taxNote={t("productPage.pdpDesktop.taxNote")}
            selectSizeLabel={t("productPage.pdpDesktop.selectSize")}
            sizeGuideLabel={t("productPage.pdpDesktop.sizeGuide")}
            quantityLabel={t("productPage.pdpDesktop.quantityLabel")}
            mobileStickyTrustLines={[
              t("productPage.pdpDesktop.mobileStickyLine1"),
              t("productPage.pdpDesktop.mobileStickyLine2"),
              t("productPage.pdpDesktop.mobileStickyLine3"),
            ]}
            salesBadge={localizedProduct.salesBadge}
            cartBrand="good-ideas"
            brandLabel={brandLink?.label}
            brandHref={brandLink?.href}
            breadcrumbItems={[
              { label: t("goodIdeas.nav.products"), href: productsPath(locale) },
              { label: localizedProduct.title },
            ]}
            accordionBundle={accordionBundle}
            suppressMobileSticky
          />
        </div>

        <div id="pdp-videos">
          <VideoShowcaseSection productId={product.id} />
        </div>
        <ReviewsSection productId={product.id} />
        <div id="pdp-cross-sell">
          <CrossSellCarousel productId={product.id} cardImagesById={cardImagesById} />
        </div>

        {productManual ? (
          <PdpGoodIdeasProductManual
            manual={productManual}
            title={t("goodIdeas.product.manualTitle")}
            description={t("goodIdeas.product.manualDescription")}
            downloadLabel={t("goodIdeas.product.manualDownload")}
            openLabel={t("goodIdeas.product.manualOpen")}
            surface="dark"
          />
        ) : null}
      </div>
      </PdpPhase4Shell>
    </main>
  );
}
