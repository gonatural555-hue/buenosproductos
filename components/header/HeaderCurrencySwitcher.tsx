"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "@/components/i18n/LocaleProvider";
import { useCurrency } from "@/context/CurrencyContext";
import { giType } from "@/lib/ui/gi-typography";
import { currencies, type DisplayCurrency } from "@/lib/currency/config";

type Variant = "utility" | "good-ideas" | "light";

type Props = {
  variant?: Variant;
  /** Solo muestra la divisa activa; al tocar abre dropdown. */
  compact?: boolean;
};

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CompactCurrencySwitcher({ variant }: { variant: Variant }) {
  const t = useTranslations();
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const light = variant === "light";

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [close, open]);

  const triggerClass = light
    ? "flex h-11 min-w-[4.25rem] items-center justify-center gap-1 rounded-full border border-[#E5E7EB] bg-[#F2F2F2] px-3 font-body text-xs font-semibold text-[#0B0F14] transition hover:border-[#D1D5DB]"
    : "flex h-11 min-w-[4.25rem] items-center justify-center gap-1 rounded-full border border-white/15 bg-white/[0.08] px-3 font-body text-xs font-semibold text-white transition hover:border-white/25";

  const panelClass = light
    ? "absolute right-0 top-[calc(100%+0.35rem)] z-[70] min-w-[7rem] overflow-hidden rounded-xl border border-[#E5E7EB] bg-white py-1 shadow-[0_12px_32px_rgba(15,23,42,0.12)]"
    : "absolute right-0 top-[calc(100%+0.35rem)] z-[70] min-w-[7rem] overflow-hidden rounded-xl border border-white/10 bg-[#151B24] py-1 shadow-[0_12px_32px_rgba(0,0,0,0.45)]";

  const optionClass = (active: boolean) =>
    light
      ? `block w-full px-3 py-2.5 text-left font-body text-sm transition ${
          active
            ? "bg-[#F3F4F6] font-semibold text-[#3B82F6]"
            : "text-[#374151] hover:bg-[#F9FAFB] hover:text-[#3B82F6]"
        }`
      : `block w-full px-3 py-2.5 text-left font-body text-sm transition ${
          active
            ? "bg-white/[0.08] font-semibold text-[#3B82F6]"
            : "text-[#E8ECF1] hover:bg-white/[0.06] hover:text-[#3B82F6]"
        }`;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className={triggerClass}
        aria-label={t("header.currencyNavAria")}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{currency}</span>
        <ChevronDown className="h-3.5 w-3.5 opacity-70" />
      </button>

      {open ? (
        <div id={listId} role="listbox" aria-label={t("header.currencyNavAria")} className={panelClass}>
          {currencies.map((code) => (
            <button
              key={code}
              type="button"
              role="option"
              aria-selected={code === currency}
              className={optionClass(code === currency)}
              onClick={() => {
                setCurrency(code as DisplayCurrency);
                close();
              }}
            >
              {code}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function HeaderCurrencySwitcher({
  variant = "utility",
  compact = false,
}: Props) {
  const t = useTranslations();
  const { currency, setCurrency } = useCurrency();

  if (compact) {
    return <CompactCurrencySwitcher variant={variant} />;
  }

  if (variant === "light") {
    return (
      <nav
        className="flex items-center gap-0.5 rounded-full border border-[#E5E7EB] bg-[#F9FAFB] p-0.5"
        aria-label={t("header.currencyNavAria")}
      >
        {currencies.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setCurrency(code)}
            className={`rounded-full px-2.5 py-1 ${giType.navUtility} ${
              code === currency
                ? "bg-white font-semibold text-[#0B0F14] shadow-sm"
                : "text-[#6B7280] hover:text-[#0B0F14]"
            }`}
            aria-pressed={code === currency}
          >
            {code}
          </button>
        ))}
      </nav>
    );
  }

  if (variant === "good-ideas") {
    return (
      <nav
        className="flex items-center gap-0.5 rounded-full border border-white/10 px-1 py-0.5"
        aria-label={t("header.currencyNavAria")}
      >
        {currencies.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setCurrency(code)}
            className={`rounded-full px-2.5 py-1 ${giType.navUtility} ${
              code === currency
                ? "text-[var(--gi-primary)]"
                : "text-white hover:text-[var(--gi-primary)]"
            }`}
            aria-pressed={code === currency}
          >
            {code}
          </button>
        ))}
      </nav>
    );
  }

  return (
    <nav
      className="gn-rei-utility__currencies"
      aria-label={t("header.currencyNavAria")}
    >
      {currencies.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setCurrency(code as DisplayCurrency)}
          className={`gn-rei-utility__currency${
            code === currency ? " gn-rei-utility__currency--active" : ""
          }`}
          aria-pressed={code === currency}
          title={t(`header.currencies.${code}`)}
        >
          {code}
        </button>
      ))}
    </nav>
  );
}
