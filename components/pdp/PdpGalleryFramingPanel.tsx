"use client";

import { useCallback, useState } from "react";
import {
  clearPdpGalleryFramingDraft,
  createEmptyPdpGalleryLayout,
  normalizePdpGalleryLayout,
  resolvePdpImageFraming,
  savePdpGalleryFramingDraft,
  type PdpGalleryLayout,
} from "@/lib/pdp-gallery-framing";

type Props = {
  productId: string;
  imageCount: number;
  layout: PdpGalleryLayout;
  onChange: (layout: PdpGalleryLayout) => void;
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
};

function SliderRow({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  suffix = "",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="mb-0.5 flex justify-between text-[10px] text-white/70">
        <span>{label}</span>
        <span className="tabular-nums">
          {step < 1 ? value.toFixed(2) : value}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#D9A441]"
      />
    </label>
  );
}

export default function PdpGalleryFramingPanel({
  productId,
  imageCount,
  layout,
  onChange,
  selectedIndex,
  onSelectIndex,
}: Props) {
  const [copied, setCopied] = useState(false);
  const normalized = normalizePdpGalleryLayout(layout);
  const framing = resolvePdpImageFraming(normalized, selectedIndex);
  const indexKey = String(selectedIndex);

  const persist = useCallback(
    (next: PdpGalleryLayout) => {
      const merged = normalizePdpGalleryLayout(next);
      onChange(merged);
      savePdpGalleryFramingDraft(productId, merged);
    },
    [onChange, productId]
  );

  const updateIndexField = useCallback(
    (field: "scale" | "positionX" | "positionY", value: number) => {
      const next = normalizePdpGalleryLayout(layout);
      const current = next.byIndex?.[indexKey] ?? {};
      next.byIndex = {
        ...next.byIndex,
        [indexKey]: { ...current, [field]: value },
      };
      persist(next);
    },
    [indexKey, layout, persist]
  );

  const resetImage = () => {
    const next = normalizePdpGalleryLayout(layout);
    if (next.byIndex) {
      const { [indexKey]: _removed, ...rest } = next.byIndex;
      next.byIndex = rest;
    }
    persist(next);
  };

  const resetAll = () => {
    onChange(createEmptyPdpGalleryLayout());
    clearPdpGalleryFramingDraft(productId);
  };

  const handleCopy = async () => {
    const payload = JSON.stringify(
      { pdpGalleryLayout: normalizePdpGalleryLayout(layout) },
      null,
      2
    );
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
      className="fixed bottom-4 right-4 z-[85] flex max-h-[min(70dvh,420px)] w-[min(100vw-2rem,300px)] flex-col rounded-xl border border-white/15 bg-[rgba(18,22,26,0.94)] font-inter text-xs text-white shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md"
      aria-label="Debug — encuadre imágenes PDP"
    >
      <div className="shrink-0 border-b border-white/10 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#D9A441]">
          Encuadre imagen
        </p>
        <p className="mt-1 text-[11px] leading-snug text-white/65">
          Scale y posición X/Y. Copiá el JSON a{" "}
          <span className="font-mono text-white/80">scripts/products/{productId}.json</span>
        </p>
        <p className="mt-1 font-mono text-[10px] text-white/40">?pdpLayout=true</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={resetAll}
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

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
        <label className="block">
          <span className="mb-1 block text-[10px] text-white/70">Imagen</span>
          <select
            value={selectedIndex}
            onChange={(e) => onSelectIndex(Number(e.target.value))}
            className="w-full rounded-md border border-white/15 bg-black/30 px-2 py-1.5 text-[11px] text-white"
          >
            {Array.from({ length: Math.max(1, imageCount) }).map((_, i) => (
              <option key={i} value={i}>
                {i === 0 ? "Principal (#0)" : `Galería #${i}`}
              </option>
            ))}
          </select>
        </label>

        <SliderRow
          label="Scale"
          value={framing.scale}
          min={0.25}
          max={2}
          step={0.01}
          onChange={(v) => updateIndexField("scale", v)}
        />
        <SliderRow
          label="Position X"
          value={framing.positionX}
          min={0}
          max={100}
          onChange={(v) => updateIndexField("positionX", v)}
          suffix="%"
        />
        <SliderRow
          label="Position Y"
          value={framing.positionY}
          min={0}
          max={100}
          onChange={(v) => updateIndexField("positionY", v)}
          suffix="%"
        />

        <button
          type="button"
          onClick={resetImage}
          className="text-[10px] text-[#D9A441]/90 underline-offset-2 hover:underline"
        >
          Reset imagen #{selectedIndex}
        </button>
      </div>
    </aside>
  );
}
