import Link from "next/link";
import SmartImage from "@/components/SmartImage";
import { localizeGoodIdeasProduct } from "@/lib/good-ideas-products";
import { resolveGoodIdeasProductCardImage } from "@/lib/good-ideas-product-images";
import { goodIdeasProductPath } from "@/lib/routing/brands";
import type { Product } from "@/lib/products";
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
    <section className="border-t border-white/[0.06] bg-[#151B24] py-14 md:py-16">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-[#E8ECF1] md:text-2xl">
          {title}
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const localized = localizeGoodIdeasProduct(product, locale);
            const image = resolveGoodIdeasProductCardImage(product.id);
            return (
              <Link
                key={product.id}
                href={goodIdeasProductPath(locale, product.id)}
                className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0B0F14] transition hover:border-[#3B82F6]/35"
              >
                <div className="relative aspect-[4/5] bg-[#0B0F14]">
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
                  <p className="font-inter text-[14px] font-semibold text-[#E8ECF1] line-clamp-2">
                    {localized.title}
                  </p>
                  <p className="mt-2 font-inter text-[13px] text-[#3B82F6]">
                    {viewProductLabel} →
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
