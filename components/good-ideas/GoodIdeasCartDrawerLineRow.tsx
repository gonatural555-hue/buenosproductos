"use client";

import SmartImage from "@/components/SmartImage";
import { useTranslations } from "@/components/i18n/LocaleProvider";
import type { CartItem } from "@/context/GoodIdeasCartContext";
import { isValidImageSrc } from "@/lib/image-src";
import { giCartText } from "@/lib/ui/gi-cart-light";
import { giType } from "@/lib/ui/gi-typography";

type Props = {
  item: CartItem;
  formatPrice: (n: number) => string;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

export default function GoodIdeasCartDrawerLineRow({
  item,
  formatPrice,
  onIncrease,
  onDecrease,
  onRemove,
}: Props) {
  const t = useTranslations();
  const imageSrc = isValidImageSrc(item.image) ? item.image : null;
  const lineTotal = item.price * item.quantity;

  return (
    <li className="border-b border-[var(--gi-border)] py-5 last:border-b-0">
      <div className="flex gap-4">
        <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-lg bg-neutral-100">
          {imageSrc ? (
            <SmartImage
              src={imageSrc}
              alt={item.title}
              fill
              className="object-cover object-center"
              sizes="72px"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-xs text-[var(--gi-text-muted)]"
              role="img"
              aria-label={t("common.noImage")}
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className={`line-clamp-2 min-w-0 ${giType.drawerProduct} text-[var(--gi-ink)]`}>
              {item.title}
            </p>
            <p className={`shrink-0 ${giType.drawerPrice} text-base text-[var(--gi-ink)]`}>
              {formatPrice(lineTotal)}
            </p>
          </div>

          {item.variantSelections?.map((selection) => {
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
                className={`mt-1 ${giType.drawerMeta}`}
              >
                {label}: {value}
              </p>
            );
          })}

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div
              className={`inline-flex h-8 items-center rounded-full ${giCartText.qtyBg} px-0.5`}
            >
              <button
                type="button"
                onClick={onDecrease}
                className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--gi-ink)] transition hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gi-primary)]"
                aria-label={t("cartPage.decreaseQty")}
              >
                −
              </button>
              <span className="min-w-[1.75rem] text-center font-body text-sm font-medium tabular-nums text-[var(--gi-ink)]">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={onIncrease}
                className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--gi-ink)] transition hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gi-primary)]"
                aria-label={t("cartPage.increaseQty")}
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={onRemove}
              className={`${giCartText.link} text-[13px]`}
            >
              {t("cartPage.remove")}
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
