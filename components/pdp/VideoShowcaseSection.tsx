"use client";

import { useEffect, useState } from "react";
import SmartImage from "@/components/SmartImage";
import { useTranslations } from "@/components/i18n/LocaleProvider";
import { PdpSectionSkeleton } from "@/components/pdp/PdpSectionSkeletons";
import { usePdpLazySection } from "@/hooks/usePdpLazySection";
import { useProductVideos } from "@/hooks/useProductVideos";
import { GI_PDP_INNER } from "@/lib/ui/gi-pdp-layout";
import {
  detectVideoPlatform,
  resolveVideoEmbed,
} from "@/lib/pdp-video-embed";
import type { ProductVideoRow } from "@/lib/pdp-supabase-types";

type Props = {
  productId: string;
};

function VideoTile({
  video,
  playLabel,
}: {
  video: ProductVideoRow;
  playLabel: string;
}) {
  const [playing, setPlaying] = useState(false);
  const { embedUrl, externalUrl } = resolveVideoEmbed(video.url);
  const platform = detectVideoPlatform(video.url);
  const thumb = video.thumbnail_url?.trim();

  if (playing) {
    if (!embedUrl) {
      return (
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex aspect-video items-center justify-center rounded-xl border border-white/[0.08] bg-[#151B24] px-4 text-center font-body text-sm text-[#60A5FA] underline-offset-2 hover:underline"
        >
          {externalUrl}
        </a>
      );
    }

    return (
      <div className="aspect-video overflow-hidden rounded-xl border border-white/[0.08] bg-black">
        <iframe
          src={embedUrl}
          title={video.title ?? "Product video"}
          className="h-full w-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative aspect-video w-full overflow-hidden rounded-xl border border-white/[0.08] bg-[#151B24] text-left outline-none transition-colors duration-200 hover:border-white/[0.14] focus-visible:ring-2 focus-visible:ring-[#3B82F6]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F14]"
      aria-label={playLabel}
    >
      {thumb ? (
        <SmartImage
          src={thumb}
          alt=""
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#151B24] to-[#0B0F14]">
          <span className="font-body text-xs font-semibold uppercase tracking-[0.12em] text-[rgba(232,236,241,0.45)]">
            {platform}
          </span>
        </div>
      )}

      <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors duration-200 group-hover:bg-black/35">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/40 text-xl text-white backdrop-blur-sm">
          ▶
        </span>
      </span>

      {video.title ? (
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 font-body text-sm font-medium text-white">
          {video.title}
        </span>
      ) : null}
    </button>
  );
}

function VideoShowcaseContent({
  productId,
  onEmpty,
}: {
  productId: string;
  onEmpty?: () => void;
}) {
  const t = useTranslations();
  const title = t("goodIdeas.pdp.phase3.videosTitle");
  const subtitle = t("goodIdeas.pdp.phase3.videosSubtitle");
  const playLabel = t("goodIdeas.pdp.phase3.playVideo");
  const { videos, loading, hasVideos } = useProductVideos(productId);

  useEffect(() => {
    if (loading) return;
    if (!hasVideos) {
      onEmpty?.();
    }
  }, [loading, hasVideos, onEmpty]);

  if (loading) {
    return <PdpSectionSkeleton className="py-4" />;
  }

  if (!hasVideos) return null;

  return (
    <>
      <header className="mb-8 space-y-2">
        <h2 className="font-body text-2xl font-semibold tracking-tight text-[#E8ECF1] sm:text-[1.65rem]">
          {title}
        </h2>
        {subtitle ? (
          <p className="font-body text-[15px] leading-relaxed text-[rgba(232,236,241,0.65)]">
            {subtitle}
          </p>
        ) : null}
      </header>

      <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2">
        {videos.map((video) => (
          <VideoTile key={video.id} video={video} playLabel={playLabel} />
        ))}
      </div>
    </>
  );
}

export default function VideoShowcaseSection({ productId }: Props) {
  const t = useTranslations();
  const title = t("goodIdeas.pdp.phase3.videosTitle");
  const { ref, visible } = usePdpLazySection();
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  return (
    <section
      ref={ref}
      aria-label={title}
      className="border-t border-white/[0.08] py-14 md:py-16"
    >
      <div className={GI_PDP_INNER}>
        {!visible ? (
          <PdpSectionSkeleton />
        ) : (
          <VideoShowcaseContent
            productId={productId}
            onEmpty={() => setHidden(true)}
          />
        )}
      </div>
    </section>
  );
}
