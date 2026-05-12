import Image from "next/image";
import { getProducts, getProductById } from "@/lib/products";
import { getProductImages } from "@/lib/product-images";
import { getProductVariants } from "@/lib/product-variants";
import type { Product } from "@/lib/products";
import { getMessages } from "@/lib/i18n/messages";
import { createTranslator } from "@/lib/i18n/translate";
import { locales, type Locale } from "@/lib/i18n/config";
import { buildMetadata, formatTemplate } from "@/lib/seo";
import ProductDetailClient from "@/components/ProductDetailClient";
import ProductReviews from "@/components/ProductReviews";
import PdpBenefitsSection from "@/components/pdp/PdpBenefitsSection";
import PdpImageStorySection from "@/components/pdp/PdpImageStorySection";
import PdpSpecsAccordion from "@/components/pdp/PdpSpecsAccordion";
import PdpRelatedProductsRail from "@/components/pdp/PdpRelatedProductsRail";
import PdpMiniBrandBlock from "@/components/pdp/PdpMiniBrandBlock";
import { REVIEWS_SEED, getReviewsByProductSlug } from "@/lib/reviews-data";
import { PRODUCT_BLUR_DATA_URL } from "@/lib/product-image-helper";

type Props = {
  params: Promise<{
    locale: Locale;
    id: string;
  }>;
};


// Helper para generar copy basado en el producto
function getProductCopy(product: {
  title: string;
  category: string;
  description: string;
  features?: string[];
}) {
  const titleLower = product.title.toLowerCase();
  const categoryLower = product.category.toLowerCase();

  // Determinar uso y beneficios según el producto
  let useCase = "";
  let whyBetter = "";
  let idealFor: string[] = [];
  let benefits: string[] = [];

  if (titleLower.includes("gafas") || titleLower.includes("lentes")) {
    useCase =
      "Protegen tus ojos de rayos UV y cambios de luz durante actividades al aire libre. Las lentes fotocromáticas se adaptan automáticamente a la intensidad de la luz, sin necesidad de cambiar de gafas.";
    whyBetter =
      "A diferencia de gafas genéricas, estas se adaptan a las condiciones de luz cambiantes. No necesitás llevar múltiples pares ni cambiarlos constantemente durante tu actividad.";
    idealFor = ["Ciclismo", "Running", "Trekking", "Uso diario outdoor"];
    benefits = [
      "Protección UV400 completa contra rayos solares dañinos",
      "Adaptación automática a cambios de luz (fotocromáticas)",
      "Montura ligera que no pesa durante actividades prolongadas",
      "Almohadillas antideslizantes para mantenerlas en su lugar",
      "Resistente a impactos y caídas accidentales",
    ];
  } else if (titleLower.includes("mochila") || titleLower.includes("backpack")) {
    useCase =
      "Diseñada para cargar tu equipamiento de forma segura y cómoda durante trekking, camping y aventuras de varios días. El material impermeable protege tu contenido incluso en condiciones adversas.";
    whyBetter =
      "A diferencia de mochilas genéricas, esta combina capacidad (45L) con resistencia real al agua. El sistema MOLLE permite personalizar y expandir según tus necesidades específicas.";
    idealFor = ["Trekking", "Camping", "Aventuras de varios días", "Outdoor profesional"];
    benefits = [
      "Capacidad de 45L suficiente para escapadas de 2-4 días",
      "Material impermeable que protege en lluvia y humedad",
      "Sistema MOLLE para agregar bolsillos y accesorios",
      "Resistente a desgarros y uso intenso",
      "Distribución de peso equilibrada para comodidad",
    ];
  } else if (titleLower.includes("smartwatch") || titleLower.includes("watch")) {
    useCase =
      "Rastrea tu actividad física, rutas y métricas de rendimiento durante entrenamientos y aventuras. El GPS integrado te permite navegar y registrar tus recorridos sin depender del celular.";
    whyBetter =
      "A diferencia de smartwatches genéricos, este está pensado para uso outdoor real. La batería de 7 días aguanta escapadas largas sin necesidad de cargar constantemente.";
    idealFor = ["Running", "Ciclismo", "Trekking", "Entrenamientos diarios"];
    benefits = [
      "GPS preciso para rastrear rutas y navegación",
      "Monitor cardíaco continuo durante actividades",
      "Batería de 7 días para escapadas sin preocupaciones",
      "Múltiples modos deportivos para diferentes actividades",
      "Resistente al agua para uso en condiciones adversas",
    ];
  } else {
    // Fallback genérico
    useCase = product.description;
    whyBetter =
      "Diseñado para uso real en condiciones outdoor. Probado en situaciones reales, no solo en laboratorio.";
    idealFor = ["Actividades outdoor", "Uso diario", "Aventuras"];
    benefits = product.features || [];
  }

  return { useCase, whyBetter, idealFor, benefits };
}

