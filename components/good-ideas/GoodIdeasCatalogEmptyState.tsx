import Link from "next/link";
import { giPlpClasses } from "@/lib/ui/good-ideas-plp";

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
      <p className={giPlpClasses.emptyTitle}>{title}</p>
      <p className={giPlpClasses.emptyHint}>{hint}</p>
      <Link
        href={clearHref}
        className="mt-8 inline-flex items-center justify-center rounded-full bg-[#3B82F6] px-6 py-3 font-inter text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#2563EB]"
      >
        {clearLabel}
      </Link>
    </div>
  );
}
