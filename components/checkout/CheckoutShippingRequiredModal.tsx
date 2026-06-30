"use client";

import { useEffect } from "react";

type Props = {
  open: boolean;
  title: string;
  body: string;
  closeLabel: string;
  actionLabel?: string;
  onClose: () => void;
  onAction?: () => void;
};

export default function CheckoutShippingRequiredModal({
  open,
  title,
  body,
  closeLabel,
  actionLabel,
  onClose,
  onAction,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label={closeLabel}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-shipping-required-title"
        className="relative w-full max-w-sm rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-xl"
      >
        <h2
          id="checkout-shipping-required-title"
          className="font-body text-lg font-semibold text-[#111]"
        >
          {title}
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-[#737373]">
          {body}
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          {actionLabel && onAction ? (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#111] px-5 font-body text-sm font-semibold text-white transition hover:bg-[#333]"
            >
              {actionLabel}
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#DEDEDE] px-5 font-body text-sm font-semibold text-[#111] transition hover:bg-[#F5F5F5]"
          >
            {closeLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
