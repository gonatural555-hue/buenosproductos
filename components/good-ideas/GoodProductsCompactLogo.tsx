import { giType } from "@/lib/ui/gi-typography";

type Props = {
  className?: string;
  prefixClassName?: string;
  suffixClassName?: string;
};

/** Marca compacta mobile — “B” + “P”. */
export default function GoodProductsCompactLogo({
  className = "",
  prefixClassName = "text-[#0B0F14]",
  suffixClassName = "text-[#3B82F6]",
}: Props) {
  return (
    <span
      className={`inline-flex items-baseline font-display text-[1.65rem] font-black leading-none tracking-[-0.06em] sm:text-[1.75rem] ${className}`}
      aria-hidden
    >
      <span className={prefixClassName}>B</span>
      <span className={suffixClassName}>P</span>
    </span>
  );
}
