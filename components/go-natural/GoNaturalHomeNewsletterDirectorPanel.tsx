"use client";

import { useCallback, useState } from "react";
import {
  DEFAULT_HOME_NEWSLETTER_BLOCK_LAYOUT,
  HOME_NEWSLETTER_LAYOUT_ELEMENT_LABELS,
  type HomeNewsletterBlockLayout,
  type HomeNewsletterLayoutElementId,
  saveHomeNewsletterBlockLayout,
} from "@/lib/newsletter-home-modal-layout";

type Props = {
  layout: HomeNewsletterBlockLayout;
  onChange: (layout: HomeNewsletterBlockLayout) => void;
};

const SLIDER_MIN = -320;
const SLIDER_MAX = 320;

const ELEMENT_ORDER: HomeNewsletterLayoutElementId[] = [
  "block",
  "logo",
  "eyebrow",
  "headline",
  "subtitle",
  "form",
  "login",
  "legal",
  "minimize",
];

function OffsetSliders({
  id,
  label,
  offset,
  onPatch,
}: {
  id: HomeNewsletterLayoutElementId;
  label: string;
  offset: { x: number; y: number };
  onPatch: (patch: Partial<{ x: number; y: number }>) => void;
}) {
  return (
    <details className="group rounded-lg border border-white/10 bg-black/20 open:border-[#D9A441]/25">
      <summary className="cursor-pointer list-none px-3 py-2 text-[11px] font-medium text-white/90 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between gap-2">
          <span>{label}</span>
          <span className="font-mono text-[10px] tabular-nums text-white/45">
            {offset.x}, {offset.y}
          </span>
        </span>
      </summary>
      <div className="space-y-2 border-t border-white/8 px-3 py-2">
        <label className="block">
          <span className="mb-0.5 flex justify-between text-[10px] text-white/70">
            <span>X</span>
            <span className="tabular-nums">{offset.x}px</span>
          </span>
          <input
            type="range"
            min={SLIDER_MIN}
            max={SLIDER_MAX}
            step={1}
            value={offset.x}
            onChange={(e) => onPatch({ x: Number(e.target.value) })}
            className="w-full accent-[#D9A441]"
            aria-label={`${label} horizontal`}
          />
        </label>
        <label className="block">
          <span className="mb-0.5 flex justify-between text-[10px] text-white/70">
            <span>Y</span>
            <span className="tabular-nums">{offset.y}px</span>
          </span>
          <input
            type="range"
            min={SLIDER_MIN}
            max={SLIDER_MAX}
            step={1}
            value={offset.y}
            onChange={(e) => onPatch({ y: Number(e.target.value) })}
            className="w-full accent-[#D9A441]"
            aria-label={`${label} vertical`}
          />
        </label>
        <button
          type="button"
          onClick={() => onPatch({ x: 0, y: 0 })}
          className="text-[10px] text-[#D9A441]/90 underline-offset-2 hover:underline"
        >
          Reset {label.toLowerCase()}
        </button>
      </div>
    </details>
  );
}

export default function GoNaturalHomeNewsletterDirectorPanel({
  layout,
  onChange,
}: Props) {
  const [copied, setCopied] = useState(false);

  const updateElement = useCallback(
    (id: HomeNewsletterLayoutElementId, patch: Partial<{ x: number; y: number }>) => {
      const next = {
        ...layout,
        [id]: { ...layout[id], ...patch },
      };
      onChange(next);
      saveHomeNewsletterBlockLayout(next);
    },
    [layout, onChange]
  );

  const handleResetAll = () => {
    const next = { ...DEFAULT_HOME_NEWSLETTER_BLOCK_LAYOUT };
    onChange(next);
    saveHomeNewsletterBlockLayout(next);
  };

  const handleCopy = async () => {
    const payload = JSON.stringify(layout, null, 2);
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <aside
      className="fixed bottom-4 right-4 z-[80] flex max-h-[min(88dvh,720px)] w-[min(100vw-2rem,340px)] flex-col rounded-xl border border-white/15 bg-[rgba(18,22,26,0.94)] font-inter text-xs text-white shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md"
      aria-label="Director — posición de elementos newsletter"
    >
      <div className="shrink-0 border-b border-white/10 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#D9A441]">
          Director
        </p>
        <p className="mt-1 text-[11px] leading-snug text-white/65">
          Mové cada elemento por separado. Se guarda en localStorage.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleResetAll}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-[11px] font-medium text-white/85 transition hover:bg-white/10"
          >
            Reset todo
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-lg border border-[#D9A441]/40 bg-[#D9A441]/15 px-3 py-1.5 text-[11px] font-medium text-[#F4EBDD] transition hover:bg-[#D9A441]/25"
          >
            {copied ? "Copiado" : "Copiar JSON"}
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {ELEMENT_ORDER.map((id) => (
          <OffsetSliders
            key={id}
            id={id}
            label={HOME_NEWSLETTER_LAYOUT_ELEMENT_LABELS[id]}
            offset={layout[id]}
            onPatch={(patch) => updateElement(id, patch)}
          />
        ))}
      </div>
    </aside>
  );
}
