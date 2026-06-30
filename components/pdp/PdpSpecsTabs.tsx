"use client";

import { useState } from "react";
import type { SpecRow } from "@/lib/pdp-spec-rows";
import type { UISurface } from "@/lib/ui-surface";

type TabId = "specs" | "details";

type Props = {
  specsTitle: string;
  detailsTitle: string;
  specRows: SpecRow[];
  idealForLabel?: string;
  idealForTags?: string[];
  paragraphs: string[];
  surface?: UISurface;
  embedded?: boolean;
  withTopDivider?: boolean;
  /** `gi`: sin max-width propio; el padre debe usar `GI_PDP_INNER`. */
  contentLayout?: "default" | "gi";
};

function tabButtonClass(L: boolean, active: boolean) {
  const base =
    "shrink-0 border-b-2 px-1 pb-3 pt-1 font-inter text-[13px] font-semibold tracking-wide transition-colors duration-200";
  if (active) {
    return L
      ? `${base} border-[#3B82F6] text-neutral-900`
      : `${base} border-[#3B82F6] text-[#E8ECF1]`;
  }
  return L
    ? `${base} border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-800`
    : `${base} border-transparent text-[rgba(232,236,241,0.55)] hover:border-white/20 hover:text-[#60A5FA]`;
}

function tableShellClass(L: boolean) {
  return L
    ? "overflow-hidden rounded-xl border border-neutral-200/90"
    : "overflow-hidden rounded-xl border border-white/[0.08]";
}

function tableRowClass(L: boolean, index: number) {
  const hover = L
    ? "transition-colors hover:bg-neutral-50/90"
    : "transition-colors hover:bg-white/[0.03]";
  if (index % 2 === 0) {
    return L ? `bg-white ${hover}` : `bg-[#151B24] ${hover}`;
  }
  return L ? `bg-neutral-50/80 ${hover}` : `bg-[#0B0F14]/60 ${hover}`;
}

function tableLabelClass(L: boolean) {
  return L
    ? "w-[38%] px-4 py-3.5 text-[14px] font-medium text-neutral-800 sm:w-[42%]"
    : "w-[38%] px-4 py-3.5 text-[14px] font-medium text-[#E8ECF1] sm:w-[42%]";
}

function tableValueClass(L: boolean) {
  return L
    ? "px-4 py-3.5 text-[15px] leading-relaxed text-neutral-600"
    : "px-4 py-3.5 text-[15px] leading-relaxed text-[rgba(232,236,241,0.72)]";
}

function paragraphClass(L: boolean) {
  return L
    ? "text-[15px] leading-relaxed text-neutral-700"
    : "text-[15px] leading-relaxed text-[rgba(232,236,241,0.82)]";
}

function chipClass(L: boolean) {
  return L
    ? "inline-flex rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-[13px] font-medium text-neutral-700 transition-colors hover:border-[#3B82F6]/35 hover:text-[#2563EB]"
    : "inline-flex rounded-md border border-white/[0.1] bg-[#151B24] px-2.5 py-1 text-[13px] font-medium text-[rgba(232,236,241,0.82)] transition-colors hover:border-[#3B82F6]/45 hover:text-[#60A5FA]";
}

export default function PdpSpecsTabs({
  specsTitle,
  detailsTitle,
  specRows,
  idealForLabel,
  idealForTags = [],
  paragraphs,
  surface = "dark",
  embedded = false,
  withTopDivider = false,
  contentLayout = "default",
}: Props) {
  const L = surface === "light";
  const hasSpecs = specRows.length > 0;
  const hasDetails = paragraphs.length > 0 || idealForTags.length > 0;

  const defaultTab: TabId = hasSpecs ? "specs" : "details";
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab);

  if (!hasSpecs && !hasDetails) return null;

  const tabs = (
    [
      { id: "specs" as const, label: specsTitle, visible: hasSpecs },
      { id: "details" as const, label: detailsTitle, visible: hasDetails },
    ] as const
  ).filter((tab) => tab.visible);

  const resolvedTab = tabs.some((t) => t.id === activeTab)
    ? activeTab
    : (tabs[0]?.id ?? "specs");

  const innerClass =
    contentLayout === "gi"
      ? "w-full"
      : "mx-auto max-w-4xl px-6 sm:px-10 lg:px-16";

  const panel = (
    <div className={innerClass}>
      <div
        role="tablist"
        aria-label={specsTitle}
        className={[
          "-mx-1 flex gap-6 overflow-x-auto px-1 scrollbar-none sm:gap-8",
          L ? "border-b border-neutral-200/90" : "border-b border-white/[0.08]",
        ].join(" ")}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`pdp-tab-${tab.id}`}
            aria-selected={resolvedTab === tab.id}
            aria-controls={`pdp-panel-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={tabButtonClass(L, resolvedTab === tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {resolvedTab === "specs" && hasSpecs ? (
        <div
          role="tabpanel"
          id="pdp-panel-specs"
          aria-labelledby="pdp-tab-specs"
          className="pt-6"
        >
          <div className={tableShellClass(L)}>
            <table className="w-full border-collapse text-left">
              <tbody>
                {specRows.map((row, index) => (
                  <tr
                    key={`${row.label}-${index}`}
                    className={tableRowClass(L, index)}
                  >
                    <th scope="row" className={tableLabelClass(L)}>
                      {row.label}
                    </th>
                    <td className={tableValueClass(L)}>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {resolvedTab === "details" && hasDetails ? (
        <div
          role="tabpanel"
          id="pdp-panel-details"
          aria-labelledby="pdp-tab-details"
          className="space-y-5 pt-6"
        >
          {idealForTags.length > 0 ? (
            <div className="space-y-2.5">
              {idealForLabel ? (
                <p
                  className={
                    L
                      ? "text-[13px] font-semibold uppercase tracking-[0.12em] text-neutral-500"
                      : "text-[13px] font-semibold uppercase tracking-[0.12em] text-[rgba(232,236,241,0.5)]"
                  }
                >
                  {idealForLabel}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                {idealForTags.map((tag) => (
                  <span key={tag} className={chipClass(L)}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {paragraphs.map((paragraph) => (
            <p key={paragraph} className={paragraphClass(L)}>
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );

  if (embedded) {
    return (
      <div
        aria-label={specsTitle}
        className={withTopDivider ? "pt-10 md:pt-12" : undefined}
      >
        {panel}
      </div>
    );
  }

  return (
    <section className="pb-16 md:pb-20" aria-label={specsTitle}>
      {panel}
    </section>
  );
}
