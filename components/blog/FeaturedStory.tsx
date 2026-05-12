import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/blog/ScrollReveal";
import PremiumImageOverlay from "@/components/ui/PremiumImageOverlay";

export type FeaturedStoryPost = {
  href: string;
  title: string;
  excerpt: string;
  image: string;
};

type FeaturedStoryProps = {
  post: FeaturedStoryPost;
  eyebrow: string;
  ctaLabel: string;
};

/**
 * Large editorial anchor: image-first, minimal chrome, story-led.
 */
export default function FeaturedStory({
  post,
  eyebrow,
  ctaLabel,
}: FeaturedStoryProps) {
  return (
    <section className="bg-mountain-green py-16 md:py-24 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-12">
        <ScrollReveal>
          <p className="text-center text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-accent-gold drop-shadow-[0_1px_10px_rgba(0,0,0,0.35)]">
            {eyebrow}
          </p>
        </ScrollReveal>

        <ScrollReveal delayMs={90} className="mt-10">
          <Link href={post.href} className="group block">
            <div className="relative aspect-[21/11] min-h-[220px] w-full overflow-hidden rounded-sm sm:aspect-[2/1] md:min-h-[320px]">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, min(1400px, 100vw)"
                className="object-cover object-center transition duration-[1400ms] ease-out group-hover:scale-[1.03]"
                priority
              />
              <PremiumImageOverlay />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark-base/65 via-transparent to-transparent" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-dark-base/35 to-transparent md:from-dark-base/25" />
            </div>

            <div className="relative z-[1] -mt-16 px-2 text-center sm:-mt-20 md:-mt-24 md:px-8">
              <h2 className="hero-display mx-auto max-w-4xl font-bold tracking-tight text-white text-[clamp(1.75rem,4vw,3rem)] leading-[1.12]">
                {post.title}
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
                {post.excerpt}
              </p>
              <span className="mt-8 inline-flex text-sm font-medium text-accent-gold transition duration-300 group-hover:text-accent-gold/85">
                {ctaLabel}
              </span>
            </div>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
