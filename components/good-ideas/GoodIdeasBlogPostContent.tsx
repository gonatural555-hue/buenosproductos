"use client";

import Link from "next/link";
import SmartImage from "@/components/SmartImage";

type Section = {
  heading?: string;
  paragraphs: string[];
  image?: string;
};

type Props = {
  intro?: string;
  sections?: Section[];
  closing?: string;
  locale?: string;
  productHref?: string;
  productCtaLabel?: string;
};

export default function GoodIdeasBlogPostContent({
  intro = "",
  sections = [],
  closing = "",
  locale = "",
  productHref,
  productCtaLabel,
}: Props) {
  const resolveLocale = (text: string) =>
    text.replaceAll("{{locale}}", locale);

  const renderParagraph = (paragraph: string) => {
    const content = resolveLocale(paragraph);
    if (content.includes("<a ")) {
      return <span dangerouslySetInnerHTML={{ __html: content }} />;
    }
    return content;
  };

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-[calc(1315px+4rem)] px-8">
        <div className="mx-auto max-w-[1315px] lg:max-w-3xl lg:px-0">
          {intro ? (
            <p className="font-body text-lg leading-relaxed text-[#737373] md:text-xl">
              {resolveLocale(intro)}
            </p>
          ) : null}

          <div className="mt-10 space-y-10 md:space-y-12">
            {sections.map((block, index) => (
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
                {block.image ? (
                  <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-[#E5E5E5] bg-[#FAFAFA]">
                    <SmartImage
                      src={block.image}
                      alt={block.heading || "Article image"}
                      fill
                      loading="lazy"
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 768px"
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          {closing ? (
            <p className="mt-12 font-body text-base leading-relaxed text-[#737373] md:text-lg">
              {resolveLocale(closing)}
            </p>
          ) : null}

          {productHref && productCtaLabel ? (
            <div className="mt-10">
              <Link
                href={productHref}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#111111] px-8 font-body text-sm font-semibold text-white transition hover:bg-[#333333]"
              >
                {productCtaLabel}
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
