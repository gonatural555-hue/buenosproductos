import SmartImage from "@/components/SmartImage";
import PremiumImageOverlay from "@/components/ui/PremiumImageOverlay";

type BlogPostHeroProps = {
  title: string;
  subtitle?: string;
  image: string;
};

export default function BlogPostHero({
  title,
  subtitle,
  image,
}: BlogPostHeroProps) {
  return (
    <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-end overflow-hidden">
      <div className="absolute inset-0">
        <SmartImage
          src={image}
          alt={title}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
      <PremiumImageOverlay />
      <div className="relative z-10 w-full">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 pb-14 md:pb-18">
          <h1 className="hero-display text-4xl md:text-5xl font-bold text-text-primary [text-shadow:0_2px_28px_rgba(0,0,0,0.5),0_1px_2px_rgba(0,0,0,0.4)]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-lg text-white/[0.88] drop-shadow-[0_1px_12px_rgba(0,0,0,0.4)]">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

