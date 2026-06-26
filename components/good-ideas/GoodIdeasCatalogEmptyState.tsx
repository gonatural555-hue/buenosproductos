import Link from "next/link";

type Props = {
  title: string;
  hint: string;
  clearHref: string;
  clearLabel: string;
};

export default function GoodIdeasCatalogEmptyState({
  title,
  hint,
  clearHref,
  clearLabel,
}: Props) {
  return (
    <div className="col-span-2 px-2 py-14 text-center lg:col-span-3">
      <p className="font-inter text-lg text-[#E8ECF1]">{title}</p>
      <p className="mx-auto mt-3 max-w-md font-inter text-sm leading-relaxed text-[rgba(232,236,241,0.65)]">
        {hint}
      </p>
      <Link
        href={clearHref}
        className="mt-8 inline-flex items-center justify-center rounded-full bg-[#3B82F6] px-6 py-3 font-inter text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#2563EB]"
      >
        {clearLabel}
      </Link>
    </div>
  );
}
