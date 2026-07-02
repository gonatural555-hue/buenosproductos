"use client";

import { useCallback, useState } from "react";

const BASE_CLASS =
  "block w-auto max-w-none object-contain object-center [filter:drop-shadow(0_24px_64px_rgba(0,0,0,0.55))] transition duration-300 motion-reduce:transition-none";

type Props = {
  src: string;
  alt: string;
  heightClass: string;
  fallbackSrc?: string;
  priority?: boolean;
  hoverClass?: string;
};

/** PNG/WebP con alpha real — sin `next/image` ni blur placeholder. */
export default function HeroCutoutImage({
  src: initialSrc,
  alt,
  heightClass,
  fallbackSrc,
  priority = false,
  hoverClass = "",
}: Props) {
  const [src, setSrc] = useState(initialSrc);

  const handleError = useCallback(() => {
    if (fallbackSrc && src !== fallbackSrc) {
      setSrc(fallbackSrc);
    }
  }, [fallbackSrc, src]);

  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      onError={fallbackSrc ? handleError : undefined}
      className={`${BASE_CLASS} ${heightClass} ${hoverClass}`}
    />
  );
}
