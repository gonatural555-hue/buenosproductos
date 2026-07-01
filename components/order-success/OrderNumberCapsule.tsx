"use client";

import { useCallback, useState } from "react";

type Props = {
  orderId: string;
  label: string;
  copyLabel: string;
  copiedLabel: string;
};

export default function OrderNumberCapsule({
  orderId,
  label,
  copyLabel,
  copiedLabel,
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [orderId]);

  return (
    <div className="gi-os-animate-in gi-os-delay-1 -mt-2 px-0 pb-8 md:pb-10">
      <div className="mx-auto flex max-w-[640px] flex-col gap-4 rounded-[18px] border border-[#ECECEC] bg-[#FAFAFA] p-5 shadow-[0_4px_18px_rgba(0,0,0,0.04)] sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
        <div className="min-w-0 text-left">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">
            {label}
          </p>
          <p className="mt-1.5 break-all font-mono text-[15px] font-semibold text-[#111111] sm:text-base">
            {orderId}
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-[12px] border border-[#E5E5E5] bg-white px-5 font-body text-sm font-semibold text-[#111111] transition-colors duration-200 hover:border-[#D1D5DB] hover:bg-[#FAFAFA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]/15"
        >
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
    </div>
  );
}