export async function generateStaticParams() {
  const products = getProducts();
  return locales.flatMap((locale) =>
    products.map((product) => ({
      locale,
      id: product.id,
    }))
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, id } = await params;
  const product = getProductById(id);

  if (!product) {
    return {
      title: "Producto no encontrado | Go Natural",
    };
  }

  const messages = await getMessages(locale);
  const seo = messages.seo?.product;
  const localized = product.translations?.[locale];
  const localizedTitle = localized?.title || product.title;
  const title =
    localized?.seo?.title ||
    formatTemplate(seo?.titleTemplate || "{title} | Go Natural", {
      title: localizedTitle,
    });
  const description =
    localized?.seo?.description ||
    formatTemplate(
      seo?.descriptionTemplate ||
        "Detalles y especificaciones de {title}, pensado para uso outdoor real.",
      { title: localizedTitle }
    );
  const ogTitle = localized?.seo?.ogTitle || title;
  const ogDescription = localized?.seo?.ogDescription || description;
  const images = await getProductImages(product.id);
  const ogImage =
    images.featured?.[0] || images.gallery?.[0] || "/assets/images/blog/blog-hero.webp";
  const pathByLocale = locales.reduce(
    (acc, localeKey) => ({
      ...acc,
      [localeKey]: `/${localeKey}/products/${product.id}`,
    }),
    {} as Record<Locale, string>
  );

  return {
    ...buildMetadata({
      locale,
      title,
      description,
      pathByLocale,
      ogImage,
      ogTitle,
      ogDescription,
      ogType: "website",
    }),
  };
}

