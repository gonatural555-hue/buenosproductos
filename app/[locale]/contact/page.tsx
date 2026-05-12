"use client";

import Image from "next/image";
import { useState, FormEvent } from "react";
import { useTranslations } from "@/components/i18n/LocaleProvider";
import PremiumImageOverlay from "@/components/ui/PremiumImageOverlay";
import { premiumPrimaryCtaClass } from "@/lib/ui/premium-cta-classes";

export default function ContactPage() {
  const t = useTranslations();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
    // Reset form
    setFormData({ name: "", email: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="relative min-h-[100dvh] bg-dark-base">
      <div className="absolute inset-0">
        <Image
          src="/assets/images/hero/contact.webp"
          alt="Fondo de contacto"
          fill
          className="object-cover object-center"
          priority
        />
        <PremiumImageOverlay />
      </div>
      <main className="relative mx-auto max-w-7xl px-4 pb-12 pt-28 sm:px-6 md:pb-20 md:pt-32 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16 lg:gap-20">
        {/* Columna izquierda - Información de contacto */}
        <div>
          <h1 className="hero-display mb-8 text-3xl font-bold tracking-tight text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.45)] md:text-4xl">
            {t("contactPage.title")}
          </h1>
          <div className="space-y-7 leading-relaxed text-white/[0.9]">
            <p className="text-base md:text-[1.05rem]">
              {t("contactPage.intro")}
            </p>

            <div className="pt-1">
              <h2 className="mb-2 text-lg font-semibold text-white">
                {t("contactPage.emailTitle")}
              </h2>
              <a
                href="mailto:go.natural.555@gmail.com"
                className="text-accent-gold underline decoration-accent-gold/40 underline-offset-4 transition-colors duration-200 hover:text-accent-gold/90"
              >
                go.natural.555@gmail.com
              </a>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-white">
                {t("contactPage.hoursTitle")}
              </h2>
              <p className="text-white/[0.88]">
                {t("contactPage.hoursLine1")}
                <br />
                {t("contactPage.hoursLine2")}
                <br />
                {t("contactPage.hoursLine3")}
              </p>
            </div>

            <div className="border-t border-white/12 pt-6">
              <p className="text-sm leading-relaxed text-white/[0.82]">
                <strong className="font-semibold text-white">
                  {t("contactPage.quickTitle")}
                </strong>{" "}
                {t("contactPage.quickText")}
              </p>
            </div>
          </div>
        </div>

        {/* Columna derecha - Formulario */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-white"
              >
                {t("contactPage.form.nameLabel")}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-sm border border-white/20 bg-black/35 px-4 py-3 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm transition-all duration-200 placeholder:text-white/45 focus:border-accent-gold/55 focus:outline-none focus:ring-2 focus:ring-accent-gold/35"
                placeholder={t("contactPage.form.namePlaceholder")}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-white"
              >
                {t("contactPage.form.emailLabel")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-sm border border-white/20 bg-black/35 px-4 py-3 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm transition-all duration-200 placeholder:text-white/45 focus:border-accent-gold/55 focus:outline-none focus:ring-2 focus:ring-accent-gold/35"
                placeholder={t("contactPage.form.emailPlaceholder")}
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-white"
              >
                {t("contactPage.form.messageLabel")}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full resize-none rounded-sm border border-white/20 bg-black/35 px-4 py-3 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm transition-all duration-200 placeholder:text-white/45 focus:border-accent-gold/55 focus:outline-none focus:ring-2 focus:ring-accent-gold/35"
                placeholder={t("contactPage.form.messagePlaceholder")}
              />
            </div>

            <button type="submit" className={`${premiumPrimaryCtaClass} w-full`}>
              {t("contactPage.form.submit")}
            </button>
          </form>
        </div>
        </div>
      </main>
    </div>
  );
}

