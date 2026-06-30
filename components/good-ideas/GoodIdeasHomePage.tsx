import GoodIdeasHomeHero from "@/components/good-ideas/GoodIdeasHomeHero";
import type { Locale } from "@/lib/i18n/config";

export default function GoodIdeasHomePage({
  locale,
  title,
  subtitle,
  eyebrow,
  cta,
  sectionAriaLabel,
}: {
  locale: Locale;
  title: string;
  subtitle: string;
  eyebrow: string;
  cta: string;
  sectionAriaLabel: string;
}) {
  return (
    <main className="bg-[#0B0F14] text-[#E8ECF1]">
      <GoodIdeasHomeHero
        locale={locale}
        title={title}
        subtitle={subtitle}
        eyebrow={eyebrow}
        ctaLabel={cta}
        sectionAriaLabel={sectionAriaLabel}
      />
    </main>
  );
}
