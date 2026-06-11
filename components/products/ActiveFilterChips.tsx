import Link from "next/link";

export type ActiveFilterChip = {
  id: string;
  label: string;
  removeHref: string;
};

type ActiveFilterChipsProps = {
  chips: ActiveFilterChip[];
  clearAllHref: string;
  clearAllLabel: string;
  className?: string;
};

export default function ActiveFilterChips({
  chips,
  clearAllHref,
  clearAllLabel,
  className = "",
}: ActiveFilterChipsProps) {
  if (chips.length === 0) return null;

  return (
    <div className={`mb-4 font-inter ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        {chips.map((chip) => (
          <Link
            key={chip.id}
            href={chip.removeHref}
            className="inline-flex items-center gap-1.5 rounded border border-[#E5E5E5] bg-white px-2.5 py-1 text-xs font-medium text-black hover:border-black/30"
          >
            <span>{chip.label}</span>
            <span aria-hidden className="text-sm leading-none text-black/60">
              ×
            </span>
          </Link>
        ))}
        {chips.length >= 1 ? (
          <Link
            href={clearAllHref}
            className="text-xs text-black underline underline-offset-2 hover:text-black/70"
          >
            {clearAllLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
