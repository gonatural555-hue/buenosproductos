import LegalNav from "@/components/legal/LegalNav";
import { GI_CART_INNER, GI_CART_OUTER, GI_CART_TOP_PAD } from "@/lib/ui/gi-cart-light";
import { giType } from "@/lib/ui/gi-typography";

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

type LegalPageProps = {
  eyebrow?: string;
  title: string;
  intro: string;
  updatedAt?: string;
  sections: LegalSection[];
  closing?: string;
  afterSections?: React.ReactNode;
};

export default function LegalPage({
  eyebrow,
  title,
  intro,
  updatedAt,
  sections,
  closing,
  afterSections,
}: LegalPageProps) {
  return (
    <main className="min-h-full bg-[#0B0F14] text-[#E8ECF1]">
      <div
        className={`relative border-b border-white/[0.08] ${GI_CART_OUTER} ${GI_CART_TOP_PAD}`}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_0%,rgba(59,130,246,0.14),transparent_58%)]"
          aria-hidden
        />
        <div className={`relative ${GI_CART_INNER}`}>
          {eyebrow ? (
            <p className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-[#3B82F6]">
              {eyebrow}
            </p>
          ) : null}
          <h1 className={`mt-3 ${giType.pageTitle} text-[#E8ECF1]`}>{title}</h1>
          <p className="mt-4 max-w-2xl font-body text-base leading-relaxed text-[#A8B0BC] md:text-lg">
            {intro}
          </p>
          {updatedAt ? (
            <p className="mt-4 font-body text-sm text-[#737373]">{updatedAt}</p>
          ) : null}
          <LegalNav />
        </div>
      </div>

      <div className={`${GI_CART_OUTER} pb-20 pt-10 md:pt-14`}>
        <div className={`${GI_CART_INNER} max-w-[880px]`}>
          <div className="space-y-10 md:space-y-12">
            {sections.map((section, index) => (
              <section
                key={`${section.title}-${index}`}
                className="border-l-2 border-[#3B82F6]/50 pl-5 md:pl-6"
              >
                <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-[#E8ECF1] md:text-2xl">
                  {section.title}
                </h2>

                {section.paragraphs?.length ? (
                  <div className="mt-4 space-y-3">
                    {section.paragraphs.map((paragraph, paragraphIndex) => (
                      <p
                        key={`${section.title}-p-${paragraphIndex}`}
                        className="font-body text-sm leading-relaxed text-[#C5CAD3] md:text-base"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : null}

                {section.bullets?.length ? (
                  <ul className="mt-4 list-disc space-y-2 pl-5 marker:text-[#3B82F6]">
                    {section.bullets.map((bullet, bulletIndex) => (
                      <li
                        key={`${section.title}-b-${bulletIndex}`}
                        className="font-body text-sm leading-relaxed text-[#C5CAD3] md:text-base"
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          {afterSections ? <div className="mt-12">{afterSections}</div> : null}

          {closing ? (
            <p className="mt-12 border-t border-white/[0.08] pt-8 font-body text-sm leading-relaxed text-[#737373] md:text-base">
              {closing}
            </p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
