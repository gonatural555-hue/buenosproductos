import { Product } from "@/lib/products";

export { isExternalImage, isValidImageSrc, resolveImageSrc, DEFAULT_IMAGE_PLACEHOLDER } from "@/lib/image-src";

export const PRODUCT_BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiMxMDEyMTQiIC8+PC9zdmc+";

/**
 * Helper síncrono para obtener imagen principal (para cards)
 * 
 * @param product - El producto del cual obtener la imagen principal
 * @returns URL de la primera imagen del producto, o string vacío si no hay imágenes
 */
export function getProductMainImage(product: Product): string {
  // Usar primera imagen del array como fallback
  return product.images && product.images.length > 0
    ? product.images[0]
    : "";
}
