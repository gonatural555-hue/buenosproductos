"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import {
  formatCartPrice,
  formatCartVariantSummary,
} from "@/lib/cart-formatting";
import type { Locale } from "@/lib/i18n/config";

export type AddedToCartLineSnapshot = {
  title: string;
  price: number;
  image?: string;
  variantSelections?: {
    type: string;
    typeLabel?: string;
    value: string;
    label?: string;
  }[];
};

type Props = {
  open: boolean;
  item: AddedToCartLineSnapshot | null;
  onClose: () => void;
  /** Ruta absoluta del carrito (p. ej. `/es/good-ideas/cart`). Por defecto carrito Go Natural. */
  cartPath?: string;
};

function buildSummaryLine(
  item: AddedToCartLineSnapshot,
  locale: Locale,
  t: (key: string, fallback?: string | unknown) => string
): string {
  const variantPart = formatCartVariantSummary(
    item.variantSelections,
    undefined,
    t
  );
  const pricePart = `${t("addedToCartModal.priceLabel")}: ${formatCartPrice(
    locale,
    item.price
  )}`;
  return variantPart ? `${variantPart} · ${pricePart}` : pricePart;
}

export default function AddedToCartModal({
  open,
  item,
  onClose,
  cartPath,
}: Props) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    queueMicrotask(() => {
      panelRef.current?.focus();
    });
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open || !item) return null;

  const summaryLine = buildSummaryLine(item, locale, t);

  const goToCart = () => {
    onClose();
    router.push(cartPath ?? `/${locale}/cart`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label={t("addedToCartModal.closeAria")}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="added-to-cart-title"
        tabIndex={-1}
        className="relative w-full max-w-md rounded-xl bg-white px-6 pb-7 pt-12 shadow-[0_20px_60px_rgba(0,0,0,0.22)] outline-none ring-1 ring-black/5"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-neutral-900 transition hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
          aria-label={t("addedToCartModal.closeAria")}
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        <h2
          id="added-to-cart-title"
          className="text-center text-lg font-bold text-neutral-900"
        >
          {t("addedToCartModal.title")}
        </h2>

        <div className="mt-4 border-b border-neutral-200" />

        <div className="mt-5 flex gap-4">
          {item.image ? (
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-100 ring-1 ring-neutral-200/80">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover object-center"
                sizes="96px"
              />
            </div>
          ) : (
            <div
              className="h-24 w-24 shrink-0 rounded-lg border border-dashed border-neutral-300 bg-neutral-100"
              role="img"
              aria-label={t("common.noImage")}
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="font-bold leading-snug text-neutral-900">
              {item.title}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">
              {summaryLine}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={goToCart}
            className="w-full rounded-full bg-black py-3.5 text-center text-sm font-bold text-white transition hover:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 active:scale-[0.99]"
          >
            {t("addedToCartModal.goToCart")}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full bg-accent-gold py-3.5 text-center text-sm font-bold text-dark-base shadow-md shadow-accent-gold/25 transition hover:bg-accent-gold/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/80 focus-visible:ring-offset-2 active:scale-[0.99]"
          >
            {t("addedToCartModal.continueShopping")}
          </button>
        </div>
      </div>
    </div>
  );
}
