"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Locale } from "@/lib/i18n/config";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import {
  INSTAGRAM_URL,
  PINTEREST_URL,
  SPOTIFY_URL,
  YOUTUBE_URL,
} from "@/lib/social-links";

const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const;

const legalSlugs = {
  privacy: {
    en: "privacy-policy",
    es: "politica-de-privacidad",
    fr: "politique-de-confidentialite",
    it: "informativa-sulla-privacy",
  },
  cookies: {
    en: "cookie-policy",
    es: "politica-de-cookies",
    fr: "politique-de-cookies",
    it: "informativa-sui-cookie",
  },
  terms: {
    en: "terms-and-conditions",
    es: "terminos-y-condiciones",
    fr: "conditions-generales",
    it: "termini-e-condizioni",
  },
  disclaimer: {
    en: "disclaimer",
    es: "descargo-de-responsabilidad",
    fr: "avis-de-non-responsabilite",
    it: "esclusione-di-responsabilita",
  },
} as const;

function buildLegalHref(
  key: keyof typeof legalSlugs,
  currentLocale: Locale
) {
  return `/${currentLocale}/${legalSlugs[key][currentLocale]}`;
}

const reveal = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

function IconMountain({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.35}
      className={className}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 18l4.5-6 3 4L16 8l4 10H4z"
      />
    </svg>
  );
}

function IconTools({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.35}
      className={className}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 6.5L4 13l2 2 6.5-6.5m0 0l5 5m-5-5l-1-1m6 5l2 2m-2-2l-5-5"
      />
    </svg>
  );
}

function IconCompass({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.35}
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 7v5l3 2"
      />
    </svg>
  );
}

function IconGlobe({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.35}
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path
        strokeLinecap="round"
        d="M3 12h18M12 3a14 14 0 010 18"
      />
    </svg>
  );
}

function IconLeaf({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.35}
      className={className}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18c6-1 12-7 12-14-7 0-13 6-14 12a4 4 0 002 2z"
      />
    </svg>
  );
}

function SocialIconInstagram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function SocialIconYouTube({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={className}
      aria-hidden
    >
      <path d="M4 8.5A2.5 2.5 0 016.5 6h11A2.5 2.5 0 0120 8.5v7a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 014 15.5v-7z" />
      <path
        strokeLinejoin="round"
        d="M10 9l5 3-5 3V9z"
      />
    </svg>
  );
}

function SocialIconSpotify({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm4.6 14.3c-.2 0-.3 0-.5-.1-1.4-.8-3.2-1.3-5.1-1.3-.9 0-1.9.1-2.8.3h-.1c-.3 0-.5-.2-.5-.5v-.2c0-.3.2-.5.5-.6 1-.2 2-.3 3-.3 2.1 0 4 .5 5.6 1.4.2.1.4.4.3.7 0 .2-.2.4-.4.3zm.6-3.3c-.2 0-.4-.1-.6-.2-1.6-1-3.7-1.5-5.9-1.5-1 0-2 .1-2.9.3-.4.1-.7-.2-.8-.5 0-.4.1-.7.5-.8 1-.2 2.1-.4 3.2-.4 2.5 0 4.8.6 6.7 1.7.3.2.4.6.2.9-.1.3-.4.5-.7.5zm.7-3.5c-1.9-1.1-4.5-1.7-7.3-1.7-1.2 0-2.3.1-3.4.4-.5.1-.9-.2-1-.7-.1-.5.2-1 .7-1.1 1.2-.3 2.5-.5 3.8-.5 3.1 0 6 .7 8.2 1.9.5.3.6.9.4 1.4-.2.4-.8.6-1.3.3z" />
    </svg>
  );
}

