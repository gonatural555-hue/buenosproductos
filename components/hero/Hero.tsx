import Link from "next/link";

type HeroProps = {
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
};

export default function Hero({
  titleLine1,
  titleLine2,
  subtitle,
  ctaLabel,
  ctaHref,
}: HeroProps) {
  return (
    <section className="relative min-h-[100dvh] md:min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/assets/images/hero/hero.webp"
          alt="Outdoor landscape"
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-base/90 via-dark-base/60 to-dark-base/90" />

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-24">
          <div className="max-w-2xl">
            <h1 className="hero-fade-up hero-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white">
              {titleLine1}
              <br />
              {titleLine2}
            </h1>
            <p className="hero-fade-up hero-delay-1 mt-6 text-lg sm:text-xl text-text-muted">
              {subtitle}
            </p>
            <div className="hero-fade-up hero-delay-2 mt-10">
              <Link
                href={ctaHref}
                className="inline-flex items-center justify-center rounded-md bg-accent-gold px-6 py-3 text-sm font-medium text-dark-base transition-all duration-300 ease-out hover:bg-accent-gold/90 hover:scale-[1.06]"
              >
                {ctaLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

