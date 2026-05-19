"use client";

import { useGoodIdeasCart } from "@/context/GoodIdeasCartContext";
import type { AddToCartLinePayload } from "@/components/AddToCartButton";

type Props = AddToCartLinePayload & {
  disabled?: boolean;
  label?: string;
  className?: string;
  onAfterAdd?: (item: AddToCartLinePayload) => void;
};

export default function GoodIdeasAddToCartButton({
  id,
  title,
  price,
  image,
  variantSelections,
  disabled,
  label,
  className,
  onAfterAdd,
}: Props) {
  const { addItem } = useGoodIdeasCart();

  return (
    <button
      type="button"
      onClick={() => {
        const payload = { id, title, price, image, variantSelections };
        addItem(payload);
        onAfterAdd?.(payload);
      }}
      disabled={disabled}
      className={[
        "w-full rounded-full bg-[#3B82F6] px-6 py-3 font-inter text-[12px] font-semibold uppercase tracking-[0.14em] text-white",
        "transition-all duration-300 ease-out hover:bg-[#2563EB] hover:shadow-[0_12px_32px_rgba(59,130,246,0.35)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F14]",
        "active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label || "Add to cart"}
    </button>
  );
}
