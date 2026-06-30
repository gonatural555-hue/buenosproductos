"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SmartImage from "@/components/SmartImage";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import { useCurrency } from "@/context/CurrencyContext";
import { useGoodIdeasCart } from "@/context/GoodIdeasCartContext";
import { GI_CART_DRAWER_MS } from "@/lib/good-ideas-cart-drawer";
import { cartPath } from "@/lib/routing/paths";
import { giType } from "@/lib/ui/gi-typography";

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  );
}

export default function GoodIdeasCartDrawer() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const { formatMoney } = useCurrency();
  const {
    totalItems,
    isDrawerOpen,
    lastAddedLine,
    closeDrawer,
  } = useGoodIdeasCart();

  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [showSuccessHint, setShowSuccessHint] = useState(false);

  useEffect(() => {
    if (isDrawerOpen) {
      setMounted(true);
      const frame = requestAnimationFrame(() => setActive(true));
      return () => cancelAnimationFrame(frame);
    }
    setActive(false);
    const timer = window.setTimeout(() => setMounted(false), GI_CART_DRAWER_MS);
    return () => window.clearTimeout(timer);
  }, [isDrawerOpen]);

  useEffect(() => {
    if (!isDrawerOpen) return;
    setShowSuccessHint(true);
    const timer = window.setTimeout(() => setShowSuccessHint(false), 2000);
    return () => window.clearTimeout(timer);
  }, [isDrawerOpen, lastAddedLine?.title, lastAddedLine?.price]);

  useEffect(() => {
    if (!mounted) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mounted]);

  useEffect(() => {
    if (!active) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDrawer();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = getFocusableElements(panelRef.current);
      if (focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    queueMicrotask(() => panelRef.current?.focus());
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, closeDrawer]);

  const goToCart = useCallback(() => {
    closeDrawer();
    router.push(cartPath(locale));
  }, [closeDrawer, locale, router]);

  if (!mounted || !lastAddedLine) return null;

  const goToCartLabel = t("addedToCartDrawer.goToCart", "").replace(
    "{count}",
    String(totalItems)
  );

  return (
    <div
      className="fixed inset-0 z-[100]"
      aria-hidden={!active}
    >
      <button
        type="button"
        className={`absolute inset-0 bg-black/40 transition-opacity duration-[250ms] ease-out motion-reduce:transition-none ${
          active ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeDrawer}
        aria-label={t("addedToCartDrawer.closeAria")}
        tabIndex={-1}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`fixed inset-y-0 right-0 flex h-[100dvh] w-full flex-col bg-[var(--gi-drawer-bg)] shadow-[0_0_40px_rgba(0,0,0,0.08)] outline-none transition-transform duration-[250ms] ease-out motion-reduce:transition-none md:w-[380px] lg:w-[420px] ${
          active ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 px-6 pb-4 pt-5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--gi-success)]"
                aria-hidden
              >
                <svg
                  viewBox="0 0 16 16"
                  className="h-3.5 w-3.5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path d="M3.5 8.5 6.5 11.5 12.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <h2
                id={titleId}
                className={`${giType.drawerTitle} text-[var(--gi-ink)]`}
              >
                {t("addedToCartDrawer.title")}
              </h2>
            </div>
            <p
              className={`mt-2 pl-[34px] ${giType.drawerSuccess} transition-all duration-300 ease-out motion-reduce:transition-none ${
                showSuccessHint
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-1 opacity-0"
              }`}
              aria-live="polite"
            >
              {t("addedToCartDrawer.successHint")}
            </p>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[var(--gi-ink)] transition-colors hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gi-primary)] focus-visible:ring-offset-2"
            aria-label={t("addedToCartDrawer.closeAria")}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className="mx-6 border-b border-[var(--gi-border)]" />

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex gap-4">
            {lastAddedLine.image ? (
              <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-lg bg-neutral-100 sm:h-[90px] sm:w-[90px]">
                <SmartImage
                  src={lastAddedLine.image}
                  alt={lastAddedLine.title}
                  fill
                  className="object-cover object-center"
                  sizes="90px"
                />
              </div>
            ) : (
              <div
                className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-lg bg-neutral-100 sm:h-[90px] sm:w-[90px]"
                role="img"
                aria-label={t("common.noImage")}
              />
            )}

            <div className="min-w-0 flex-1">
              <p className={`line-clamp-2 ${giType.drawerProduct} text-[var(--gi-ink)]`}>
                {lastAddedLine.title}
              </p>

              {lastAddedLine.variantSelections?.map((selection) => {
                const label = t(
                  `cartPage.variantLabels.${selection.type}`,
                  selection.typeLabel || selection.type
                );
                const value = t(
                  `cartPage.variantOptions.${selection.type}.${selection.value}`,
                  selection.label || selection.value
                );
                return (
                  <p
                    key={`${selection.type}-${selection.value}`}
                    className={`mt-1.5 ${giType.drawerMeta}`}
                  >
                    {label}: {value}
                  </p>
                );
              })}

              <p className={`mt-3 ${giType.drawerPrice} text-[var(--gi-ink)]`}>
                {formatMoney(lastAddedLine.price)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 px-6 pb-8 pt-2">
          <button
            type="button"
            onClick={goToCart}
            className={`flex h-[50px] w-full items-center justify-center rounded-full bg-[var(--gi-primary)] ${giType.drawerBtn} text-white transition-colors hover:bg-[var(--gi-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gi-primary)] focus-visible:ring-offset-2 active:scale-[0.99]`}
          >
            {goToCartLabel}
          </button>
          <button
            type="button"
            onClick={closeDrawer}
            className={`flex h-[50px] w-full items-center justify-center rounded-full border border-[var(--gi-ink)] bg-[var(--gi-drawer-bg)] ${giType.drawerBtn} text-[var(--gi-ink)] transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gi-ink)] focus-visible:ring-offset-2 active:scale-[0.99]`}
          >
            {t("addedToCartDrawer.continueShopping")}
          </button>
        </div>
      </div>
    </div>
  );
}
