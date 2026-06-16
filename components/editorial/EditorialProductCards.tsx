import Link from "next/link";
import SmartImage from "@/components/SmartImage";

type EditorialProduct = {
  id: string;
  title: string;
  image: string;
};

type EditorialProductCardsProps = {
  title: string;
  locale: string;
  caption: string;
  products: EditorialProduct[];
};

export default function EditorialProductCards({
  title,
  locale,
  caption,
  products,
}: EditorialProductCardsProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-6 sm:px-10 lg:px-16">
        <h2 className="text-xl md:text-2xl font-semibold text-text-primary">
          {title}
        </h2>
        <div className="mt-8 space-y-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/${locale}/products/${product.id}`}
              className="group flex flex-col gap-4 md:flex-row md:items-center"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl md:w-56">
                <SmartImage
                  src={product.image}
                  alt={product.title}
                  fill
                  loading="lazy"
                  className="object-cover object-center transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                  sizes="224px"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-dark-base/10 via-dark-base/25 to-dark-base/60" />
              </div>
              <div className="space-y-2">
                <p className="text-base md:text-lg font-semibold text-text-primary transition-opacity duration-200 group-hover:opacity-90">
                  {product.title}
                </p>
                <p className="text-sm text-text-muted leading-relaxed">
                  {caption}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

