"use client";

import Image, { type ImageProps } from "next/image";
import { isExternalImage, isValidImageSrc } from "@/lib/image-src";
import { PRODUCT_BLUR_DATA_URL } from "@/lib/product-image-helper";

export type SmartImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
};

/**
 * Imagen unificada: rutas locales (`/assets/…`) y URLs externas (`https://…`).
 * Las externas usan `unoptimized` para cargar directo sin descargar al repo.
 */
export default function SmartImage({
  src,
  alt = "",
  className,
  fill,
  width,
  height,
  priority,
  sizes,
  loading,
  onError,
  placeholder,
  blurDataURL,
  unoptimized: unoptimizedProp,
  ...rest
}: SmartImageProps) {
  if (!isValidImageSrc(src)) {
    return null;
  }

  const external = isExternalImage(src);
  const unoptimized = unoptimizedProp ?? external;
  const useBlur =
    !external && (placeholder === "blur" || placeholder === undefined);

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      priority={priority}
      sizes={sizes}
      loading={loading}
      onError={onError}
      placeholder={useBlur ? "blur" : "empty"}
      blurDataURL={useBlur ? blurDataURL ?? PRODUCT_BLUR_DATA_URL : undefined}
      unoptimized={unoptimized}
      className={className}
      {...rest}
    />
  );
}
