"use client";

import { useState } from "react";
import { useTranslations } from "@/components/i18n/LocaleProvider";
import {
  groupSpecRows,
  needsSpecExpandToggle,
  SPEC_GROUP_I18N_KEYS,
  takeSpecPreviewRows,
  type SpecGroup,
} from "@/lib/pdp-spec-groups";
import type { SpecRow } from "@/lib/pdp-spec-rows";

type Props = {
  title: string;
  rows: SpecRow[];
};

function SpecRowList({ rows }: { rows: SpecRow[] }) {
  return (
    <dl className="divide-y divide-[#F3F4F6]">
      {rows.map((row) => (
        <div
          key={`${row.label}-${row.value}`}
          className="grid gap-0.5 py-3 sm:grid-cols-[minmax(0,132px)_1fr] sm:gap-3"
        >
          <dt className="font-body text-sm font-medium text-[#111111]">
            {row.label}
          </dt>
          <dd className="font-body text-sm leading-snug text-[#6B7280]">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function GroupedSpecRows({
  groups,
  t,
}: {
  groups: SpecGroup[];
  t: (key: string, fallback?: string) => string;
}) {
  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.id}>
          <p className="font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9CA3AF]">
            {t(SPEC_GROUP_I18N_KEYS[group.id], group.id)}
          </p>
          <div className="mt-3">
            <SpecRowList rows={group.rows} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PdpDtcSpecsSection({ title, rows }: Props) {
  const t = useTranslations();
  const [expanded, setExpanded] = useState(false);

  if (rows.length === 0) return null;

  const groups = groupSpecRows(rows);
  const showToggle = needsSpecExpandToggle(rows);
  const previewRows = takeSpecPreviewRows(rows);
  const sectionTitleClass =
    "font-body text-lg font-semibold tracking-[-0.02em] text-[#111111]";

  return (
    <div className="min-w-0">
      <h2 className={sectionTitleClass}>{title}</h2>

      <div className="mt-5">
        {expanded || !showToggle ? (
          <GroupedSpecRows groups={groups} t={t} />
        ) : (
          <SpecRowList rows={previewRows} />
        )}
      </div>

      {showToggle ? (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="mt-4 font-body text-sm font-semibold text-[#111111] underline-offset-4 transition-colors hover:text-[#3B82F6] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/30 focus-visible:ring-offset-2 motion-reduce:transition-none"
          aria-expanded={expanded}
        >
          {expanded
            ? t("goodIdeas.pdp.dtc.specsShowLess", "Ver menos")
            : t("goodIdeas.pdp.dtc.specsShowAll", "Ver todas las especificaciones")}
        </button>
      ) : null}
    </div>
  );
}
