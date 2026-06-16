"use client";

import Link from "next/link";
import Image from "next/image";
import SmartImage from "@/components/SmartImage";
import { useEffect, useMemo, useRef } from "react";
import CartSuggestedProductsRail from "@/components/cart/CartSuggestedProductsRail";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import { FREE_SHIPPING_THRESHOLD_USD } from "@/lib/shipping/constants";
import {
  cartLineToGa4Item,
  trackViewCart,
} from "@/lib/analytics/ga4";
import {
  formatCartPrice,
  formatCartVariantSummary,
} from "@/lib/cart-formatting";

function interpolate(template: string, vars: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}

export default function CartPage() {
  const { items, subtotal, increaseQty, decreaseQty, removeItem } = useCart();
  const { hasWelcomeFreeShipping, welcomeFreeShippingRemaining, isLoggedIn } =
    useUser();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const viewCartTracked = useRef(false);

  useEffect(() => {
    if (items.length === 0) {
      viewCartTracked.current = false;
      return;
    }
    if (viewCartTracked.current) return;
    viewCartTracked.current = true;
    trackViewCart(
      items.map((item) => cartLineToGa4Item(item, item.quantity))
    );
  }, [items, subtotal]);

  const formatPrice = (price: number) => formatCartPrice(locale, price);

  const thresholdLabel = formatPrice(FREE_SHIPPING_THRESHOLD_USD);

  const cartItemIds = useMemo(() => items.map((item) => item.id), [items]);

  const { shippingPct, shippingRemaining, shippingUnlocked } = useMemo(() => {
    if (hasWelcomeFreeShipping) {
      return {
        shippingPct: 100,
        shippingRemaining: 0,
        shippingUnlocked: true,
      };
    }
    const pct = Math.min(
      100,
      Math.round((subtotal / FREE_SHIPPING_THRESHOLD_USD) * 1000) / 10
    );
    const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD_USD - subtotal);
    return {
      shippingPct: pct,
      shippingRemaining: remaining,
      shippingUnlocked: subtotal >= FREE_SHIPPING_THRESHOLD_USD,
    };
  }, [subtotal, hasWelcomeFreeShipping]);

  const handleCheckout = () => {
    router.push(`/${locale}/checkout`);
  };

  const formatVariantSummary = (item: (typeof items)[number]) =>
    formatCartVariantSummary(
      item.variantSelections,
      item.variantSummary,
      t
    );

  if (items.length === 0) {
    return (
      <main
        data-route="cart"
        className="relative w-full overflow-hidden pt-28 pb-16 md:pt-32 md:pb-24"
      >
        <div className="absolute inset-0">
          <Image
            src="/assets/images/hero/emptycart.webp"
            alt={t("cartPage.emptyTitle")}
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-base via-black/70 to-black/50" />
        </div>
        <div className="relative z-10 max-w-lg mx-auto px-4 text-center">
          <p className="text-[0.65rem] uppercase tracking-[0.28em] text-accent-gold/90 mb-4">
            Go Natural
          </p>
          <h1 className="font-sans mb-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">
            {t("cartPage.emptyTitle")}
          </h1>
          <p className="mb-10 leading-relaxed text-white/80">
            {t("cartPage.emptyText")}
          </p>
          <Link
            href={`/${locale}/products`}
            className="inline-flex justify-center rounded-lg bg-accent-gold px-8 py-3.5 text-sm font-semibold text-dark-base shadow-lg shadow-accent-gold/20 transition hover:bg-accent-gold/90 hover:shadow-accent-gold/30 active:scale-[0.98]"
          >
            {t("cartPage.emptyCta")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      data-route="cart"
      className="mx-auto max-w-7xl bg-warm-sand px-4 pb-16 pt-28 sm:px-6 md:pb-20 md:pt-32 lg:px-8"
    >
      <header className="mb-10 md:mb-12 max-w-2xl">
        <p className="text-[0.65rem] uppercase tracking-[0.28em] text-accent-gold/90 mb-3">
          {t("cartPage.summaryTitle")}
        </p>
        <h1 className="font-sans mb-3 text-3xl font-semibold tracking-tight text-dark-base md:text-4xl">
          {t("cartPage.heroTitle")}
        </h1>
        <p className="text-base leading-relaxed text-muted-gray md:text-lg">
          {t("cartPage.heroSubtitle")}
        </p>
      </header>

      <div className="grid gap-8 lg:gap-10 lg:grid-cols-[minmax(0,1fr)_min(100%,380px)] lg:items-start">
        <div className="space-y-8 min-w-0">
          {/* Free shipping progress */}
          <section
            className="rounded-2xl border border-earth-brown/18 bg-soft-stone p-5 shadow-[0_10px_36px_-18px_rgba(17,23,19,0.12)] md:p-6"
            aria-label={t("cartPage.freeShippingLabel")}
          >
            {hasWelcomeFreeShipping ? (
              <>
                <h2 className="text-sm font-semibold text-dark-base">
                  {t("cartPage.freeShippingLabel")}
                </h2>
                <p className="mt-2 text-sm font-medium text-accent-gold/95">
                  {interpolate(t("shipping.welcomeFreeRemaining"), {
                    count: String(welcomeFreeShippingRemaining),
                  })}
                </p>
                <p className="mt-2 text-xs text-muted-gray">
                  {t("shipping.welcomeFreeApplied")}
                </p>
              </>
            ) : (
              <>
                <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-sm font-semibold text-dark-base">
                      {t("cartPage.freeShippingLabel")}
                    </h2>
                    <p className="mt-1 text-xs text-muted-gray">
                      {isLoggedIn && welcomeFreeShippingRemaining === 0
                        ? t("shipping.welcomeFreeExhausted")
                        : interpolate(t("cartPage.freeShippingThresholdHint"), {
                            amount: thresholdLabel,
                          })}
                    </p>
                  </div>
                  {!shippingUnlocked && (
                    <span className="text-xs font-medium tabular-nums text-accent-gold">
                      {interpolate(t("cartPage.freeShippingAway"), {
                        amount: formatPrice(shippingRemaining),
                      })}
                    </span>
                  )}
                </div>
                <div
                  className="h-2 overflow-hidden rounded-full bg-earth-brown/15"
                  role="progressbar"
                  aria-valuenow={Math.round(shippingPct)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent-moss to-accent-gold transition-[width] duration-700 ease-out motion-reduce:transition-none"
                    style={{ width: `${shippingPct}%` }}
                  />
                </div>
                {shippingUnlocked && (
                  <p className="mt-3 text-sm text-accent-gold/95 font-medium">
                    {t("cartPage.freeShippingUnlocked")}
                  </p>
                )}
              </>
            )}
          </section>

          {/* Line items */}
          <section className="overflow-hidden rounded-2xl border border-earth-brown/15 bg-soft-stone">
            <ul className="divide-y divide-earth-brown/12">
              {items.map((item) => {
                const itemSubtotal = item.price * item.quantity;
                const variantText = formatVariantSummary(item);
                return (
                  <li
                    key={item.id}
                    className="p-4 transition-colors hover:bg-warm-sand/60 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
                      {item.image ? (
                        <div className="relative h-[104px] w-[104px] shrink-0 overflow-hidden rounded-xl bg-warm-sand ring-1 ring-earth-brown/15 sm:h-[120px] sm:w-[120px]">
                          <SmartImage
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover object-center"
                            sizes="120px"
                          />
                        </div>
                      ) : (
                        <div
                          className="h-[104px] w-[104px] shrink-0 rounded-xl border border-dashed border-earth-brown/25 bg-warm-sand/80 sm:h-[120px] sm:w-[120px]"
                          aria-hidden
                        />
                      )}

                      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:justify-between gap-4">
                        <div className="min-w-0">
                          <h2 className="text-lg font-semibold text-text-primary leading-snug">
                            {item.title}
                          </h2>
                          {variantText ? (
                            <p className="mt-2 text-sm text-accent-gold/90 leading-relaxed">
                              {variantText}
                            </p>
                          ) : null}
                          <p className="mt-2 text-sm text-muted-gray">
                            {t("cartPage.unitPrice")}{" "}
                            <span className="font-medium tabular-nums text-dark-base">
                              {formatPrice(item.price)}
                            </span>
                          </p>

                          <div className="mt-4 flex flex-wrap items-center gap-3">
                            <div className="inline-flex items-center rounded-lg border border-earth-brown/20 bg-white shadow-inner">
                              <button
                                type="button"
                                onClick={() => decreaseQty(item.id)}
                                className="rounded-l-lg px-3.5 py-2 text-dark-base transition hover:bg-warm-sand active:scale-95 motion-reduce:transform-none"
                                aria-label={t("cartPage.decreaseQty")}
                              >
                                −
                              </button>
                              <span className="min-w-[2.75rem] border-x border-earth-brown/20 px-2 py-2 text-center text-sm font-semibold tabular-nums text-dark-base">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => increaseQty(item.id)}
                                className="rounded-r-lg px-3.5 py-2 text-dark-base transition hover:bg-warm-sand active:scale-95 motion-reduce:transform-none"
                                aria-label={t("cartPage.increaseQty")}
                              >
                                +
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-sm font-medium text-muted-gray transition-colors hover:text-red-600 hover:underline underline-offset-4"
                            >
                              {t("cartPage.remove")}
                            </button>
                          </div>
                        </div>

                        <div className="sm:text-right shrink-0">
                          <p className="text-xs uppercase tracking-wider text-muted-gray">
                            {t("cartPage.itemSubtotal")}
                          </p>
                          <p className="mt-1 text-xl font-semibold tabular-nums text-dark-base">
                            {formatPrice(itemSubtotal)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Completá tu equipo: sugerencias vía /api/cart/suggestions (lógica en getCartSuggestedProducts). */}
          <section className="rounded-2xl border border-dashed border-earth-brown/25 bg-warm-sand/70 p-6 md:p-8">
            <h2 className="text-lg font-semibold text-dark-base">
              {t("cartPage.completeGearTitle")}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-gray">
              {t("cartPage.completeGearBody")}
            </p>
            <CartSuggestedProductsRail
              locale={locale}
              labels={{
                viewProduct: t("common.viewProduct"),
                addToCart: t("common.addToCart"),
                noImage: t("common.noImage"),
              }}
              cartItemIds={cartItemIds}
              regionAriaLabel={t("cartPage.completeGearSuggestionsAria")}
              suggestError={t("cartPage.completeGearSuggestionsError")}
            />
          </section>

          {/* Trust */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-muted-gray sm:justify-start md:text-sm">
            <span className="inline-flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 rounded-full bg-accent-gold"
                aria-hidden
              />
              {t("cartPage.trustSecure")}
            </span>
            <span className="hidden text-earth-brown/35 sm:inline" aria-hidden>
              ·
            </span>
            <span>{t("cartPage.trustPayPal")}</span>
            <span className="hidden text-earth-brown/35 sm:inline" aria-hidden>
              ·
            </span>
            <span>{t("cartPage.trustReturns")}</span>
          </div>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-28 space-y-6">
          <div className="rounded-2xl border border-earth-brown/18 bg-soft-stone p-6 shadow-[0_20px_56px_-28px_rgba(17,23,19,0.18)] md:p-8">
            <h2 className="mb-6 text-lg font-semibold text-dark-base">
              {t("cartPage.summaryTitle")}
            </h2>

            <div className="mb-6 space-y-4">
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <span className="text-muted-gray">{t("cartPage.summarySubtotal")}</span>
                <span className="font-semibold tabular-nums text-dark-base">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="border-t border-earth-brown/15 pt-4 text-xs leading-relaxed text-muted-gray">
                {t("cartPage.summaryNote")}
              </p>
            </div>

            <div className="border-t border-earth-brown/15 pt-2">
              <div className="mb-8 flex items-baseline justify-between gap-4">
                <span className="text-base font-semibold text-dark-base">
                  {t("cartPage.summaryTotal")}
                </span>
                <span className="text-2xl font-semibold tabular-nums text-accent-gold">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="group relative w-full overflow-hidden rounded-xl bg-dark-base px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-dark-base/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-dark-base/25 active:translate-y-0 active:scale-[0.99] motion-reduce:transform-none"
              >
                <span className="relative z-10">{t("cartPage.checkout")}</span>
                <span
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out motion-reduce:hidden"
                  aria-hidden
                />
              </button>

              <p className="mt-4 text-center text-xs leading-relaxed text-muted-gray">
                {t("cartPage.ctaReassurance")}
              </p>

              <Link
                href={`/${locale}/products`}
                className="mt-6 block text-center text-sm font-medium text-accent-gold/90 hover:text-accent-gold transition-colors"
              >
                {t("cartPage.continueShopping")}
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
