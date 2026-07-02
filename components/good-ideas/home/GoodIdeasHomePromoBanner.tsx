import SmartImage from "@/components/SmartImage";
import HomeContainer from "@/components/good-ideas/home/HomeContainer";
import GoodIdeasPromoHexPattern from "@/components/good-ideas/home/GoodIdeasPromoHexPattern";
import { PrimaryButton } from "@/components/good-ideas/home";
import type { GoodIdeasHomePromoProductVisual } from "@/lib/good-ideas-home-promo";
import { GI_HERO_GRID_OVERLAY } from "@/lib/ui/goodideas-design";

type Props = {
  title: string;
  highlight: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  sectionAriaLabel: string;
  products: GoodIdeasHomePromoProductVisual[];
};

function PromoProductStack({
  products,
}: {
  products: GoodIdeasHomePromoProductVisual[];
}) {
  if (products.length === 0) return null;

  const offsets = [
    "translate-x-0 rotate-[-4deg]",
    "translate-x-6 -translate-y-3 rotate-[3deg]",
    "translate-x-12 -translate-y-6 rotate-[-2deg]",
  ];

  return (
    <div
      className="relative hidden h-[220px] w-full max-w-[320px] shrink-0 lg:block xl:max-w-[360px]"
      aria-hidden
    >
      {products.slice(0, 3).map((product, index) => (
        <div
          key={product.id}
          className={`absolute bottom-0 left-0 w-[58%] overflow-hidden rounded-[18px] border border-white/[0.12] bg-[#0B0F14]/80 shadow-[0_20px_48px_rgba(0,0,0,0.35)] ${offsets[index] ?? offsets[0]}`}
          style={{ zIndex: 10 + index }}
        >
          <div className="relative aspect-square">
            <SmartImage
              src={product.image}
              alt=""
              fill
              sizes="180px"
              className="object-cover"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function GoodIdeasHomePromoBanner({
  title,
  highlight,
  subtitle,
  ctaLabel,
  ctaHref,
  sectionAriaLabel,
  products,
}: Props) {
  return (
    <section
      className="border-t border-white/[0.08] bg-[#0B0F14] py-16 md:py-20 lg:py-24"
      aria-label={sectionAriaLabel}
    >
      <HomeContainer innerClassName="max-w-[1320px]">
        <div className="relative overflow-hidden rounded-[24px] border border-[rgba(59,130,246,0.35)] bg-[#151B24] shadow-[0_24px_64px_rgba(59,130,246,0.12)]">
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,#151B24_0%,#1a2433_42%,rgba(59,130,246,0.22)_100%)]"
            aria-hidden
          />
          <div
            className={`pointer-events-none absolute inset-0 ${GI_HERO_GRID_OVERLAY.radial}`}
            aria-hidden
          />
          <GoodIdeasPromoHexPattern />

          <div className="relative z-[1] flex flex-col gap-8 p-6 sm:p-8 md:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:p-12">
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-balance text-[clamp(1.5rem,4vw,2.25rem)] font-semibold leading-tight tracking-[-0.02em] text-[#E8ECF1]">
                {title}
              </h2>

              <p className="mt-4 font-display text-[clamp(2rem,6vw,3.25rem)] font-bold leading-none tracking-[-0.03em] text-[#3B82F6]">
                {highlight}
              </p>

              <p className="mt-4 max-w-xl font-body text-sm leading-relaxed text-[rgba(232,236,241,0.72)] sm:text-base">
                {subtitle}
              </p>

              <div className="mt-7 sm:mt-8">
                <PrimaryButton href={ctaHref} fullWidth className="sm:w-auto sm:min-w-[220px]">
                  {ctaLabel}
                </PrimaryButton>
              </div>
            </div>

            <PromoProductStack products={products} />
          </div>
        </div>
      </HomeContainer>
    </section>
  );
}
