"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AddedToCartModal, {
  type AddedToCartLineSnapshot,
} from "@/components/AddedToCartModal";
import AddToCartButton, {
  type AddToCartLinePayload,
} from "@/components/AddToCartButton";
import GoodIdeasAddToCartButton from "@/components/good-ideas/GoodIdeasAddToCartButton";
import ProductGallery from "@/components/pdp/ProductGallery";
import ProductInfoPanel from "@/components/pdp/ProductInfoPanel";
import VariantSelector from "@/components/VariantSelector";
import { splitVariantDefinitions } from "@/lib/pdp-variant-utils";
import type {
  ProductImages,
  VariantImagesMap,
  VariantImagesValueMap,
  VariantImageSet,
} from "@/lib/product-images";
import type {
  ProductVariants,
  VariantDefinition,
} from "@/lib/product-variants";
import { trackViewItem } from "@/lib/analytics/ga4";
import { PDP_HERO_WIDE_PRODUCT_IDS } from "@/lib/pdp-star-products";
import type { UISurface } from "@/lib/ui-surface";

type ProductSummary = {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  shortDescription?: string;
  images: string[];
  freeShipping?: boolean;
};

export type PdpDesktopContent = {
  benefitsTitle: string;
  specsToggle: string;
  idealForLabel: string;
  trustMicrocopy: string;
  shippingHeading: string;
  shippingEurope: string;
  shippingLatam: string;
  secureAndWarranty: string;
  returns: string;
  benefits: string[];
  specBullets: string[];
  idealForLine: string;
};

type Props = {
  product: ProductSummary;
  seoH1: string;
  productImages: ProductImages;
  productVariants: ProductVariants | null;
  ctaLabel: string;
  noImageLabel: string;
  freeShippingLabel?: string;
  pdpDesktop: PdpDesktopContent;
  surface?: UISurface;
  reviewsAverage?: number;
  reviewsCount?: number;
  reviewsLinkLabel?: string;
  taxNote?: string | null;
  selectSizeLabel: string;
  sizeGuideLabel: string;
  sizeGuideHref?: string;
  /** Textos bajo CTA móvil (confianza) */
  mobileStickyTrustLines: [string, string, string];
  cartBrand?: "go-natural" | "good-ideas";
  cartPath?: string;
};

function getDefaultSelections(variants: VariantDefinition[]) {
  const selections: Record<string, string> = {};

  variants.forEach((variant) => {
    const options = variant.options || [];
    if (options.length === 0) return;

    if (variant.default) {
      const match = options.find(
        (opt) => opt.value === variant.default || opt.label === variant.default
      );
      if (match) {
        selections[variant.type] = match.value || match.label;
        return;
      }
    }

    selections[variant.type] = options[0].value || options[0].label;
  });

  return selections;
}

