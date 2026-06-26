import GoodIdeasProductCardClient from "@/components/good-ideas/GoodIdeasProductCardClient";
import { resolveGoodIdeasProductCardImage } from "@/lib/good-ideas-product-images";
import type { Product } from "@/lib/products";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  product: Product;
  locale: Locale;
  viewProductLabel: string;
  noImageLabel: string;
  addNowLabel: string;
};

/**
 * Product card Good Products (server).
 * La imagen siempre proviene de `images.featured[0]` en el JSON del producto.
 */
export default function GoodIdeasProductCard({
  product,
  locale,
  viewProductLabel,
  noImageLabel,
  addNowLabel,
}: Props) {
  const cardImage = resolveGoodIdeasProductCardImage(product.id);

  return (
    <GoodIdeasProductCardClient
      product={product}
      locale={locale}
      viewProductLabel={viewProductLabel}
      noImageLabel={noImageLabel}
      addNowLabel={addNowLabel}
      cardImage={cardImage}
    />
  );
}
