import SmartImage from "@/components/SmartImage";

type BlogPostContentProps = {
  intro?: string;
  sections?: {
    heading?: string;
    paragraphs: string[];
    image?: string;
  }[];
  closing?: string;
  locale?: string;
};

export default function BlogPostContent({
  intro = "",
  sections = [],
  closing = "",
  locale = "",
}: BlogPostContentProps) {
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
    <section className="py-14 md:py-18">
      <div className="max-w-3xl mx-auto px-6 sm:px-10 lg:px-16">
        <p className="text-lg md:text-xl text-text-muted leading-relaxed">
          {resolveLocale(intro)}
        </p>

        <div className="mt-10 space-y-10 md:space-y-12">
          {sections.map((block, index) => (
            <div key={index} className="space-y-5">
              {block.heading && (
                <h2 className="text-2xl md:text-3xl font-semibold text-text-primary">
                  {block.heading}
                </h2>
              )}
              <div className="space-y-4">
                {block.paragraphs.map((paragraph, paragraphIndex) => (
                  <p
                    key={paragraphIndex}
                    className="text-base md:text-lg text-text-muted leading-relaxed"
                  >
                    {renderParagraph(paragraph)}
                  </p>
                ))}
              </div>
              {block.image && (
                <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/10">
                  <SmartImage
                    src={block.image}
                    alt={block.heading || "Journal image"}
                    fill
                    loading="lazy"
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-dark-base/20 via-dark-base/20 to-dark-base/45" />
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="mt-12 text-base md:text-lg text-text-muted leading-relaxed">
          {resolveLocale(closing)}
        </p>
      </div>
    </section>
  );
}

