import Link from "next/link";
import SmartImage from "@/components/SmartImage";
import { localizeGoodIdeasProduct } from "@/lib/good-ideas-products";
import { resolveGoodIdeasProductCardImage } from "@/lib/good-ideas-product-images";
import { productPath } from "@/lib/routing/paths";
import type { Product } from "@/lib/product-types";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  locale: Locale;
  title: string;
  products: Product[];
  viewProductLabel: string;
};

export default function GoodIdeasBlogProductRail({
  locale,
  title,
  products,
  viewProductLabel,
}: Props) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-[#E5E5E5] bg-white py-14 md:py-16">
      <div className="mx-auto max-w-[calc(1315px+4rem)] px-8">
        <div className="mx-auto max-w-[1315px]">
          <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-[#111111] md:text-2xl">
            {title}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const localized = localizeGoodIdeasProduct(product, locale);
              const image = resolveGoodIdeasProductCardImage(product.id);
              return (
                <Link
                  key={product.id}
                  href={productPath(locale, product.id)}
                  className="group overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white transition hover:border-[#3B82F6]/35"
                >
                  <div className="relative aspect-[4/5] bg-[#FAFAFA]">
                    {image ? (
                      <SmartImage
                        src={image}
                        alt={localized.title}
                        fill
                        sizes="(max-width: 640px) 50vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    ) : null}
                  </div>
                  <div className="p-4">
                    <p className="line-clamp-2 font-body text-sm font-semibold text-[#111111]">
                      {localized.title}
                    </p>
                    <p className="mt-2 font-body text-sm text-[#3B82F6]">
                      {viewProductLabel} →
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
