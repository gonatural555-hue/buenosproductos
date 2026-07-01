import SmartImage from "@/components/SmartImage";
import {
  PdpDtcHorizontalTile,
  PdpDtcHorizontalTileRow,
} from "@/components/good-ideas/PdpDtcHorizontalTileRow";
import { isValidImageSrc, isVideoSrc } from "@/lib/image-src";
import { GI_DTC } from "@/lib/ui/gi-pdp-dtc";

type Props = {
  images: string[];
  productTitle: string;
};

function LifestyleMediaItem({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  if (isVideoSrc(src)) {
    return (
      <video
        src={src}
        className="h-full w-full object-cover object-center"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={alt}
      />
    );
  }

  return (
    <SmartImage
      src={src}
      alt={alt}
      fill
      loading="lazy"
      className="object-cover object-center"
      sizes={`${GI_DTC.horizontalTileWidthPx}px`}
    />
  );
}

export default function PdpDtcLifestyleSection({
  images,
  productTitle,
}: Props) {
  const items = images.filter(isValidImageSrc);
  if (items.length === 0) return null;

  return (
    <section
      className="border-t border-[#E5E7EB] bg-white"
      aria-label={productTitle}
    >
      <div className={`${GI_DTC.container} py-10 md:py-14`}>
        <PdpDtcHorizontalTileRow aria-label={productTitle}>
          {items.map((src, index) => (
            <PdpDtcHorizontalTile key={`${src}-${index}`} className="bg-[#FAFAFA]">
              <LifestyleMediaItem
                src={src}
                alt={`${productTitle} — ${index + 1}`}
              />
            </PdpDtcHorizontalTile>
          ))}
        </PdpDtcHorizontalTileRow>
      </div>
    </section>
  );
}
