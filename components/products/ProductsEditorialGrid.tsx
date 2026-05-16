import type { Product } from "@/lib/products";
import type { Locale } from "@/lib/i18n/config";
import ProductCardSimple from "@/components/ProductCardSimple";
import ScrollReveal from "@/components/blog/ScrollReveal";
import EditorialBreak from "@/components/products/EditorialBreak";

/** Tamaño de bloque entre pausas editoriales (múltiplo de 3 = filas completas en desktop) */
const CHUNK = 9;

type Labels = {
  viewProduct?: string;
  noImage?: string;
  addToCart?: string;
};

export type EditorialBreakConfig = {
  variant: "image" | "text";
  title: string;
  imageSrc?: string;
  imageAlt?: string;
};

type ProductsEditorialGridProps = {
  products: Product[];
  locale: Locale;
  labels: Labels;
  analyticsListName: string;
  breaks: [EditorialBreakConfig | null, EditorialBreakConfig | null];
};

function chunkProducts(list: Product[], size: number): Product[][] {
  const out: Product[][] = [];
  for (let i = 0; i < list.length; i += size) {
    out.push(list.slice(i, i + size));
  }
  return out;
}

/**
 * Rejilla uniforme (3 columnas desktop): tarjetas alineadas con Essential Gear (home).
 */
export default function ProductsEditorialGrid({
  products,
  locale,
  labels,
  analyticsListName,
  breaks,
}: ProductsEditorialGridProps) {
  if (products.length === 0) return null;

  const chunks = chunkProducts(products, CHUNK);
  const [breakAfterFirst, breakAfterSecond] = breaks;

  return (
    <div className="space-y-0">
      {chunks.map((chunk, chunkIdx) => (
        <div key={`chunk-${chunkIdx}`}>
          <ScrollReveal>
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-14">
              {chunk.map((product) => (
                <ProductCardSimple
                  key={product.id}
                  product={product}
                  locale={locale}
                  labels={labels}
                  analyticsListName={analyticsListName}
                  surface="light"
                />
              ))}
            </div>
          </ScrollReveal>

          {chunkIdx === 0 &&
          chunks.length > 1 &&
          breakAfterFirst ? (
            <EditorialBreak {...breakAfterFirst} />
          ) : null}
          {chunkIdx === 1 &&
          chunks.length > 2 &&
          breakAfterSecond ? (
            <EditorialBreak {...breakAfterSecond} />
          ) : null}
        </div>
      ))}
    </div>
  );
}
