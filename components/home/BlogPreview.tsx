import Link from "next/link";
import BlogCard from "@/components/blog/BlogCard";
import ScrollReveal from "@/components/blog/ScrollReveal";

export type BlogPreviewPost = {
  href: string;
  title: string;
  excerpt: string;
  image: string;
};

type BlogPreviewProps = {
  title: string;
  intro: string;
  ctaLabel: string;
  ctaHref: string;
  readLabel: string;
  posts: BlogPreviewPost[];
};

/**
 * Journal bridge — same BlogCard language as /blog.
 */
export default function BlogPreview({
  title,
  intro,
  ctaLabel,
  ctaHref,
  readLabel,
  posts,
}: BlogPreviewProps) {
  if (posts.length === 0) return null;

  const shown = posts.slice(0, 3);

  return (
    <section className="border-t border-white/[0.05] bg-[#0a0e0d] py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-12">
        <ScrollReveal>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl space-y-4">
              <h2 className="font-semibold tracking-tight text-text-primary text-[clamp(1.75rem,3.5vw,2.5rem)]">
                {title}
              </h2>
              <p className="text-sm leading-relaxed text-text-muted md:text-base">
                {intro}
              </p>
            </div>
            <Link
              href={ctaHref}
              className="shrink-0 text-xs font-semibold uppercase tracking-[0.22em] text-accent-gold transition hover:text-accent-gold/85"
            >
              {ctaLabel}
            </Link>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-10">
          {shown.map((post, i) => (
            <ScrollReveal key={post.href} delayMs={i * 80}>
              <BlogCard
                href={post.href}
                title={post.title}
                excerpt={post.excerpt}
                image={post.image}
                ctaLabel={readLabel}
                size={i === 0 ? "lg" : "md"}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
