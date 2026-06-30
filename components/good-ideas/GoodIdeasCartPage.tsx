"use client";

import Link from "next/link";
import CartLineRow from "@/components/good-ideas/CartLineRow";
import CartOrderSummary from "@/components/good-ideas/CartOrderSummary";
import { useGoodIdeasCart } from "@/context/GoodIdeasCartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import { checkoutPath, productsPath } from "@/lib/routing/paths";
import {
  GI_CART_GRID,
  GI_CART_INNER,
  GI_CART_OUTER,
  GI_CART_TOP_PAD,
  giCartText,
} from "@/lib/ui/gi-cart-light";

export default function GoodIdeasCartPage() {
  const locale = useLocale();
  const t = useTranslations();
  const { items, subtotal, increaseQty, decreaseQty, removeItem } = useGoodIdeasCart();
  const { formatMoney } = useCurrency();
  const formatPrice = (n: number) => formatMoney(n);

  const itemCountLabel =
    items.length === 1
      ? t("goodIdeas.cart.oneItem")
      : t("goodIdeas.cart.itemCount").replace("{count}", String(items.length));

  return (
    <main className={`min-h-[100dvh] bg-white pb-16 text-[#111111] ${GI_CART_TOP_PAD}`}>
      <div className={GI_CART_OUTER}>
        <div className={GI_CART_INNER}>
          <Link href={productsPath(locale)} className={giCartText.backLink}>
            <span aria-hidden>←</span>
            {t("goodIdeas.cart.back")}
          </Link>

          <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className={giCartText.title}>{t("goodIdeas.cart.title")}</h1>
            {items.length > 0 ? (
              <span className="font-body text-sm text-[#737373]">{itemCountLabel}</span>
            ) : null}
          </div>

          {items.length === 0 ? (
            <div className="mt-12 rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] px-8 py-14 text-center">
              <p className="font-body text-base text-[#737373]">{t("goodIdeas.cart.empty")}</p>
              <Link
                href={productsPath(locale)}
                className={`mt-6 ${giCartText.cta} max-w-xs`}
              >
                {t("goodIdeas.cart.emptyCta")}
              </Link>
            </div>
          ) : (
            <div className={`mt-8 ${GI_CART_GRID}`}>
              <section className="min-w-0">
                <ul>
                  {items.map((item) => (
                    <CartLineRow
                      key={item.id}
                      item={item}
                      formatPrice={formatPrice}
                      onDecrease={() => decreaseQty(item.id)}
                      onIncrease={() => increaseQty(item.id)}
                      onRemove={() => removeItem(item.id)}
                    />
                  ))}
                </ul>
              </section>

              <CartOrderSummary
                subtotal={subtotal}
                formatPrice={formatPrice}
                checkoutHref={checkoutPath(locale)}
                sticky
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
