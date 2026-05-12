import Link from "next/link";
import type { BlogSection } from "@/lib/blog-sections";

type BlogCategoryLayoutProps = {
  section: BlogSection;
  locale: string;
  posts: { href: string; title: string; excerpt: string }[];
  backLabel: string;
};

export default function BlogCategoryLayout({
  section,
  locale,
  posts,
  backLabel,
}: BlogCategoryLayoutProps) {
  return (
    <main className="bg-dark-base">
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-gold/95">
            Blog
          </p>
          <h1 className="font-sans mt-4 text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
            {section.title}
          </h1>
        </div>
      </section>

      <section className="pb-10 md:pb-12">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16 space-y-5">
          {section.manifesto.map((line, index) =>
            line ? (
              <p
                key={`${section.slug}-line-${index}`}
                className="text-base leading-relaxed text-white/[0.86] md:text-lg"
              >
                {line}
              </p>
            ) : (
              <div key={`${section.slug}-spacer-${index}`} className="h-3" />
            )
          )}
        </div>
      </section>

      <section className="pb-12 md:pb-16">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
          <h2 className="sr-only">Subtopics</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {section.subtopics.map((subtopic) => (
              <div
                key={subtopic.slug}
                id={subtopic.slug}
                className="scroll-mt-28 rounded-sm border border-white/[0.1] bg-[#0f1412]/70 px-5 py-4 backdrop-blur-[2px] transition-colors duration-200 hover:border-white/[0.16]"
              >
                <p className="text-sm font-semibold text-text-primary">
                  {subtopic.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
          <h2 className="sr-only">Posts</h2>
          <div className="space-y-4">
            {posts.map((post) => (
              <Link
                key={post.href}
                href={post.href}
                className="block rounded-sm border border-white/[0.1] bg-[#0f1412]/70 px-5 py-4 backdrop-blur-[2px] transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-gold/40 hover:shadow-[0_12px_32px_-16px_rgba(0,0,0,0.45)]"
              >
                <p className="text-base font-semibold text-text-primary">
                  {post.title}
                </p>
                <p className="mt-2 text-sm text-white/[0.78]">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center text-sm text-accent-gold transition-colors duration-200 ease-out hover:text-accent-gold/90"
          >
            {backLabel}
          </Link>
        </div>
      </section>
    </main>
  );
}