export default async function ProductPage({ params }: Props) {
  const { locale, id } = await params;
  const product = getProductById(id);

  if (!product) {
    return (
      <main className="mx-auto max-w-6xl bg-[#FFFFFF] px-4 py-20 text-neutral-900">
        <h1 className="font-sans text-2xl font-semibold">Producto no encontrado</h1>
      </main>
    );
  }

  const localized = product.translations?.[locale];
  const localizedProduct: Product = {
    ...product,
    title: localized?.title ?? product.title,
    description: localized?.description ?? product.description,
    shortDescription: localized?.shortDescription ?? product.shortDescription,
    longDescription: localized?.longDescription ?? product.longDescription,
    features: localized?.features ?? product.features,
  };

  const { useCase, whyBetter, benefits, idealFor } =
    getProductCopy(localizedProduct);
  const messages = await getMessages(locale);
  const t = createTranslator(messages);
  const productImages = await getProductImages(product.id);
  const variantsFromJson = await getProductVariants(product.id);
  const productVariants =
    variantsFromJson ||
    (product.variants
      ? {
          variants: Array.isArray(product.variants)
            ? product.variants
            : [product.variants],
          variantMatrix: undefined,
        }
      : null);
  const productSlug = product.slug ?? product.id;
  const reviews = getReviewsByProductSlug(productSlug);
  const reviewsAverage =
    reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;
  const reviewsSchema =
    reviews.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: localizedProduct.title,
          image: productImages.featured || product.images[0] || "",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: reviewsAverage.toFixed(1),
            reviewCount: reviews.length,
          },
          review: reviews.map((review) => ({
            "@type": "Review",
            reviewRating: {
              "@type": "Rating",
              ratingValue: review.rating,
            },
            author: {
              "@type": "Person",
              name: review.author,
            },
            datePublished: review.date,
            reviewBody: review.comment,
            name: review.title,
          })),
        }
      : null;

  // H1 optimizado para SEO
  const baseSeoTitle = localizedProduct.title;
  const seoH1 =
    locale === "es" && !baseSeoTitle.includes("para")
      ? `${baseSeoTitle} para Outdoor y Aventuras`
      : baseSeoTitle;

  const relatedProducts = getProducts()
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 8);
  const specSource =
    localizedProduct.features && localizedProduct.features.length > 0
      ? localizedProduct.features
      : benefits;
  const pdpDesktop = {
    benefitsTitle: t("productPage.pdpDesktop.benefitsTitle"),
    specsToggle: t("productPage.pdpDesktop.specsToggle"),
    idealForLabel: t("productPage.pdpDesktop.idealForLabel"),
    trustMicrocopy: t("productPage.pdpDesktop.trustMicrocopy"),
    shippingHeading: t("productPage.pdpDesktop.shippingHeading"),
    shippingEurope:
      product.id === "gn-cycling-training-001"
        ? t("productPage.pdpDesktop.shippingEuropeTraining001")
        : product.pdpTrust?.shippingEurope ??
          t("productPage.pdpDesktop.shippingEurope"),
    shippingLatam:
      product.pdpTrust?.shippingLatam ??
      t("productPage.pdpDesktop.shippingLatam"),
    secureAndWarranty: t("productPage.pdpDesktop.secureAndWarranty"),
    returns:
      product.pdpTrust?.returns ?? t("productPage.pdpDesktop.returns"),
    benefits: benefits.slice(0, 4),
    specBullets: specSource.slice(0, 8),
    idealForLine: idealFor.join(" · "),
  };

  const detailLines = [
    useCase,
    whyBetter,
    `${t("productPage.pdpDesktop.idealForLabel")} ${idealFor.join(" · ")}`,
    ...(localizedProduct.longDescription ?? []),
  ].filter((line) => line && line.trim().length > 0);

  const accordionItems: { id: string; title: string; lines: string[] }[] = [];
  if (specSource.length > 0) {
    accordionItems.push({
      id: "specs",
      title: t("productPage.pdpDesktop.specsAccordionTitle"),
      lines: specSource.slice(0, 12),
    });
  }
  if (detailLines.length > 0) {
    accordionItems.push({
      id: "details",
      title: t("productPage.pdpDesktop.detailsAccordionTitle"),
      lines: detailLines,
    });
  }

  const reviewsLinkLabel =
    reviews.length > 0
      ? `${reviews.length} ${
          reviews.length === 1
            ? t("productPage.pdpDesktop.reviewSingular")
            : t("productPage.reviewsCountLabel")
        }`
      : undefined;

  const isCyclingTraining001 = product.id === "gn-cycling-training-001";

  return (
    <main className="overflow-x-hidden bg-[#FFFFFF] text-neutral-900">
      <div
        className={
          isCyclingTraining001
            ? "mx-auto max-w-7xl px-6 pb-3 pt-24 sm:px-10 md:pt-20 lg:px-16 lg:pb-2"
            : "mx-auto max-w-7xl px-6 pb-24 pt-24 sm:px-10 md:py-20 md:pb-28 lg:px-16"
        }
      >
        <ProductDetailClient
          product={localizedProduct}
          seoH1={seoH1}
          productImages={productImages}
          productVariants={productVariants}
          ctaLabel={t("productPage.addToCart")}
          noImageLabel={t("common.noImage")}
          freeShippingLabel={t("productPage.freeShipping")}
          pdpDesktop={pdpDesktop}
          surface="light"
          reviewsAverage={reviewsAverage}
          reviewsCount={reviews.length}
          reviewsLinkLabel={reviewsLinkLabel}
          taxNote={t("productPage.pdpDesktop.taxNote")}
          selectSizeLabel={t("productPage.pdpDesktop.selectSize")}
          sizeGuideLabel={t("productPage.pdpDesktop.sizeGuide")}
          sizeGuideHref={`/${locale}/contact`}
          mobileStickyTrustLines={[
            t("productPage.pdpDesktop.mobileStickyLine1"),
            t("productPage.pdpDesktop.mobileStickyLine2"),
            t("productPage.pdpDesktop.mobileStickyLine3"),
          ]}
        />
      </div>

      {isCyclingTraining001 && (
        <div className="mx-auto max-w-7xl px-6 pb-10 pt-1 sm:px-10 lg:px-16 lg:pb-12 lg:pt-0">
          <div className="grid lg:grid-cols-[5fr_2.5fr] lg:items-start lg:gap-x-12 xl:gap-x-16 2xl:gap-x-20">
            <div className="min-w-0">
              <div className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-neutral-50/80 shadow-sm ring-1 ring-neutral-200/60">
                <div className="relative aspect-video w-full bg-neutral-100">
                  <video
                    className="absolute inset-0 h-full w-full object-contain"
                    controls
                    playsInline
                    preload="metadata"
                    aria-label={`Video — ${localizedProduct.title}`}
                  >
                    <source
                      src="/assets/images/products/gn-cycling-training-001/smart-bike-video.mp4"
                      type="video/mp4"
                    />
                  </video>
                </div>
              </div>
            </div>
            <div className="hidden min-w-0 lg:block" aria-hidden="true" />
          </div>
        </div>
      )}

      <ProductReviews
        productSlug={productSlug}
        reviews={REVIEWS_SEED}
        surface="light"
      />
      {reviewsSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
        />
      )}

      {pdpDesktop.benefits.length > 0 ? (
        <PdpBenefitsSection
          title={t("productPage.pdpDesktop.benefitsSectionHeading")}
          bullets={pdpDesktop.benefits}
          surface="light"
        />
      ) : null}

      {productImages.lifestyle.length > 0 ? (
        <PdpImageStorySection
          imageSrc={productImages.lifestyle[0]}
          imageAlt={`${localizedProduct.title} — lifestyle`}
          overlayText={t("homePage.imageStoryTitle")}
          surface="light"
        />
      ) : null}

      {accordionItems.length > 0 ? (
        <PdpSpecsAccordion items={accordionItems} surface="light" />
      ) : null}

      {productImages.extras.length > 0 ? (
        <section className="border-t border-neutral-200/90 py-14 md:py-16">
          <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {productImages.extras.map((img, index) => (
                <div
                  key={img}
                  className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-neutral-50/50 ring-1 ring-neutral-200/50"
                >
                  <Image
                    src={img}
                    alt={`${localizedProduct.title} detalle ${index + 1}`}
                    width={1200}
                    height={900}
                    placeholder="blur"
                    blurDataURL={PRODUCT_BLUR_DATA_URL}
                    className="h-full w-full object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {relatedProducts.length > 0 ? (
        <PdpRelatedProductsRail
          title={t("productPage.crossSellTitle")}
          products={relatedProducts}
          locale={locale}
          labels={{
            viewProduct: t("common.viewProduct"),
            addToCart: t("common.addToCart"),
            noImage: t("common.noImage"),
          }}
          surface="light"
        />
      ) : null}

      <PdpMiniBrandBlock
        message={t("homePage.brandStatement")}
        surface="light"
      />
    </main>
  );
}
