import Link from "next/link";
import SmartImage from "@/components/SmartImage";

type PostCardProps = {
  href: string;
  title: string;
  excerpt: string;
  image: string;
  ctaLabel: string;
};

export default function PostCard({
  href,
  title,
  excerpt,
  image,
  ctaLabel,
}: PostCardProps) {
  return (
    <Link href={href} className="group block">
      <article className="overflow-hidden rounded-sm border border-white/[0.08] bg-[#0f1412]/80 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.35)] transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:border-white/[0.12] hover:shadow-[0_20px_48px_-20px_rgba(0,0,0,0.5)] motion-reduce:hover:scale-100">
        <div className="relative aspect-[4/3] overflow-hidden">
          <SmartImage
            src={image}
            alt={title}
            fill
            loading="lazy"
            className="object-cover object-center transition-transform duration-300 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/12 to-black/18" />
        </div>
        <div className="space-y-2 p-6 md:p-7">
          <h2 className="line-clamp-2 text-lg font-semibold tracking-tight text-text-primary">
            {title}
          </h2>
          <p className="line-clamp-2 text-sm leading-relaxed text-white/[0.78]">
            {excerpt}
          </p>
          <span className="inline-flex text-xs font-medium uppercase tracking-[0.18em] text-accent-gold transition-colors duration-200 ease-out group-hover:text-accent-gold">
            {ctaLabel}
          </span>
        </div>
      </article>
    </Link>
  );
}

