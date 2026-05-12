import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const about = messages.aboutPage;

  return {
    title: about.metaTitle,
    description: about.metaDescription,
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const about = messages.aboutPage;

  return (
    <div className="relative min-h-[100dvh] bg-black">
      <div className="absolute inset-0">
        <Image
          src="/assets/images/hero/home-image.webp"
          alt="Fondo About"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <main className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 md:pt-32 md:pb-20">
        <div className="relative z-10 space-y-10">
          {/* 1️⃣ HERO DE MARCA */}
          <section className="mb-16 md:mb-24">
            <h1 className="hero-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {about.heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-white leading-relaxed max-w-2xl">
              {about.heroText}
            </p>
          </section>

        {/* 2️⃣ HISTORIA REAL DE GO NATURAL */}
        <section className="mb-16 md:mb-24">
          <h2 className="section-display text-2xl md:text-3xl font-bold text-white mb-6">
            {about.storyTitle}
          </h2>
          <div className="space-y-4 text-white leading-relaxed">
            {about.storyParagraphs.map((paragraph: string, index: number) => (
              <p key={`about-story-${index}`}>{paragraph}</p>
            ))}
          </div>
        </section>

        {/* 3️⃣ FILOSOFÍA DE PRODUCTO */}
        <section className="mb-16 md:mb-24">
          <h2 className="section-display text-2xl md:text-3xl font-bold text-white mb-6">
            {about.philosophyTitle}
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                {about.philosophyYesTitle}
              </h3>
              <ul className="space-y-2 text-white list-disc list-inside">
                {about.philosophyYesItems.map(
                  (item: string, index: number) => (
                    <li key={`about-yes-${index}`}>{item}</li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                {about.philosophyNoTitle}
              </h3>
              <ul className="space-y-2 text-white list-disc list-inside">
                {about.philosophyNoItems.map((item: string, index: number) => (
                  <li key={`about-no-${index}`}>{item}</li>
                ))}
              </ul>
            </div>
            <p className="text-white leading-relaxed pt-4">
              {about.philosophyClosing}
            </p>
          </div>
        </section>

        {/* 4️⃣ VALORES DE MARCA */}
        <section className="mb-16 md:mb-24">
          <h2 className="section-display text-2xl md:text-3xl font-bold text-white mb-8">
            {about.valuesTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {about.values.map(
              (value: { title: string; text: string }, index: number) => (
                <div key={`about-value-${index}`}>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-white leading-relaxed">{value.text}</p>
                </div>
              )
            )}
          </div>
        </section>

        {/* 5️⃣ CONFIANZA Y TRANSPARENCIA */}
        <section className="mb-16 md:mb-24">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            {about.trustTitle}
          </h2>
          <div className="space-y-6 text-white leading-relaxed">
            {about.trust.map(
              (item: { title: string; text: string }, index: number) => (
                <div key={`about-trust-${index}`}>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p>{item.text}</p>
                </div>
              )
            )}
          </div>
        </section>

          {/* 6️⃣ CTA FINAL */}
          <section className="text-center py-12 md:py-16 border-t border-gray-200">
            <h2 className="section-display text-2xl md:text-3xl font-bold text-white mb-4">
              {about.ctaTitle}
            </h2>
            <p className="text-white mb-8 max-w-xl mx-auto">{about.ctaText}</p>
        <Link
          href={`/${locale}/products`}
          className="inline-block px-8 py-3 bg-white text-black font-medium rounded-md hover:bg-gray-900 transition-colors duration-200"
        >
              {about.ctaButton}
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}

