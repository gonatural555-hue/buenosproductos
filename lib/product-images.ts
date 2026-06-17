import { readFile } from "fs/promises";
import { join } from "path";
import {
  parsePdpGalleryLayout,
  type PdpGalleryLayout,
} from "@/lib/pdp-gallery-framing";

export type { PdpGalleryLayout };

export interface ProductImages {
  featured: string | null;
  gallery: string[];
  lifestyle: string[];
  extras: string[];
  variantImages?: VariantImagesMap | VariantImagesValueMap;
  pdpGalleryLayout?: PdpGalleryLayout | null;
}

export interface VariantImageSet {
  featured?: string[];
  gallery?: string[];
  lifestyle?: string[];
  extras?: string[];
}

export type VariantImagesMap = Record<string, Record<string, VariantImageSet>>;
export type VariantImagesValueMap = Record<string, VariantImageSet | string[]>;

interface ProductJson {
  id: string;
  images: {
    featured: string[];
    gallery: string[];
    lifestyle: string[];
    extras: string[];
  };
  variantImages?: VariantImagesMap | VariantImagesValueMap;
  pdpGalleryLayout?: unknown;
}

/**
 * Obtiene las imágenes de un producto desde scripts/products/{productId}.json
 * 
 * @param productId - El ID único del producto (ej: "gn-fishing-eq-008")
 * @returns Objeto con las imágenes organizadas por categoría
 */
export async function getProductImages(
  productId: string
): Promise<ProductImages> {
  const result: ProductImages = {
    featured: null,
    gallery: [],
    lifestyle: [],
    extras: [],
    variantImages: undefined,
    pdpGalleryLayout: null,
  };

  try {
    // Leer desde scripts/products/{productId}.json
    const jsonPath = join(
      process.cwd(),
      "scripts",
      "products",
      `${productId}.json`
    );

    const fileContent = await readFile(jsonPath, "utf-8");
    const productData: ProductJson = JSON.parse(fileContent);

    // Validar estructura - debe tener id e images
    if (!productData.id || !productData.images) {
      console.warn(
        `⚠️  Producto ${productId}: JSON inválido (falta 'id' o 'images')`
      );
      return result;
    }

    // Validar que el id coincida
    if (productData.id !== productId) {
      console.warn(
        `⚠️  Producto ${productId}: El 'id' en el JSON (${productData.id}) no coincide con el productId`
      );
    }

    if (productData.pdpGalleryLayout != null) {
      result.pdpGalleryLayout = parsePdpGalleryLayout(productData.pdpGalleryLayout);
    }

    // Extraer imágenes desde el JSON
    // Featured: primera URL del array, o null si está vacío
    if (
      productData.images.featured &&
      Array.isArray(productData.images.featured) &&
      productData.images.featured.length > 0
    ) {
      result.featured = productData.images.featured[0];
    }

    // Gallery: todas las URLs del array
    if (
      productData.images.gallery &&
      Array.isArray(productData.images.gallery)
    ) {
      result.gallery = productData.images.gallery.filter(
        (url) => typeof url === "string" && url.length > 0
      );
    }

    // Lifestyle: todas las URLs del array
    if (
      productData.images.lifestyle &&
      Array.isArray(productData.images.lifestyle)
    ) {
      result.lifestyle = productData.images.lifestyle.filter(
        (url) => typeof url === "string" && url.length > 0
      );
    }

    // Extras: todas las URLs del array
    if (
      productData.images.extras &&
      Array.isArray(productData.images.extras)
    ) {
      result.extras = productData.images.extras.filter(
        (url) => typeof url === "string" && url.length > 0
      );
    }

    // Variant images: estructura opcional por variante
    if (productData.variantImages && typeof productData.variantImages === "object") {
      const normalizeArray = (arr: unknown): string[] => {
        if (!Array.isArray(arr)) return [];
        return arr.filter((url) => typeof url === "string" && url.length > 0);
      };

      const isImageSet = (value: unknown): value is VariantImageSet => {
        if (!value || typeof value !== "object") return false;
        return (
          "featured" in (value as VariantImageSet) ||
          "gallery" in (value as VariantImageSet) ||
          "lifestyle" in (value as VariantImageSet) ||
          "extras" in (value as VariantImageSet)
        );
      };

      // Detectar mapa plano: { "1000": [], "2000": [] } o { "blue": {featured:[],...} }
      const values = Object.values(productData.variantImages);
      const isFlatMap =
        values.length > 0 &&
        values.every(
          (value) => Array.isArray(value) || isImageSet(value)
        );

      if (isFlatMap) {
        const normalizedFlat: VariantImagesValueMap = {};

        Object.entries(productData.variantImages).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            normalizedFlat[key] = normalizeArray(value);
            return;
          }

          if (isImageSet(value)) {
            normalizedFlat[key] = {
              featured: normalizeArray(value.featured),
              gallery: normalizeArray(value.gallery),
              lifestyle: normalizeArray(value.lifestyle),
              extras: normalizeArray(value.extras),
            };
          }
        });

        if (Object.keys(normalizedFlat).length > 0) {
          result.variantImages = normalizedFlat;
        }
      } else {
        const normalizedVariantImages: VariantImagesMap = {};

        Object.entries(productData.variantImages).forEach(
          ([variantType, variantValues]) => {
            if (!variantValues || typeof variantValues !== "object") {
              return;
            }

            const normalizedValues: Record<string, VariantImageSet> = {};

            Object.entries(variantValues).forEach(([valueKey, imageSet]) => {
              if (!imageSet || typeof imageSet !== "object") {
                return;
              }

              const normalizedSet: VariantImageSet = {
                featured: normalizeArray((imageSet as VariantImageSet).featured),
                gallery: normalizeArray((imageSet as VariantImageSet).gallery),
                lifestyle: normalizeArray((imageSet as VariantImageSet).lifestyle),
                extras: normalizeArray((imageSet as VariantImageSet).extras),
              };

              const hasAny =
                (normalizedSet.featured?.length ?? 0) > 0 ||
                (normalizedSet.gallery?.length ?? 0) > 0 ||
                (normalizedSet.lifestyle?.length ?? 0) > 0 ||
                (normalizedSet.extras?.length ?? 0) > 0;

              if (hasAny) {
                normalizedValues[valueKey] = normalizedSet;
              }
            });

            if (Object.keys(normalizedValues).length > 0) {
              normalizedVariantImages[variantType] = normalizedValues;
            }
          }
        );

        if (Object.keys(normalizedVariantImages).length > 0) {
          result.variantImages = normalizedVariantImages;
        }
      }
    }

    // Log warning si no hay imágenes
    const totalImages =
      (result.featured ? 1 : 0) +
      result.gallery.length +
      result.lifestyle.length +
      result.extras.length;

    if (totalImages === 0) {
      console.warn(
        `⚠️  Producto ${productId}: El archivo JSON existe pero no contiene imágenes`
      );
    }
  } catch (error: any) {
    // Archivo no existe o JSON inválido
    if (error.code === "ENOENT") {
      // Archivo no encontrado - esto es normal si el producto no tiene JSON
      // No logueamos para evitar ruido, solo retornamos resultado vacío
    } else {
      // Error de parsing u otro error
      console.warn(
        `⚠️  Producto ${productId}: Error leyendo JSON - ${error.message}`
      );
    }
  }

  return result;
}

