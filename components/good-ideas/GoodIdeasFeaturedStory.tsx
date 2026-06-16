import SmartImage from "@/components/SmartImage";
import Link from "next/link";

export type GoodIdeasFeaturedStoryPost = {
  href: string;
  title: string;
  excerpt: string;
  image: string;
};

type Props = {
  post: GoodIdeasFeaturedStoryPost;
  eyebrow: string;
  ctaLabel: string;
  anchorId?: string;
};

export default function GoodIdeasFeaturedStory({
  post,
  eyebrow,
  ctaLabel,
  anchorId,
}: Props) {
  return (
    <section
      id={anchorId}
      className={`border-t border-white/[0.06] bg-[#0B0F14] py-16 md:py-24${
        anchorId
          ? " scroll-mt-[calc(env(safe-area-inset-top,0px)+6.5rem)]"
          : ""
      }`}
    >
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10 lg:px-12">
        <p className="text-center font-inter text-[10px] font-semibold uppercase tracking-[0.28em] text-[#3B82F6]">
          {eyebrow}
        </p>
        <Link href={post.href} className="group mt-10 block">
          <div className="relative aspect-[21/11] min-h-[220px] w-full overflow-hidden rounded-2xl border border-white/[0.08] sm:aspect-[2/1] md:min-h-[320px]">
            <SmartImage
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, min(1200px, 100vw)"
              className="object-cover object-center transition duration-500 ease-out group-hover:scale-[1.03]"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0F14]/90 via-[#0B0F14]/20 to-transparent" />
          </div>
          <div className="mt-8 max-w-2xl">
            <h2 className="font-display text-[clamp(1.5rem,4vw,2.25rem)] font-semibold leading-tight tracking-[-0.02em] text-[#E8ECF1] transition group-hover:text-[#3B82F6]">
              {post.title}
            </h2>
            <p className="mt-4 font-inter text-[16px] leading-relaxed text-[rgba(232,236,241,0.72)]">
              {post.excerpt}
            </p>
            <span className="mt-6 inline-flex font-inter text-[11px] font-semibold uppercase tracking-[0.14em] text-[#3B82F6]">
              {ctaLabel} →
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
