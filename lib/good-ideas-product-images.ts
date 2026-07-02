import { readFileSync, readdirSync, statSync } from "fs";
import { readFile } from "fs/promises";
import { join } from "path";
import type {
  ProductImages,
  VariantImageSet,
  VariantImagesMap,
  VariantImagesValueMap,
} from "@/lib/product-images";
import { normalizeImageSrcList } from "@/lib/image-src";
import { parsePdpGalleryLayout } from "@/lib/pdp-gallery-framing";

export type { ProductImages, VariantImageSet, VariantImagesMap, VariantImagesValueMap };

interface GoodIdeasProductJson {
  id: string;
  brand?: string;
  pdpGalleryLayout?: unknown;
  images: {
    featured: string[];
    gallery: string[];
    lifestyle: string[];
    extras: string[];
    variantImages?: VariantImagesMap | VariantImagesValueMap;
  };
  variantImages?: VariantImagesMap | VariantImagesValueMap;
}

const GI_PRODUCTS_JSON_DIR = join(process.cwd(), "scripts", "good-ideas-products");

const featuredImageCache = new Map<
  string,
  { mtimeMs: number; featured: string | null }
>();

function parseGoodIdeasProductJson(
  productId: string,
  fileContent: string
): GoodIdeasProductJson | null {
  try {
    const productData: GoodIdeasProductJson = JSON.parse(fileContent);
    if (!productData.id || !productData.images) {
      console.warn(
        `⚠️  Good Ideas ${productId}: JSON inválido (falta 'id' o 'images')`
      );
      return null;
    }
    if (productData.id !== productId) {
      console.warn(
        `⚠️  Good Ideas ${productId}: el 'id' en JSON (${productData.id}) no coincide`
      );
    }
    return productData;
  } catch {
    return null;
  }
}

function normalizeVariantImageSet(set: VariantImageSet): VariantImageSet {
  return {
    featured: normalizeImageSrcList(set.featured),
    gallery: normalizeImageSrcList(set.gallery),
    lifestyle: normalizeImageSrcList(set.lifestyle),
    extras: normalizeImageSrcList(set.extras),
  };
}

function isVariantImageSet(value: unknown): value is VariantImageSet {
  if (!value || typeof value !== "object") return false;
  return (
    "featured" in (value as VariantImageSet) ||
    "gallery" in (value as VariantImageSet) ||
    "lifestyle" in (value as VariantImageSet) ||
    "extras" in (value as VariantImageSet)
  );
}

function normalizeVariantImages(
  variantImages: VariantImagesMap | VariantImagesValueMap
): VariantImagesMap | VariantImagesValueMap | undefined {
  const values = Object.values(variantImages);
  const isFlatMap =
    values.length > 0 &&
    values.every((value) => Array.isArray(value) || isVariantImageSet(value));

  if (isFlatMap) {
    const normalizedFlat: VariantImagesValueMap = {};

    Object.entries(variantImages).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        const urls = normalizeImageSrcList(value);
        if (urls.length > 0) normalizedFlat[key] = urls;
        return;
      }

      if (isVariantImageSet(value)) {
        const normalizedSet = normalizeVariantImageSet(value);
        const hasAny =
          (normalizedSet.featured?.length ?? 0) > 0 ||
          (normalizedSet.gallery?.length ?? 0) > 0 ||
          (normalizedSet.lifestyle?.length ?? 0) > 0 ||
          (normalizedSet.extras?.length ?? 0) > 0;
        if (hasAny) normalizedFlat[key] = normalizedSet;
      }
    });

    return Object.keys(normalizedFlat).length > 0 ? normalizedFlat : undefined;
  }

  const normalizedVariantImages: VariantImagesMap = {};

  Object.entries(variantImages as VariantImagesMap).forEach(
    ([variantType, variantValues]) => {
      if (!variantValues || typeof variantValues !== "object") return;

      const normalizedValues: Record<string, VariantImageSet> = {};

      Object.entries(variantValues).forEach(([valueKey, imageSet]) => {
        if (!imageSet || typeof imageSet !== "object") return;

        const normalizedSet = Array.isArray(imageSet)
          ? { gallery: normalizeImageSrcList(imageSet) }
          : normalizeVariantImageSet(imageSet as VariantImageSet);

        const hasAny =
          (normalizedSet.featured?.length ?? 0) > 0 ||
          (normalizedSet.gallery?.length ?? 0) > 0 ||
          (normalizedSet.lifestyle?.length ?? 0) > 0 ||
          (normalizedSet.extras?.length ?? 0) > 0;

        if (hasAny) normalizedValues[valueKey] = normalizedSet;
      });

      if (Object.keys(normalizedValues).length > 0) {
        normalizedVariantImages[variantType] = normalizedValues;
      }
    }
  );

  return Object.keys(normalizedVariantImages).length > 0
    ? normalizedVariantImages
    : undefined;
}