function SocialIconPinterest({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2C6.5 2 2 6.5 2 12c0 4.2 2.6 7.8 6.3 9.3-.1-.8-.1-2 0-2.9.1-.9 1-5.4 1-5.4s-.3-.5-.3-1.3c0-1.2.7-2.1 1.6-2.1.7 0 1.1.6 1.1 1.3 0 .8-.5 2-0.8 3.1-.2.9.5 1.7 1.5 1.7 1.8 0 3.2-1.9 3.2-4.7 0-2.5-1.8-4.2-4.3-4.2-2.9 0-4.6 2.2-4.6 4.5 0 .9.3 1.8.7 2.3.1.1.1.2.1.3l-.3 1.1c0 .2-.1.2-.3.1-1.2-.6-2-2.4-2-3.9 0-3.2 2.3-6.1 6.7-6.1 3.5 0 6.2 2.5 6.2 5.8 0 3.5-2.2 6.3-5.3 6.3-1 0-2-.5-2.4-1.2l-.7 2.5c-.2.9-.8 2-1.2 2.7 1 .3 2.1.5 3.2.5 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
    </svg>
  );
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Footer() {
  const locale = useLocale();
  const t = useTranslations();
  const reduceMotion = useReducedMotion() ?? false;
  const currentYear = new Date().getFullYear();

  const [email, setEmail] = useState("");
  const [marketing, setMarketing] = useState(false);
  const [joinState, setJoinState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [joinError, setJoinError] = useState<string | null>(null);

  const privacyHref = `/${locale}/${legalSlugs.privacy[locale]}`;

  const motionProps = useCallback(
    (delay = 0) =>
      reduceMotion
        ? {}
        : {
            variants: reveal,
            initial: "hidden" as const,
            whileInView: "show" as const,
            viewport: { once: true, margin: "-40px" },
            transition: { duration: 0.55, ease: PREMIUM_EASE, delay },
          },
    [reduceMotion]
  );

  const submitNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!marketing || joinState === "loading") return;
    const trimmed = email.trim();
    if (!EMAIL_REGEX.test(trimmed)) {
      setJoinState("error");
      setJoinError("invalid");
      return;
    }
    setJoinState("loading");
    setJoinError(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          locale,
          marketingAccepted: true,
          source: "footer_newsletter",
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        code?: string;
      };
      if (res.ok && data.ok) {
        setJoinState("success");
        return;
      }
      setJoinState("error");
      if (data.code === "duplicate") setJoinError("duplicate");
      else setJoinError("generic");
    } catch {
      setJoinState("error");
      setJoinError("generic");
    }
  };

  const editorialColumns = [
    {
      icon: IconMountain,
      heading: t("footer.editorial.col1Heading"),
      sub: t("footer.editorial.col1Sub"),
      href: `/${locale}/about`,
    },
    {
      icon: IconTools,
      heading: t("footer.editorial.col2Heading"),
      sub: t("footer.editorial.col2Sub"),
      href: `/${locale}/products`,
    },
    {
      icon: IconCompass,
      heading: t("footer.editorial.col3Heading"),
      sub: t("footer.editorial.col3Sub"),
      href: `/${locale}/blog`,
    },
    {
      icon: IconGlobe,
      heading: t("footer.editorial.col4Heading"),
      sub: t("footer.editorial.col4Sub"),
      href: `/${locale}/about`,
    },
    {
      icon: IconLeaf,
      heading: t("footer.editorial.col5Heading"),
      sub: t("footer.editorial.col5Sub"),
      href: buildLegalHref("terms", locale),
    },
  ];

  const helpLinks = [
    { href: `/${locale}/blog`, label: t("footer.help.helpCenter") },
    { href: `/${locale}/contact`, label: t("footer.help.contact") },
    { href: buildLegalHref("terms", locale), label: t("footer.help.shipping") },
    { href: `/${locale}/returns`, label: t("footer.help.returns") },
    { href: `/${locale}/contact`, label: t("footer.help.repairs") },
    { href: buildLegalHref("terms", locale), label: t("footer.help.warranty") },
  ];

  const moreLinks = [
    { href: `/${locale}/contact`, label: t("footer.more.contact") },
    { href: `/${locale}/about`, label: t("footer.more.stores") },
    { href: buildLegalHref("terms", locale), label: t("footer.more.payment") },
    { href: buildLegalHref("terms", locale), label: t("footer.more.terms") },
  ];

  const socials = [
    {
      href: INSTAGRAM_URL,
      label: t("footer.social.instagram"),
      Icon: SocialIconInstagram,
    },
    { href: YOUTUBE_URL, label: t("footer.social.youtube"), Icon: SocialIconYouTube },
    { href: SPOTIFY_URL, label: t("footer.social.spotify"), Icon: SocialIconSpotify },
    {
      href: PINTEREST_URL,
      label: t("footer.social.pinterest"),
      Icon: SocialIconPinterest,
    },
  ].filter((s) => s.href.length > 0);

  const joinErrMsg =
    joinError === "duplicate"
      ? t("footer.join.errorDuplicate")
      : joinError === "invalid"
        ? t("footer.join.errorInvalid")
        : joinError === "generic"
          ? t("footer.join.errorGeneric")
          : null;

  return (
    <footer className="mt-auto bg-black font-inter text-white">
      <div className="mx-auto max-w-[1500px] px-6 pb-16 pt-24 sm:px-10 md:pb-20 md:pt-28 lg:px-12 lg:pb-24 lg:pt-32">
        {/* Top editorial columns */}
        <motion.div
          className="grid grid-cols-1 gap-y-14 border-b border-white/[0.08] pb-20 md:grid-cols-2 md:gap-x-12 md:gap-y-16 md:pb-24 lg:grid-cols-5 lg:gap-x-14 lg:gap-y-0 lg:pb-28"
          {...(reduceMotion
            ? {}
            : {
                initial: "hidden",
                whileInView: "show",
                viewport: { once: true, margin: "-60px" },
                variants: { hidden: {}, show: { transition: { staggerChildren: 0.06 } } },
              })}
        >
          {editorialColumns.map((col, i) => {
            const Icon = col.icon;
            const cell = (
              <article className="flex max-w-md flex-col gap-5 lg:max-w-none">
                <Icon className="h-8 w-8 text-white/[0.42] transition-colors duration-500 ease-out lg:h-9 lg:w-9" />
                <h2 className="font-display text-balance text-[1.35rem] font-semibold leading-[1.15] tracking-[-0.02em] text-white md:text-2xl lg:text-[1.65rem]">
                  {col.heading}
                </h2>
                <Link
                  href={col.href}
                  className="group w-max max-w-full text-sm font-medium leading-relaxed text-white/[0.62] transition-colors duration-300 ease-out hover:text-[#D9A441]"
                >
                  <span className="border-b border-transparent pb-0.5 transition-[border-color] duration-300 group-hover:border-[#D9A441]/70">
                    {col.sub}
                  </span>
                </Link>
              </article>
            );
            return reduceMotion ? (
              <div key={col.heading}>{cell}</div>
            ) : (
              <motion.div key={col.heading} variants={reveal} transition={{ duration: 0.55, ease: PREMIUM_EASE, delay: i * 0.04 }}>
                {cell}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom: newsletter | help | more */}
        <div className="grid grid-cols-1 gap-16 pt-20 md:gap-20 lg:grid-cols-3 lg:gap-12 lg:pt-24 xl:gap-16">
          {/* Newsletter */}
          <motion.section
            className="flex min-w-0 flex-col gap-8"
            {...motionProps(0)}
          >
            <h3 className="font-display text-2xl font-semibold tracking-[-0.02em] text-white md:text-[1.75rem]">
              {t("footer.join.title")}
            </h3>
            <p className="max-w-md text-sm leading-relaxed text-white/[0.62] md:text-[0.9375rem]">
              {t("footer.join.subtitle")}
            </p>
            {joinState === "success" ? (
              <p className="text-sm font-medium text-[#D9A441]">
                {t("footer.join.success")}
              </p>
            ) : (
              <form onSubmit={submitNewsletter} className="flex max-w-md flex-col gap-6">
                <label className="sr-only" htmlFor="footer-newsletter-email">
                  {t("footer.join.emailLabel")}
                </label>
                <input
                  id="footer-newsletter-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(ev) => {
                    setEmail(ev.target.value);
                    if (joinState === "error") {
                      setJoinState("idle");
                      setJoinError(null);
                    }
                  }}
                  placeholder={t("footer.join.placeholder")}
                  className="w-full border-0 border-b border-white/35 bg-transparent pb-2.5 font-inter text-sm text-white placeholder:text-white/40 transition-colors duration-300 focus:border-[#D9A441] focus:outline-none focus:ring-0"
                />
                <label className="flex cursor-pointer items-start gap-3 text-xs leading-snug text-white/[0.58]">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/40 bg-black accent-[#D9A441] focus:outline-none focus:ring-2 focus:ring-[#D9A441]/35"
                  />
                  <span>
                    {t("footer.join.marketing")}{" "}
                    <Link
                      href={privacyHref}
                      className="text-white/[0.78] underline decoration-white/25 underline-offset-2 transition-colors hover:text-[#D9A441]"
                    >
                      {t("footer.join.privacy")}
                    </Link>
                  </span>
                </label>
                {joinErrMsg ? (
                  <p className="text-sm text-[#C9622B]" role="alert">
                    {joinErrMsg}
                  </p>
                ) : null}
                <button
                  type="submit"
                  disabled={!marketing || joinState === "loading" || !email.trim()}
                  className="w-full rounded-full border border-white px-6 py-3 font-inter text-xs font-semibold uppercase tracking-[0.16em] text-white transition-all duration-500 ease-out enabled:hover:-translate-y-0.5 enabled:hover:bg-white enabled:hover:text-black enabled:hover:shadow-[0_0_28px_rgba(255,255,255,0.12)] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                >
                  {joinState === "loading"
                    ? t("footer.join.sending")
                    : t("footer.join.cta")}
                </button>
              </form>
            )}
          </motion.section>

          {/* Help */}
          <motion.section
            className="flex min-w-0 flex-col gap-8"
            {...motionProps(0.06)}
          >
            <h3 className="font-display text-2xl font-semibold tracking-[-0.02em] text-white md:text-[1.75rem]">
              {t("footer.help.title")}
            </h3>
            <div className="flex flex-wrap gap-3">
              {helpLinks.map((item) => (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                  className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-white/35 px-5 py-2.5 text-center font-inter text-xs font-medium uppercase tracking-[0.12em] text-white/90 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#D9A441]/75 hover:text-[#D9A441] hover:shadow-[0_0_24px_rgba(217,164,65,0.12)] sm:w-auto sm:min-w-0"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.section>

          {/* More + social */}
          <motion.section
            className="flex min-w-0 flex-col gap-8"
            {...motionProps(0.12)}
          >
            <h3 className="font-display text-2xl font-semibold tracking-[-0.02em] text-white md:text-[1.75rem]">
              {t("footer.more.title")}
            </h3>
            <ul className="flex flex-col gap-3.5">
              {moreLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="font-inter text-sm text-white/[0.68] transition-colors duration-300 hover:text-[#D9A441]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            {socials.length > 0 ? (
              <div>
                <p className="mb-4 font-inter text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
                  {t("footer.social.title")}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                  {socials.map(({ href, label, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white/80 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-white/45 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.08)]"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </motion.section>
        </div>

        {/* Wordmark + copyright */}
        <div className="mt-20 border-t border-white/[0.08] pt-10 md:mt-24 md:pt-12">
          <div className="flex flex-col items-center gap-6 text-center sm:items-end sm:text-right">
            <p className="font-display text-xl font-medium tracking-[0.08em] text-white/90">
              {t("footer.copyrightBrand")}
            </p>
            <p className="max-w-prose font-inter text-xs leading-relaxed text-white/[0.48]">
              © {currentYear} {t("footer.copyrightBrand")}. {t("footer.rights")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
