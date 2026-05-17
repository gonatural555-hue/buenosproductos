import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { GI_HERO_TOP_PAD } from "@/lib/ui/goodideas-design";
import GoodIdeasHeader from "@/components/good-ideas/GoodIdeasHeader";

export default function GoodIdeasHomePage({
  locale: _locale,
  title,
  subtitle,
  cta,
  comingSoon,
}: {
  locale: Locale;
  title: string;
  subtitle: string;
  cta: string;
  comingSoon: string;
}) {
  return (
    <>
      <GoodIdeasHeader />
      <main className="relative min-h-[100dvh] overflow-hidden bg-[#0B0F14] text-[#E8ECF1]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-10%,rgba(59,130,246,0.22),transparent_60%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:56px_56px]"
          aria-hidden
        />

        <section
          className={`relative mx-auto flex min-h-[100dvh] max-w-[900px] flex-col justify-center px-6 pb-20 ${GI_HERO_TOP_PAD}`}
        >
          <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.24em] text-[rgba(232,236,241,0.45)]">
            Good Ideas
          </p>
          <h1 className="mt-4 font-tan-nimbus text-[clamp(2.5rem,6vw,4.25rem)] font-normal leading-[0.95] tracking-[-0.02em] text-white">
            {title}
          </h1>
          <p className="mt-6 max-w-xl font-inter text-[17px] leading-relaxed text-[rgba(232,236,241,0.72)] md:text-[18px]">
            {subtitle}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="#coming-soon"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#E8ECF1] px-8 font-inter text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0B0F14] transition duration-300 hover:-translate-y-0.5 hover:bg-white"
            >
              {cta}
            </Link>
          </div>

          <p
            id="coming-soon"
            className="mt-16 max-w-md border-t border-white/10 pt-8 font-inter text-[14px] leading-relaxed text-[rgba(232,236,241,0.5)]"
          >
            {comingSoon}
          </p>
        </section>
      </main>
    </>
  );
}
