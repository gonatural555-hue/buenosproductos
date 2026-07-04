import Link from "next/link";
import GoodIdeasHomeCategoryTileImage from "@/components/good-ideas/home/GoodIdeasHomeCategoryTileImage";
import type { GoodIdeasHomeCategoryTileData } from "@/lib/good-ideas-home-categories";

type Props = GoodIdeasHomeCategoryTileData & {
  title: string;
  description: string;
  viewMoreLabel: string;
};

export default function GoodIdeasHomeCategoryTile({
  href,
  slug,
  iconId,
  title,
  description,
  viewMoreLabel,
}: Props) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#151B24] transition duration-300 hover:border-[rgba(59,130,246,0.35)] hover:shadow-[0_20px_48px_rgba(59,130,246,0.14)] motion-reduce:transition-none lg:rounded-[24px]"
    >
      <div className="relative aspect-square overflow-hidden bg-[#0B0F14]/70">
        <GoodIdeasHomeCategoryTileImage slug={slug} iconId={iconId} title={title} />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5 sm:p-5 lg:p-6">
        <h3 className="font-body text-lg font-semibold leading-snug text-[#E8ECF1] lg:text-xl">
          {title}
        </h3>
        <p className="line-clamp-2 font-body text-sm leading-relaxed text-[rgba(232,236,241,0.62)]">
          {description}
        </p>
        <span className="mt-auto inline-flex items-center gap-1 pt-2 font-body text-sm font-semibold text-[#3B82F6] transition group-hover:gap-2">
          {viewMoreLabel}
          <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}
