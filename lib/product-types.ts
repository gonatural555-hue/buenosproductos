import type { Locale } from "@/lib/i18n/config";

export type ProductVariantOption = {
  label: string;
  value?: string;
  priceModifier?: number;
  /** Color del círculo swatch en PDP y cards (ej. "#EDE6D6"). */
  swatchHex?: string;
};

export type ProductVariants = {
  type: string;
  label: string;
  default?: string;
  options: ProductVariantOption[];
};

export type ProductTranslation = {
  title?: string;
  description?: string;
  shortDescription?: string;
  longDescription?: string[];
  features?: string[];
  salesBadge?: string;
  seo?: {
    title?: string;
    description?: string;
    ogTitle?: string;
    ogDescription?: string;
  };
};

export type Product = {
  id: string;
  slug?: string;
  title: string;
  price: number;
  category: string;
  /** Marca comercial (opcional). Si falta, se infiere del título o categoría. */
  brand?: string;
  images: string[];
  description: string;
  shortDescription?: string;
  longDescription?: string[];
  features?: string[];
  /** PDP badge junto al título (ej. "Sale", "Super Sale"). No usar contadores "+ N vendidos". */
  salesBadge?: string;
  freeShipping?: boolean;
  /** Overrides PDP trust copy (desktop). If omitted, site i18n defaults are used. */
  pdpTrust?: {
    shippingEurope?: string;
    shippingLatam?: string;
    returns?: string;
  };
  translations?: Partial<Record<Locale, ProductTranslation>>;
  variants?: ProductVariants | ProductVariants[];
};
