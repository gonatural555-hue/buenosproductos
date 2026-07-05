"use client";

import { useId, useState } from "react";
import PdpRichText from "@/components/pdp/PdpRichText";
import { useTranslations } from "@/components/i18n/LocaleProvider";
import type { PdpFaqItem } from "@/lib/good-ideas-pdp-content";
import { GI_DTC } from "@/lib/ui/gi-pdp-dtc";

const FAQ_PREVIEW_COUNT = 3;

type Props = {
  title: string;
  items: PdpFaqItem[];
  /** Sin wrapper de sección — para layout de dos columnas en PDP. */
  embedded?: boolean;
};

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={`h-4 w-4 shrink-0 text-[#9CA3AF] transition-transform duration-200 motion-reduce:transition-none ${
        open ? "rotate-180" : ""
      }`}
      aria-hidden
    >
      <path d="M5 7.5 10 12.5 15 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PdpDtcFaqSection({ title, items, embedded }: Props) {
  const t = useTranslations();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const baseId = useId();

  if (items.length === 0) return null;

  const canExpandList = items.length > FAQ_PREVIEW_COUNT;
  const visibleItems =
    showAll || !canExpandList ? items : items.slice(0, FAQ_PREVIEW_COUNT);

  const sectionTitleClass =
    "font-body text-lg font-semibold tracking-[-0.02em] text-[#111111]";

  const content = (
    <>
      <h2 className={sectionTitleClass}>{title}</h2>
      <div className="mt-5 divide-y divide-[#F3F4F6]">
        {visibleItems.map((item, index) => {
          const open = openIndex === index;
          const panelId = `${baseId}-panel-${index}`;
          const triggerId = `${baseId}-trigger-${index}`;
          return (
            <div key={item.question}>
              <h3>
                <button
                  type="button"
                  id={triggerId}
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() =>
                    setOpenIndex((current) =>
                      current === index ? null : index
                    )
                  }
                  className="flex w-full items-center justify-between gap-3 py-3.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/30 focus-visible:ring-offset-2 motion-reduce:transition-none sm:py-4"
                >
                  <span className="font-body text-sm font-medium leading-snug text-[#111111]">
                    {item.question}
                  </span>
                  <ChevronIcon open={open} />
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                hidden={!open}
                className="pb-3.5 sm:pb-4"
              >
                <PdpRichText
                  text={item.answer}
                  className="!text-sm !leading-snug !text-[#6B7280] [&_strong]:!text-[#111111] [&_a]:!text-[#111111] [&_a]:underline-offset-2 [&_a]:hover:!text-[#3B82F6]"
                />
              </div>
            </div>
          );
        })}
      </div>

      {canExpandList ? (
        <button
          type="button"
          onClick={() => {
            setShowAll((current) => !current);
            setOpenIndex(null);
          }}
          className="mt-4 font-body text-sm font-semibold text-[#111111] underline-offset-4 transition-colors hover:text-[#3B82F6] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/30 focus-visible:ring-offset-2 motion-reduce:transition-none"
          aria-expanded={showAll}
        >
          {showAll
            ? t("goodIdeas.pdp.dtc.faqShowLess", "Ver menos")
            : t("goodIdeas.pdp.dtc.faqShowAll", "Ver todas las preguntas")}
        </button>
      ) : null}
    </>
  );

  if (embedded) return content;

  return (
    <section className={`${GI_DTC.sectionPad} border-t border-[#E5E7EB] bg-white`}>
      <div className={GI_DTC.container}>{content}</div>
    </section>
  );
}
