import { readFileSync } from "fs";
import { readFile } from "fs/promises";
import { join } from "path";
import type {
  ProductImages,
  VariantImageSet,
  VariantImagesMap,
  VariantImagesValueMap,
} from "@/lib/product-images";
import { parsePdpGalleryLayout } from "@/lib/pdp-gallery-framing";
import { isValidImageSrc } from "@/lib/image-src";

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

const featuredImageCache = new Map<string, string | null>();

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

function pickFeaturedUrl(productData: GoodIdeasProductJson): string | null {
  const url = productData.images.featured?.find(
    (src) => typeof src === "string" && src.length > 0
  );
  return url && isValidImageSrc(url) ? url : null;
}

/**
 * Imagen `featured` del JSON — fuente de verdad para product cards Good Products.
 */
export function getGoodIdeasProductFeaturedImage(productId: string): string | null {
  if (featuredImageCache.has(productId)) {
    return featuredImageCache.get(productId) ?? null;
  }

  let featured: string | null = null;
  try {
    const jsonPath = join(GI_PRODUCTS_JSON_DIR, `${productId}.json`);
    const fileContent = readFileSync(jsonPath, "utf-8");
    const productData = parseGoodIdeasProductJson(productId, fileContent);
    featured = productData ? pickFeaturedUrl(productData) : null;
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException;
    if (err.code !== "ENOENT") {
      console.warn(
        `⚠️  Good Ideas ${productId}: error leyendo JSON - ${err.message}`
      );
    }
  }

  featuredImageCache.set(productId, featured);
  return featured;
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
 * No usa `scripts/products/` ni rutas Go Natural.
 */
export async function getGoodIdeasProductImages(
  productId: string
): Promise<ProductImages> {
  const result: ProductImages = {
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
      return result;
    }

    const featured = pickFeaturedUrl(productData);
    if (featured) {
      result.featured = featured;
    }

    if (Array.isArray(productData.images.gallery)) {
      result.gallery = productData.images.gallery.filter(
        (url) => typeof url === "string" && url.length > 0
      );
    }

    if (Array.isArray(productData.images.lifestyle)) {
      result.lifestyle = productData.images.lifestyle.filter(
        (url) => typeof url === "string" && url.length > 0
      );
    }

    if (Array.isArray(productData.images.extras)) {
      result.extras = productData.images.extras.filter(
        (url) => typeof url === "string" && url.length > 0
      );
    }

    const variantImages =
      productData.images.variantImages ?? productData.variantImages;
    if (variantImages && typeof variantImages === "object") {
      result.variantImages = variantImages;
    }

    if (productData.pdpGalleryLayout != null) {
      result.pdpGalleryLayout = parsePdpGalleryLayout(productData.pdpGalleryLayout);
    }

    const totalImages =
      (result.featured ? 1 : 0) +
      result.gallery.length +
      result.lifestyle.length +
      result.extras.length;

    if (totalImages === 0) {
      console.warn(
        `⚠️  Good Ideas ${productId}: JSON sin URLs de imagen`
      );
    }
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException;
    if (err.code !== "ENOENT") {
      console.warn(
        `⚠️  Good Ideas ${productId}: error leyendo JSON - ${err.message}`
      );
    }
  }

  return result;
}
