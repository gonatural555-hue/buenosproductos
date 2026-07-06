"use client";

import Link from "next/link";
import SmartImage from "@/components/SmartImage";
import type {
  GoodIdeasBlogFaqItem,
  GoodIdeasBlogSection,
  GoodIdeasBlogTable,
} from "@/lib/good-ideas-blog";
import { GI_BLOG_ARTICLE_CONTENT_ID } from "@/lib/ui/goodideas-design";

type Props = {
  intro?: string;
  sections?: GoodIdeasBlogSection[];
  closing?: string;
  locale?: string;
  productHref?: string;
  productCtaLabel?: string;
  introCtaLabel?: string;
};

function resolveTokens(text: string, locale: string, productHref?: string) {
  return text
    .replaceAll("{{locale}}", locale)
    .replaceAll("{{productHref}}", productHref ?? "#");
}

function hasInlineHtml(content: string) {
  return /<[a-z][\s\S]*>/i.test(content);
}

function BlogCtaButton({
  label,
  href,
}: {
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#111111] px-8 font-body text-sm font-semibold text-white transition hover:bg-[#333333]"
    >
      {label}
    </Link>
  );
}

function BlogComparisonTable({ table }: { table: GoodIdeasBlogTable }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#E5E5E5]">
      <table className="min-w-full border-collapse text-left font-body text-sm md:text-[15px]">
        <thead className="bg-[#FAFAFA]">
          <tr>
            {table.headers.map((header) => (
              <th
                key={header}
                className="border-b border-[#E5E5E5] px-4 py-3 font-semibold text-[#111111] md:px-5"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-[#ECECEC] last:border-b-0">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`px-4 py-3 align-top text-[#737373] md:px-5 ${
                    cellIndex === 1 ? "whitespace-nowrap font-semibold text-[#111111]" : ""
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {table.caption ? (
        <p className="border-t border-[#ECECEC] px-4 py-3 text-xs leading-relaxed text-[#9CA3AF] md:px-5">
          {table.caption}
        </p>
      ) : null}
    </div>
  );
}

function BlogFaqList({ items }: { items: GoodIdeasBlogFaqItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.question}
          className="rounded-2xl border border-[#ECECEC] bg-[#FAFAFA] px-5 py-4 md:px-6 md:py-5"
        >
          <h3 className="font-display text-lg font-semibold tracking-[-0.02em] text-[#111111] md:text-xl">
            {item.question}
          </h3>
          <p className="mt-2 font-body text-base leading-relaxed text-[#737373] md:text-[17px]">
            {item.answer}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function GoodIdeasBlogPostContent({
  intro = "",
  sections = [],
  closing = "",
  locale = "",
  productHref,
  productCtaLabel,
  introCtaLabel,
}: Props) {
  const renderParagraph = (paragraph: string) => {
    const content = resolveTokens(paragraph, locale, productHref);
    if (hasInlineHtml(content)) {
      return <span dangerouslySetInnerHTML={{ __html: content }} />;
    }
    return content;
  };

  const defaultCtaHref = productHref ?? "#";

  return (
    <section id={GI_BLOG_ARTICLE_CONTENT_ID} className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-[calc(1315px+4rem)] px-8">
        <div className="mx-auto max-w-[1315px] lg:max-w-3xl lg:px-0">
          {intro ? (
            <p className="font-body text-lg leading-relaxed text-[#737373] md:text-xl">
              {resolveTokens(intro, locale, productHref)}
            </p>
          ) : null}

          {introCtaLabel && productHref ? (
            <div className="mt-8">
              <BlogCtaButton label={introCtaLabel} href={defaultCtaHref} />
            </div>
          ) : null}

          <div className="mt-10 space-y-10 md:space-y-12">
            {sections.map((block, index) => {
              const imageFit = block.imageFit ?? "cover";
              const imageAspect = block.imageAspect ?? "aspect-[16/9]";

              return (
                <div key={index} className="space-y-5">
                  {block.heading ? (
                    <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] text-[#111111] md:text-3xl">
                      {block.heading}
                    </h2>
                  ) : null}
                  <div className="space-y-4">
                    {block.paragraphs.map((paragraph, paragraphIndex) => (
                      <p
                        key={paragraphIndex}
                        className="font-body text-base leading-relaxed text-[#737373] md:text-lg"
                      >
                        {renderParagraph(paragraph)}
                      </p>
                    ))}
                  </div>

                  {block.table ? <BlogComparisonTable table={block.table} /> : null}

                  {block.faq ? <BlogFaqList items={block.faq} /> : null}

                  {block.image ? (
                    <div
                      className={`relative overflow-hidden rounded-2xl border border-[#E5E5E5] bg-[#FAFAFA] ${imageAspect}`}
                    >
                      <SmartImage
                        src={block.image}
                        alt={block.heading || "Article image"}
                        fill
                        loading="lazy"
                        className={
                          imageFit === "contain"
                            ? "object-contain object-center p-4 md:p-8"
                            : "object-cover object-center"
                        }
                        sizes="(max-width: 768px) 100vw, 768px"
                      />
                    </div>
                  ) : null}

                  {block.legalNote ? (
                    <p className="font-body text-xs leading-relaxed text-[#9CA3AF] md:text-sm">
                      {block.legalNote}
                    </p>
                  ) : null}

                  {block.cta?.label ? (
                    <div>
                      <BlogCtaButton
                        label={block.cta.label}
                        href={resolveTokens(block.cta.href ?? defaultCtaHref, locale, productHref)}
                      />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          {closing ? (
            <p className="mt-12 font-body text-base leading-relaxed text-[#737373] md:text-lg">
              {resolveTokens(closing, locale, productHref)}
            </p>
          ) : null}

          {productHref && productCtaLabel ? (
            <div className="mt-10">
              <BlogCtaButton label={productCtaLabel} href={defaultCtaHref} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
