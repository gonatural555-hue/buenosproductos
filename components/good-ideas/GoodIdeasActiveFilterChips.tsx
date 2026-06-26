import Link from "next/link";
import { giPlpClasses } from "@/lib/ui/good-ideas-plp";

export type ActiveFilterChip = {
  id: string;
  label: string;
  removeHref: string;
};

type Props = {
  chips: ActiveFilterChip[];
  clearAllHref: string;
  clearAllLabel: string;
  className?: string;
};

export default function GoodIdeasActiveFilterChips({
  chips,
  clearAllHref,
  clearAllLabel,
  className = "",
}: Props) {
  if (chips.length === 0) return null;

  return (
    <div className={`mb-4 font-inter ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        {chips.map((chip) => (
          <Link key={chip.id} href={chip.removeHref} className={giPlpClasses.chip}>
            <span>{chip.label}</span>
            <span aria-hidden className="text-sm leading-none text-[rgba(232,236,241,0.5)]">
              ×
            </span>
          </Link>
        ))}
        <Link href={clearAllHref} className={giPlpClasses.chipClear}>
          {clearAllLabel}
        </Link>
      </div>
    </div>
  );
}