export default function ProductDetailClient({
  product,
  seoH1,
  productImages,
  productVariants,
  ctaLabel,
  noImageLabel,
  freeShippingLabel,
  pdpDesktop,
  surface = "dark",
  reviewsAverage = 0,
  reviewsCount = 0,
  reviewsLinkLabel,
  taxNote,
  selectSizeLabel,
  sizeGuideLabel,
  sizeGuideHref,
  mobileStickyTrustLines,
  cartBrand = "go-natural",
  cartPath,
}: Props) {
  const L = surface === "light";
  /** Gafas / horizontales: ver `lib/pdp-star-products.ts`. Pantalón ski: solo móvil legacy. */
  const useWideHeroGallery = PDP_HERO_WIDE_PRODUCT_IDS.has(product.id);
  /** Evita que la columna de galería estire la fila y deje hueco enorme sobre el vídeo (solo este PDP). */
  const tightGalleryToVideo = product.id === "gn-cycling-training-001";
  const baseFeatured =
    productImages.featured || product.images[0] || "";
  const baseGallery =
    productImages.gallery.length > 0
      ? productImages.gallery
      : product.images.slice(1);

  const initialSelections = useMemo(() => {
    if (!productVariants) return {};
    return getDefaultSelections(productVariants.variants);
  }, [productVariants]);

  const [selections, setSelections] = useState<Record<string, string>>(
    initialSelections
  );

  const [addedToCart, setAddedToCart] = useState<AddedToCartLineSnapshot | null>(
    null
  );

  const handleAfterAddToCart = useCallback((item: AddToCartLinePayload) => {
    setAddedToCart({
      title: item.title,
      price: item.price,
      image: item.image,
      variantSelections: item.variantSelections,
    });
  }, []);

  useEffect(() => {
    setSelections(initialSelections);
  }, [initialSelections]);

  useEffect(() => {
    trackViewItem({
      item_id: product.id,
      item_name: seoH1,
      price: product.price,
      item_category: product.category,
      quantity: 1,
    });
  }, [product.id, product.category, product.price, seoH1]);

  const activeImages = useMemo(() => {
    const defaultImages = {
      featured: baseFeatured,
      gallery: baseGallery,
    };

    if (!productImages.variantImages || Object.keys(selections).length === 0) {
      return defaultImages;
    }

    let variant: VariantImageSet | string[] | undefined;

    if (productVariants) {
      for (const variantDef of productVariants.variants) {
        const selectedValue = selections[variantDef.type];
        if (!selectedValue) continue;

        const typedMap = (productImages.variantImages as VariantImagesMap)[
          variantDef.type
        ];
        if (typedMap && typedMap[selectedValue]) {
          variant = typedMap[selectedValue];
          break;
        }
      }
    }

    if (!variant) {
      const flatMap = productImages.variantImages as VariantImagesValueMap;
      const selectedValues = Object.values(selections);
      for (const value of selectedValues) {
        if (flatMap[value]) {
          variant = flatMap[value];
          break;
        }
      }
    }

    if (!variant) {
      return defaultImages;
    }

    if (Array.isArray(variant)) {
      return {
        featured: variant[0] ?? defaultImages.featured,
        gallery: variant.length ? variant : defaultImages.gallery,
      };
    }

    const featArr = variant.featured;
    const galArr = variant.gallery;
    const featuredUrls = Array.isArray(featArr)
      ? featArr.filter((u): u is string => Boolean(u))
      : [];
    const galleryUrls = Array.isArray(galArr)
      ? galArr.filter((u): u is string => Boolean(u))
      : [];

    const fallbackThumbs =
      featuredUrls.length > 0 ? featuredUrls : defaultImages.gallery;

    return {
      featured: featuredUrls[0] ?? defaultImages.featured,
      gallery: galleryUrls.length > 0 ? galleryUrls : fallbackThumbs,
    };
  }, [
    baseFeatured,
    baseGallery,
    productImages,
    productVariants,
    selections,
  ]);

  const resolvedPrice = useMemo(() => {
    if (!productVariants) return product.price;
    let price = product.price;

    productVariants.variants.forEach((variant) => {
      const selectedValue = selections[variant.type];
      if (!selectedValue) return;
      const option = variant.options.find(
        (opt) => (opt.value || opt.label) === selectedValue
      );
      if (option && typeof option.priceModifier === "number") {
        price += option.priceModifier;
      }
    });

    return price;
  }, [product.price, productVariants, selections]);

  const variantSelections = useMemo(() => {
    if (!productVariants) return undefined;
    const selectionsList = productVariants.variants
      .map((variant) => {
        const selection = selections[variant.type];
        if (!selection) return null;
        const option = variant.options.find(
          (opt) => (opt.value || opt.label) === selection
        );
        const value = option?.value || selection;
        const label = option?.label || selection;
        return {
          type: variant.type,
          typeLabel: variant.label,
          value,
          label,
        };
      })
      .filter(
        (entry): entry is NonNullable<typeof entry> => Boolean(entry)
      );
    return selectionsList.length ? selectionsList : undefined;
  }, [productVariants, selections]);

  const cartImage = activeImages.featured || product.images[0];

  const desktopDescription =
    product.shortDescription?.trim() || product.description;

  /** Solo fotos de producto en la galería principal; lifestyle / extras van abajo en la página. */
  const pdpGalleryImages = useMemo(() => {
    const list: string[] = [];
    const push = (url: string) => {
      if (url && !list.includes(url)) list.push(url);
    };
    if (activeImages.featured) push(activeImages.featured);
    const gal = Array.isArray(activeImages.gallery) ? activeImages.gallery : [];
    gal.forEach(push);
    return list;
  }, [activeImages]);

  const { color: colorDef, size: sizeDef, other: otherVariantDefs } =
    useMemo(
      () => splitVariantDefinitions(productVariants?.variants ?? []),
      [productVariants]
    );

  const galleryAspect = useWideHeroGallery ? "cinematic" : "square";

  return (
    <>
      {/* Mobile: galería + mismo panel editorial que desktop */}
      <section className="mx-auto grid max-w-full gap-8 pb-24 pt-0 lg:hidden md:gap-10">
        <ProductGallery
          images={pdpGalleryImages}
          title={product.title}
          noImageLabel={noImageLabel}
          surface={surface}
          aspectMode={galleryAspect}
        />
        <ProductInfoPanel
          productId={product.id}
          surface={surface}
          seoH1={seoH1}
          description={desktopDescription}
          resolvedPrice={resolvedPrice}
          freeShipping={product.freeShipping}
          freeShippingLabel={freeShippingLabel}
          taxNote={taxNote}
          reviewsAverage={reviewsAverage}
          reviewsCount={reviewsCount}
          reviewsLinkLabel={reviewsLinkLabel}
          productVariants={productVariants}
          colorDef={colorDef}
          sizeDef={sizeDef}
          otherVariantDefs={otherVariantDefs}
          selections={selections}
          onSelectionsChange={setSelections}
          sizeGuideHref={sizeGuideHref}
          sizeGuideLabel={sizeGuideLabel}
          selectSizeLabel={selectSizeLabel}
          ctaLabel={ctaLabel}
          trustMicrocopy={pdpDesktop.trustMicrocopy}
          pdpDesktop={pdpDesktop}
          cartPayload={{
            id: product.id,
            title: product.title,
            price: resolvedPrice,
            image: cartImage,
            variantSelections,
          }}
          onAfterAdd={handleAfterAddToCart}
          cartBrand={cartBrand}
        />
      </section>

      {/* Desktop: galería estirada en columna 1 + menos hueco horizontal entre columnas */}
      <section
        className={[
          "hidden max-w-full items-start gap-y-10 lg:grid lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-x-7 lg:gap-y-10 xl:grid-cols-[minmax(0,1.38fr)_minmax(0,0.62fr)] xl:gap-x-9 2xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)] 2xl:gap-x-10",
          tightGalleryToVideo ? "lg:content-start" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div
          className={[
            "min-w-0 w-full justify-self-stretch lg:w-full",
            tightGalleryToVideo ? "lg:self-start" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <ProductGallery
            images={pdpGalleryImages}
            title={product.title}
            noImageLabel={noImageLabel}
            surface={surface}
            aspectMode={galleryAspect}
          />
        </div>
        <div className="min-w-0">
          <ProductInfoPanel
            productId={product.id}
            surface={surface}
            seoH1={seoH1}
            description={desktopDescription}
            resolvedPrice={resolvedPrice}
            freeShipping={product.freeShipping}
            freeShippingLabel={freeShippingLabel}
            taxNote={taxNote}
            reviewsAverage={reviewsAverage}
            reviewsCount={reviewsCount}
            reviewsLinkLabel={reviewsLinkLabel}
            productVariants={productVariants}
            colorDef={colorDef}
            sizeDef={sizeDef}
            otherVariantDefs={otherVariantDefs}
            selections={selections}
            onSelectionsChange={setSelections}
            sizeGuideHref={sizeGuideHref}
            sizeGuideLabel={sizeGuideLabel}
            selectSizeLabel={selectSizeLabel}
            ctaLabel={ctaLabel}
            trustMicrocopy={pdpDesktop.trustMicrocopy}
            pdpDesktop={pdpDesktop}
            cartPayload={{
              id: product.id,
              title: product.title,
              price: resolvedPrice,
              image: cartImage,
              variantSelections,
            }}
            onAfterAdd={handleAfterAddToCart}
            cartBrand={cartBrand}
          />
        </div>
      </section>

      {/* Mobile: Sticky CTA con microcopy */}
      <div
        className={
          L
            ? "fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-neutral-200 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] pt-3 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
            : "fixed bottom-0 left-0 right-0 z-50 bg-dark-base/98 backdrop-blur-md border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.4)] pt-3 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
        }
      >
        <div className="mx-auto max-w-full">
          <div className="mb-2 text-center">
            <p
              className={
                L
                  ? "text-2xl font-bold text-neutral-900"
                  : "text-2xl font-bold text-text-primary"
              }
            >
              ${resolvedPrice.toFixed(2)}
            </p>
          </div>

          {cartBrand === "good-ideas" ? (
            <GoodIdeasAddToCartButton
              id={product.id}
              title={product.title}
              price={resolvedPrice}
              image={cartImage}
              variantSelections={variantSelections}
              label={ctaLabel}
              className="mt-0 w-full rounded-full py-3.5 text-base transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
              onAfterAdd={handleAfterAddToCart}
            />
          ) : (
            <AddToCartButton
              id={product.id}
              title={product.title}
              price={resolvedPrice}
              image={cartImage}
              variantSelections={variantSelections}
              label={ctaLabel}
              className="mt-0 w-full rounded-full py-3.5 text-base transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
              surface={surface}
              onAfterAdd={handleAfterAddToCart}
            />
          )}

          <div
            className={
              L
                ? "mt-2.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[10px] text-neutral-500 leading-tight"
                : "mt-2.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[10px] text-text-muted/70 leading-tight"
            }
          >
            <span>{mobileStickyTrustLines[0]}</span>
            <span
              aria-hidden
              className={L ? "text-neutral-300" : "text-white/25"}
            >
              ·
            </span>
            <span>{mobileStickyTrustLines[1]}</span>
            <span
              aria-hidden
              className={L ? "text-neutral-300" : "text-white/25"}
            >
              ·
            </span>
            <span>{mobileStickyTrustLines[2]}</span>
          </div>
        </div>
      </div>

      <AddedToCartModal
        open={addedToCart !== null}
        item={addedToCart}
        onClose={() => setAddedToCart(null)}
        cartPath={cartPath}
      />
    </>
  );
}
