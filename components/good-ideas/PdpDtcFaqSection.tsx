"use client";

import { useId, useState } from "react";
import PdpRichText from "@/components/pdp/PdpRichText";
import type { PdpFaqItem } from "@/lib/good-ideas-pdp-content";
import { GI_DTC } from "@/lib/ui/gi-pdp-dtc";

type Props = {
  title: string;
  items: PdpFaqItem[];
};

export default function PdpDtcFaqSection({ title, items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  if (items.length === 0) return null;

  return (
    <section className={`${GI_DTC.sectionPad} border-t border-[#E5E7EB] bg-white`}>
      <div className={GI_DTC.container}>
        <h2 className="font-body text-xl font-bold text-[#111111] sm:text-2xl">
          {title}
        </h2>
        <div className="mt-8 divide-y divide-[#E5E7EB] border-y border-[#E5E7EB]">
          {items.map((item, index) => {
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
                    className="flex w-full items-center justify-between gap-4 py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#111111]/20 sm:py-6"
                  >
                    <span className="font-body text-base font-semibold text-[#111111]">
                      {item.question}
                    </span>
                    <span className="shrink-0 text-[#6B7280]" aria-hidden>
                      {open ? "−" : "+"}
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  hidden={!open}
                  className="pb-5 sm:pb-6"
                >
                  <PdpRichText
                    text={item.answer}
                    className="!text-[#6B7280] [&_strong]:!text-[#111111] [&_a]:!text-[#111111]"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
