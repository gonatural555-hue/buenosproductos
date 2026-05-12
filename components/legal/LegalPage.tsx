type LegalSection = {
  title: string;
  paragraphs: string[];
};

type LegalPageProps = {
  title: string;
  intro: string;
  updatedAt?: string;
  sections: LegalSection[];
  closing?: string;
};

export default function LegalPage({
  title,
  intro,
  updatedAt,
  sections,
  closing,
}: LegalPageProps) {
  return (
    <main className="bg-warm-sand">
      <div className="max-w-3xl mx-auto px-6 sm:px-10 lg:px-16 py-16 md:py-20 space-y-12">
        <header className="space-y-5">
          <h1 className="font-sans text-3xl md:text-4xl font-semibold text-text-primary">
            {title}
          </h1>
          <p className="text-base md:text-lg text-text-muted leading-relaxed">
            {intro}
          </p>
          {updatedAt && (
            <p className="text-sm text-text-muted/80">{updatedAt}</p>
          )}
        </header>

        <div className="space-y-10">
          {sections.map((section, index) => (
            <section key={`${section.title}-${index}`} className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-text-primary">
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.paragraphs.map((paragraph, paragraphIndex) => (
                  <p
                    key={`${section.title}-${paragraphIndex}`}
                    className="text-base md:text-lg text-text-muted leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {closing && (
          <p className="text-base md:text-lg text-text-muted leading-relaxed">
            {closing}
          </p>
        )}
      </div>
    </main>
  );
}

