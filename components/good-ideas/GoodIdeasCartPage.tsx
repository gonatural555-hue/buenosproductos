"use client";

import Link from "next/link";
import { useGoodIdeasCart } from "@/context/GoodIdeasCartContext";
import { useCurrency } from "@/context/CurrencyContext";
import CurrencyDisclaimer from "@/components/currency/CurrencyDisclaimer";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import {
  goodIdeasCheckoutPath,
  goodIdeasProductsPath,
} from "@/lib/routing/brands";
import { GI_HERO_TOP_PAD } from "@/lib/ui/goodideas-design";

export default function GoodIdeasCartPage() {
  const locale = useLocale();
  const t = useTranslations();
  const { items, subtotal, increaseQty, decreaseQty, removeItem } = useGoodIdeasCart();
  const { formatMoney } = useCurrency();
  const formatPrice = (n: number) => formatMoney(n);

  return (
    <main className={`min-h-[100dvh] bg-[#0B0F14] px-6 pb-16 text-[#E8ECF1] sm:px-10 ${GI_HERO_TOP_PAD}`}>
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-normal tracking-[-0.02em]">
          {t("goodIdeas.cart.title")}
        </h1>

        {items.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-white/[0.08] bg-[#151B24] p-10 text-center">
            <p className="font-inter text-[16px] text-[rgba(232,236,241,0.72)]">
              {t("goodIdeas.cart.empty")}
            </p>
            <Link
              href={goodIdeasProductsPath(locale)}
              className="mt-6 inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#E8ECF1] px-8 font-inter text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0B0F14] transition hover:bg-white"
            >
              {t("goodIdeas.cart.emptyCta")}
            </Link>
          </div>
        ) : (
          <ul className="mt-10 space-y-4">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-[#151B24] p-5"
              >
                <div>
                  <p className="font-inter text-[15px] font-medium text-white">{item.title}</p>
                  <p className="mt-1 font-inter text-[14px] text-[rgba(232,236,241,0.55)]">
                    {formatPrice(item.price)} × {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => decreaseQty(item.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80 hover:bg-white/10"
                    aria-label="-"
                  >
                    −
                  </button>
                  <span className="min-w-[1.5rem] text-center font-inter text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => increaseQty(item.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80 hover:bg-white/10"
                    aria-label="+"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="ml-2 font-inter text-[12px] uppercase tracking-wider text-[#3B82F6] hover:underline"
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {items.length > 0 ? (
          <div className="mt-10 border-t border-white/[0.08] pt-8">
            <p className="flex justify-between font-inter text-[15px]">
              <span className="text-[rgba(232,236,241,0.72)]">{t("goodIdeas.cart.subtotal")}</span>
              <span className="font-medium text-white">{formatPrice(subtotal)}</span>
            </p>
            <p className="mt-4 font-inter text-[14px] text-[rgba(232,236,241,0.5)]">
              {t("goodIdeas.cart.comingSoonCheckout")}
            </p>
            <CurrencyDisclaimer className="mt-3 font-inter text-[12px] leading-relaxed text-[rgba(232,236,241,0.45)]" />
            <Link
              href={goodIdeasCheckoutPath(locale)}
              className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#3B82F6] px-8 font-inter text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#2563EB] sm:w-auto"
            >
              {t("goodIdeas.cart.checkout")}
            </Link>
          </div>
        ) : null}
      </div>
    </main>
  );
}
