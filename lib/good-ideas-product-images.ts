import { readFile } from "fs/promises";
import { join } from "path";
import type {
  ProductImages,
  VariantImageSet,
  VariantImagesMap,
  VariantImagesValueMap,
} from "@/lib/product-images";
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
    const productData: GoodIdeasProductJson = JSON.parse(fileContent);

    if (!productData.id || !productData.images) {
      console.warn(
        `⚠️  Good Ideas ${productId}: JSON inválido (falta 'id' o 'images')`
      );
      return result;
    }

    if (productData.id !== productId) {
      console.warn(
        `⚠️  Good Ideas ${productId}: el 'id' en JSON (${productData.id}) no coincide`
      );
    }

    if (productData.images.featured?.length) {
      result.featured = productData.images.featured[0];
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
