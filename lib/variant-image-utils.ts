import type {
  ProductImages,
  VariantImageSet,
  VariantImagesMap,
  VariantImagesValueMap,
} from "@/lib/product-images";
import type { ProductVariants, VariantDefinition } from "@/lib/product-variants";

export function isColorVariantDefinition(variant: VariantDefinition): boolean {
  const type = variant.type.toLowerCase();
  const label = variant.label.toLowerCase();
  return (
    type === "color" ||
    type.includes("colour") ||
    label.includes("color") ||
    label.includes("colour")
  );
}

export function getColorVariantDefinition(
  productVariants: ProductVariants | null | undefined
): VariantDefinition | undefined {
  return productVariants?.variants.find(isColorVariantDefinition);
}

function isModelVariantDefinition(variant: VariantDefinition): boolean {
  const type = variant.type.toLowerCase();
  const label = variant.label.toLowerCase();
  return (
    type === "model" ||
    type === "capacity" ||
    label.includes("model") ||
    label.includes("capacity") ||
    label.includes("capacidad")
  );
}

export function getModelVariantDefinition(
  productVariants: ProductVariants | null | undefined
): VariantDefinition | undefined {
  return productVariants?.variants.find(isModelVariantDefinition);
}

function getImageDrivingVariantDefinition(
  productVariants: ProductVariants | null | undefined
): VariantDefinition | undefined {
  return (
    getColorVariantDefinition(productVariants) ??
    getModelVariantDefinition(productVariants)
  );
}

export function pickFeaturedFromVariantSet(
  variant: VariantImageSet | string[] | undefined
): string | null {
  if (!variant) return null;
  if (Array.isArray(variant)) return variant[0] ?? null;

  const featured = variant.featured;
  if (Array.isArray(featured) && featured.length > 0) return featured[0];

  const gallery = variant.gallery;
  if (Array.isArray(gallery) && gallery.length > 0) return gallery[0];

  return null;
}

function imagesFromVariantSet(
  variant: VariantImageSet | string[],
  defaults: { featured: string | null; gallery: string[] }
): { featured: string | null; gallery: string[] } {
  if (Array.isArray(variant)) {
    return {
      featured: variant[0] ?? defaults.featured,
      gallery: variant.length > 0 ? variant : defaults.gallery,
    };
  }

  const featuredUrls = (variant.featured ?? []).filter(Boolean);
  const galleryUrls = (variant.gallery ?? []).filter(Boolean);
  const fallbackThumbs =
    featuredUrls.length > 0 ? featuredUrls : defaults.gallery;

  return {
    featured: featuredUrls[0] ?? defaults.featured,
    gallery: galleryUrls.length > 0 ? galleryUrls : fallbackThumbs,
  };
}

/**
 * Resuelve imágenes activas del PDP según color o modelo/capacidad seleccionados.
 * Talle y otras variantes no cambian la imagen.
 */
export function resolveColorVariantActiveImages(
  productImages: ProductImages,
  productVariants: ProductVariants | null | undefined,
  selections: Record<string, string>,
  defaults: { featured: string | null; gallery: string[] }
): { featured: string | null; gallery: string[] } {
  const imageVariant = getImageDrivingVariantDefinition(productVariants);
  if (!imageVariant || !productImages.variantImages) {
    return defaults;
  }

  const selectedValue = selections[imageVariant.type];
  if (!selectedValue) {
    return defaults;
  }

  const { variantImages } = productImages;
  const variantType = imageVariant.type;

  const typedMap = (variantImages as VariantImagesMap)[variantType];
  if (typedMap?.[selectedValue]) {
    return imagesFromVariantSet(typedMap[selectedValue], defaults);
  }

  const nestedColorMap = (variantImages as VariantImagesMap).color;
  if (nestedColorMap?.[selectedValue]) {
    return imagesFromVariantSet(nestedColorMap[selectedValue], defaults);
  }

  const flatMap = variantImages as VariantImagesValueMap;
  if (flatMap[selectedValue]) {
    return imagesFromVariantSet(flatMap[selectedValue], defaults);
  }

  return defaults;
}

export function resolveColorFeaturedImage(
  productImages: ProductImages,
  colorValue: string,
  productVariants?: ProductVariants | null
): string | null {
  const colorVariant = productVariants
    ? getColorVariantDefinition(productVariants)
    : undefined;
  const variantType = colorVariant?.type ?? "color";

  const { variantImages } = productImages;
  if (!variantImages) return null;

  const typedMap = (variantImages as VariantImagesMap)[variantType];
  if (typedMap?.[colorValue]) {
    return pickFeaturedFromVariantSet(typedMap[colorValue]);
  }

  const nestedColorMap = (variantImages as VariantImagesMap).color;
  if (nestedColorMap?.[colorValue]) {
    return pickFeaturedFromVariantSet(nestedColorMap[colorValue]);
  }

  const flatMap = variantImages as VariantImagesValueMap;
  if (flatMap[colorValue]) {
    return pickFeaturedFromVariantSet(flatMap[colorValue]);
  }

  return null;
}
