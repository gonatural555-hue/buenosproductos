"use client";

import SmartImage from "@/components/SmartImage";
import { useTranslations } from "@/components/i18n/LocaleProvider";
import type { CartItem } from "@/context/GoodIdeasCartContext";
import { getColorVariantLabel } from "@/lib/cart-line-id";
import { giCartText } from "@/lib/ui/gi-cart-light";
import { isValidImageSrc } from "@/lib/image-src";

type Props = {
  item: CartItem;
  formatPrice: (n: number) => string;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
};

export default function CartLineRow({
  item,
  formatPrice,
  onDecrease,
  onIncrease,
  onRemove,
}: Props) {
  const t = useTranslations();
  const colorLabel = getColorVariantLabel(item.variantSelections);
  const imageSrc = isValidImageSrc(item.image) ? item.image : null;
  const lineTotal = item.price * item.quantity;

  return (
    <li className="border-b border-[#E5E5E5] py-6 first:pt-0 last:border-b-0">
      <div className="flex gap-5">
        <div className="relative h-[96px] w-[96px] shrink-0 overflow-hidden rounded-sm border border-[#E5E5E5] bg-[#FAFAFA]">
          {imageSrc ? (
            <SmartImage
              src={imageSrc}
              alt={item.title}
              fill
              sizes="96px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-[#737373]">
              {t("common.noImage")}
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className={giCartText.itemTitle}>{item.title}</p>
              {colorLabel ? (
                <p className={`mt-1.5 ${giCartText.itemMeta}`}>
                  {t("cartPage.variantLabels.color")}: {colorLabel}
                </p>
              ) : null}
            </div>
            <p className={`shrink-0 ${giCartText.price}`}>{formatPrice(lineTotal)}</p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div
              className={`inline-flex h-9 items-center rounded-full ${giCartText.qtyBg} px-1`}
            >
              <button
                type="button"
                onClick={onDecrease}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#111111] transition hover:bg-black/5"
                aria-label={t("cartPage.decreaseQty")}
              >
                −
              </button>
              <span className="min-w-[2rem] text-center font-body text-sm font-medium tabular-nums text-[#111111]">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={onIncrease}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#111111] transition hover:bg-black/5"
                aria-label={t("cartPage.increaseQty")}
              >
                +
              </button>
            </div>
            <button type="button" onClick={onRemove} className={giCartText.link}>
              {t("cartPage.remove")}
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