function pickFeaturedUrl(productData: GoodIdeasProductJson): string | null {
  return normalizeImageSrcList(productData.images.featured)[0] ?? null;
}

function applyGoodIdeasProductImagesFromJson(
  productData: GoodIdeasProductJson
): ProductImages {
  const result: ProductImages = {
    featured: pickFeaturedUrl(productData),
    gallery: normalizeImageSrcList(productData.images.gallery),
    lifestyle: normalizeImageSrcList(productData.images.lifestyle),
    extras: normalizeImageSrcList(productData.images.extras),
    variantImages: undefined,
  };

  const rawVariantImages =
    productData.images.variantImages ?? productData.variantImages;
  if (rawVariantImages && typeof rawVariantImages === "object") {
    result.variantImages = normalizeVariantImages(rawVariantImages);
  }

  if (productData.pdpGalleryLayout != null) {
    result.pdpGalleryLayout = parsePdpGalleryLayout(productData.pdpGalleryLayout);
  }

  return result;
}

/**
 * Imagen `featured` del JSON — fuente de verdad para product cards Good Products.
 */
export function getGoodIdeasProductFeaturedImage(productId: string): string | null {
  const jsonPath = join(GI_PRODUCTS_JSON_DIR, `${productId}.json`);

  let featured: string | null = null;
  try {
    const mtimeMs = statSync(jsonPath).mtimeMs;
    const cached = featuredImageCache.get(productId);
    if (cached && cached.mtimeMs === mtimeMs) {
      return cached.featured;
    }

    const fileContent = readFileSync(jsonPath, "utf-8");
    const productData = parseGoodIdeasProductJson(productId, fileContent);
    featured = productData ? pickFeaturedUrl(productData) : null;
    featuredImageCache.set(productId, { mtimeMs, featured });
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException;
    if (err.code !== "ENOENT") {
      console.warn(
        `⚠️  Good Ideas ${productId}: error leyendo JSON - ${err.message}`
      );
    }
    featuredImageCache.set(productId, { mtimeMs: -1, featured: null });
  }

  return featured;
}

/**
 * Mapa productId → `images.featured[0]` para uso en client components (PDP cross-sell, etc.).
 */
export function getAllGoodIdeasProductCardImages(): Record<string, string> {
  const map: Record<string, string> = {};

  try {
    const files = readdirSync(GI_PRODUCTS_JSON_DIR).filter((f) =>
      f.endsWith(".json")
    );
    for (const file of files) {
      const productId = file.replace(/\.json$/, "");
      const featured = getGoodIdeasProductFeaturedImage(productId);
      if (featured) {
        map[productId] = featured;
      }
    }
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException;
    console.warn(
      `⚠️  Good Ideas: no se pudo leer directorio de JSON - ${err.message}`
    );
  }

  return map;
}

/**
 * Imagen de product card Good Products.
 * Única fuente: `images.featured[0]` en `scripts/good-ideas-products/{id}.json`.
 * No usa `product.images` del catálogo.
 */
export function resolveGoodIdeasProductCardImage(productId: string): string {
  return getGoodIdeasProductFeaturedImage(productId) ?? "";
}

/**
 * Imágenes Good Ideas desde `scripts/good-ideas-products/{productId}.json`.
 * Acepta rutas locales (`/assets/…` o `assets/…`) y URLs externas (`https://…`).
 */
export async function getGoodIdeasProductImages(
  productId: string
): Promise<ProductImages> {
  const empty: ProductImages = {
    featured: null,
    gallery: [],
    lifestyle: [],
    extras: [],
    variantImages: undefined,
  };

  try {
    const jsonPath = join(GI_PRODUCTS_JSON_DIR, `${productId}.json`);
    const fileContent = await readFile(jsonPath, "utf-8");
    const productData = parseGoodIdeasProductJson(productId, fileContent);
    if (!productData) {
      return empty;
    }

    const result = applyGoodIdeasProductImagesFromJson(productData);

    const totalImages =
      (result.featured ? 1 : 0) +
      result.gallery.length +
      result.lifestyle.length +
      result.extras.length;

    if (totalImages === 0) {
      console.warn(`⚠️  Good Ideas ${productId}: JSON sin URLs de imagen`);
    }

    return result;
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException;
    if (err.code !== "ENOENT") {
      console.warn(
        `⚠️  Good Ideas ${productId}: error leyendo JSON - ${err.message}`
      );
    }
    return empty;
  }
}
