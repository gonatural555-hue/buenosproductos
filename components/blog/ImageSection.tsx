import SmartImage from "@/components/SmartImage";
import ScrollReveal from "@/components/blog/ScrollReveal";
import PremiumImageOverlay from "@/components/ui/PremiumImageOverlay";

type ImageSectionProps = {
  imageSrc: string;
  caption?: string;
  imageAlt: string;
};

/**
 * Full-bleed cinematic strip: image as narrative anchor, optional caption.
 */
export default function ImageSection({
  imageSrc,
  caption,
  imageAlt,
}: ImageSectionProps) {
  return (
    <section className="bg-warm-sand">
      <ScrollReveal className="w-full">
        <div className="relative min-h-[48vh] w-full md:min-h-[56vh] lg:min-h-[62vh]">
          <SmartImage
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="100vw"
            loading="lazy"
            className="object-cover object-center"
          />
          <PremiumImageOverlay />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark-base/50 via-transparent to-dark-base/20" />
        </div>
        {caption ? (
          <p className="mx-auto max-w-3xl px-6 py-8 text-center text-xs font-medium uppercase tracking-[0.28em] text-muted-gray sm:px-10 md:py-10">
            {caption}
          </p>
        ) : null}
      </ScrollReveal>
    </section>
  );
}
