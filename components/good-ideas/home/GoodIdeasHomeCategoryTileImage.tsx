"use client";

import { useMemo, useState } from "react";
import SmartImage from "@/components/SmartImage";
import { GoodIdeasHomeCategoryIcon } from "@/components/good-ideas/home/GoodIdeasHomeCategoryIcons";
import type { GoodIdeasHomeCategoryIconId, GoodIdeasHomeCategorySlug } from "@/lib/good-ideas-home-categories";
import { getGoodIdeasHomeCategoryImageCandidates } from "@/lib/good-ideas-home-category-images";

type Props = {
  slug: GoodIdeasHomeCategorySlug;
  iconId: GoodIdeasHomeCategoryIconId;
  title: string;
};

export default function GoodIdeasHomeCategoryTileImage({
  slug,
  iconId,
  title,
}: Props) {
  const candidates = useMemo(
    () => getGoodIdeasHomeCategoryImageCandidates(slug),
    [slug]
  );
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  const imageSrc = failed ? null : candidates[candidateIndex] ?? null;

  const handleError = () => {
    const nextIndex = candidateIndex + 1;
    if (nextIndex < candidates.length) {
      setCandidateIndex(nextIndex);
      return;
    }
    setFailed(true);
  };

  if (!imageSrc) {
    return (
      <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_50%_40%,rgba(59,130,246,0.14),transparent_62%)]">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#0B0F14]/80">
          <GoodIdeasHomeCategoryIcon id={iconId} className="h-9 w-9" />
        </div>
      </div>
    );
  }

  return (
    <>
      <SmartImage
        src={imageSrc}
        alt={title}
        fill
        sizes="(max-width: 640px) 78vw, (max-width: 1024px) 45vw, 25vw"
        className="object-cover object-center transition duration-500 group-hover:scale-[1.04]"
        onError={handleError}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#151B24]/90 via-[#151B24]/10 to-transparent" />
    </>
  );
}
