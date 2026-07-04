import Link from "next/link";
import SmartImage from "@/components/SmartImage";
import { GoodIdeasHomeCategoryIcon } from "@/components/good-ideas/home/GoodIdeasHomeCategoryIcons";
import type { GoodIdeasHomeCategoryTileData } from "@/lib/good-ideas-home-categories";
import { isValidImageSrc } from "@/lib/image-src";

type Props = GoodIdeasHomeCategoryTileData & {
  title: string;
  description: string;
  viewMoreLabel: string;
};

export default function GoodIdeasHomeCategoryTile({
  href,
  iconId,
  image,
  title,
  description,
  viewMoreLabel,
}: Props) {
  const imageSrc = isValidImageSrc(image) ? image : null;

  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#151B24] transition duration-300 hover:border-[rgba(59,130,246,0.35)] hover:shadow-[0_20px_48px_rgba(59,130,246,0.14)] motion-reduce:transition-none lg:rounded-[24px]"
    >
      <div className="relative aspect-square overflow-hidden bg-[#0B0F14]/70">
        {imageSrc ? (
          <>
            <SmartImage
              src={imageSrc}
              alt={title}
              fill
              sizes="(max-width: 640px) 78vw, (max-width: 1024px) 45vw, 25vw"
              className="object-cover object-center transition duration-500 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#151B24]/90 via-[#151B24]/10 to-transparent" />
          </>
        ) : (
          <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_50%_40%,rgba(59,130,246,0.14),transparent_62%)]">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#0B0F14]/80">
              <GoodIdeasHomeCategoryIcon id={iconId} className="h-9 w-9" />
            </div>
          </div>
        )}
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
