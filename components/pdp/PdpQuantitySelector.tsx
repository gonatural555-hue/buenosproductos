"use client";

import type { UISurface } from "@/lib/ui-surface";

type Props = {
  value: number;
  onChange: (next: number) => void;
  label: string;
  surface?: UISurface;
  min?: number;
  max?: number;
};

export default function PdpQuantitySelector({
  value,
  onChange,
  label,
  surface = "light",
  min = 1,
  max = 99,
}: Props) {
  const L = surface === "light";

  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  const btnBase =
    "flex h-10 w-10 items-center justify-center text-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gn-forest/40 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <section className="space-y-2.5">
      <h3
        className={
          L
            ? "text-xs font-semibold uppercase tracking-[0.14em] text-neutral-600"
            : "text-xs font-semibold uppercase tracking-[0.14em] text-text-muted"
        }
      >
        {label}
      </h3>
      <div
        className={
          L
            ? "inline-flex items-center overflow-hidden rounded-md border border-neutral-300 bg-white"
            : "inline-flex items-center overflow-hidden rounded-md border border-white/20 bg-dark-surface/50"
        }
        role="group"
        aria-label={label}
      >
        <button
          type="button"
          onClick={dec}
          disabled={value <= min}
          className={`${btnBase} ${L ? "text-neutral-800 hover:bg-neutral-100" : "text-text-primary hover:bg-white/10"}`}
          aria-label="Disminuir cantidad"
        >
          −
        </button>
        <span
          className={
            L
              ? "min-w-[2.75rem] px-2 text-center text-sm font-semibold tabular-nums text-neutral-900"
              : "min-w-[2.75rem] px-2 text-center text-sm font-semibold tabular-nums text-text-primary"
          }
          aria-live="polite"
        >
          {value}
        </span>
        <button
          type="button"
          onClick={inc}
          disabled={value >= max}
          className={`${btnBase} ${L ? "text-neutral-800 hover:bg-neutral-100" : "text-text-primary hover:bg-white/10"}`}
          aria-label="Aumentar cantidad"
        >
          +
        </button>
      </div>
    </section>
  );
}
