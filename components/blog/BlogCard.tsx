import SmartImage from "@/components/SmartImage";
import Link from "next/link";

export type BlogCardSize = "xl" | "lg" | "md" | "sm";

type BlogCardProps = {
  href: string;
  title: string;
  excerpt: string;
  image: string;
  ctaLabel: string;
  size?: BlogCardSize;
};

const sizeClasses: Record<
  BlogCardSize,
  { aspect: string; title: string; imageSizes: string }
> = {
  xl: {
    aspect: "aspect-[16/11] min-h-[240px]",
    title: "text-2xl md:text-3xl",
    imageSizes: "(max-width:768px)100vw,50vw",
  },
  lg: {
    aspect: "aspect-[4/5] min-h-[220px]",
    title: "text-xl md:text-2xl",
    imageSizes: "(max-width:768px)100vw,40vw",
  },
  md: {
    aspect: "aspect-[3/4] min-h-[200px]",
    title: "text-lg md:text-xl",
    imageSizes: "(max-width:768px)100vw,33vw",
  },
  sm: {
    aspect: "aspect-square min-h-[180px]",
    title: "text-base md:text-lg",
    imageSizes: "(max-width:768px)100vw,30vw",
  },
};

/**
 * Story-first card: image-led, quiet hover (lift + zoom), no clutter.
 */
export default function BlogCard({
  href,
  title,
  excerpt,
  image,
  ctaLabel,
  size = "md",
}: BlogCardProps) {
  const s = sizeClasses[size];

  return (
    <Link href={href} className="group block">
      <article className="flex h-full flex-col overflow-hidden rounded-sm border border-earth-brown/15 bg-soft-stone shadow-[0_8px_28px_-16px_rgba(17,23,19,0.12)] transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:border-earth-brown/28 hover:shadow-[0_22px_48px_-22px_rgba(17,23,19,0.18)] motion-reduce:hover:scale-100">
        <div
          className={`relative w-full overflow-hidden rounded-sm ${s.aspect}`}
        >
          <SmartImage
            src={image}
            alt={title}
            fill
            sizes={s.imageSizes}
            className="object-cover object-center transition duration-[520ms] ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-base/35 via-transparent to-transparent" />
        </div>
        <div className="flex flex-1 flex-col px-4 pb-5 pt-5 md:px-5">
          <h2
            className={`font-semibold leading-snug tracking-tight text-dark-base ${s.title} line-clamp-3`}
          >
            {title}
          </h2>
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-gray">
            {excerpt}
          </p>
          <span className="mt-4 inline-flex text-xs font-medium uppercase tracking-[0.2em] text-accent-gold transition duration-300 group-hover:text-accent-gold">
            {ctaLabel}
          </span>
        </div>
      </article>
    </Link>
  );
}
