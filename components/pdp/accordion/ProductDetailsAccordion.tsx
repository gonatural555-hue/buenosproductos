"use client";

import PdpRichText from "@/components/pdp/PdpRichText";
import { PdpPremiumAccordion } from "@/components/pdp/accordion/PdpPremiumAccordion";
import type { PdpProductDetailsContent } from "@/lib/good-ideas-pdp-content";

type Props = {
  title: string;
  content: PdpProductDetailsContent;
};

function SectionHeading({ children }: { children: string }) {
  return (
    <h4 className="font-body text-sm font-semibold uppercase tracking-[0.1em] text-[rgba(232,236,241,0.55)]">
      {children}
    </h4>
  );
}

function ProductDetailsBody({ content }: { content: PdpProductDetailsContent }) {
  return (
    <div className="space-y-8">
      {content.sections.map((section) => (
        <div key={section.id} className="space-y-3">
          {section.heading ? (
            <SectionHeading>{section.heading}</SectionHeading>
          ) : null}

          {section.paragraphs?.map((paragraph) => (
            <PdpRichText key={paragraph} text={paragraph} />
          ))}

          {section.bullets && section.bullets.length > 0 ? (
            <ul className="space-y-2.5">
              {section.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2.5">
                  <span
                    aria-hidden
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3B82F6]"
                  />
                  <PdpRichText as="div" text={bullet} className="flex-1" />
                </li>
              ))}
            </ul>
          ) : null}

          {section.tags && section.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {section.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex rounded-md border border-white/[0.1] bg-[#151B24] px-2.5 py-1 font-body text-sm font-medium text-[rgba(232,236,241,0.82)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {section.specRows && section.specRows.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-white/[0.08]">
              <table className="w-full border-collapse text-left">
                <tbody>
                  {section.specRows.map((row, index) => (
                    <tr
                      key={`${row.label}-${index}`}
                      className={
                        index % 2 === 0
                          ? "bg-[#151B24]"
                          : "bg-[#0B0F14]/60"
                      }
                    >
                      <th
                        scope="row"
                        className="w-[38%] px-4 py-3.5 font-body text-[15px] font-medium text-[#E8ECF1] sm:w-[42%]"
                      >
                        {row.label}
                      </th>
                      <td className="px-4 py-3.5 font-body text-[15px] leading-relaxed text-[rgba(232,236,241,0.72)]">
                        <PdpRichText as="div" text={row.value} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default function ProductDetailsAccordion({ title, content }: Props) {
  if (!content.hasContent) return null;

  return (
    <PdpPremiumAccordion id="product-details" title={title}>
      <ProductDetailsBody content={content} />
    </PdpPremiumAccordion>
  );
}
