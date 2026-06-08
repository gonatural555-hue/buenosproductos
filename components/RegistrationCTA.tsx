"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import { useTranslations, useLocale } from "@/components/i18n/LocaleProvider";
import { shouldShowRegistrationCta } from "@/lib/newsletter-cta";
import { submitNewsletterSubscription } from "@/lib/newsletter-client";
import { isGoodIdeasPath } from "@/lib/routing/brands";

const SESSION_STORAGE_MINIMIZED = "gn-registration-cta-minimized";
const SESSION_STORAGE_SUBSCRIBED = "gn-newsletter-cta-subscribed";

type SubmitState = "idle" | "loading" | "success" | "error";

export default function RegistrationCTA() {
  const pathname = usePathname();
  const locale = useLocale();
  const { isLoggedIn } = useUser();
  const { authOpen } = useAuth();
  const t = useTranslations();
  const ctaRootRef = useRef<HTMLDivElement>(null);
  const newsletterInputFocusedRef = useRef(false);

  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isInputFocusedElsewhere, setIsInputFocusedElsewhere] = useState(false);
  const [sessionSubscribed, setSessionSubscribed] = useState(false);

  const [email, setEmail] = useState("");
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const privacyHref = `/${locale}/privacy-policy`;

  const syncVisibility = useCallback(() => {
    if (typeof window === "undefined") return;

    if (isLoggedIn || authOpen) {
      setIsVisible(false);
      return;
    }

    if (sessionStorage.getItem(SESSION_STORAGE_SUBSCRIBED) === "true") {
      setSessionSubscribed(true);
      setIsVisible(false);
      return;
    }

    if (!pathname || !shouldShowRegistrationCta(pathname)) {
      setIsVisible(false);
      return;
    }

    const minimized =
      sessionStorage.getItem(SESSION_STORAGE_MINIMIZED) === "true";
    setIsMinimized(minimized);
    setIsVisible(true);
  }, [authOpen, isLoggedIn, pathname]);

  useEffect(() => {
    queueMicrotask(() => {
      syncVisibility();
    });
  }, [syncVisibility]);

  useEffect(() => {
    if (isLoggedIn && typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_STORAGE_MINIMIZED);
    }
  }, [isLoggedIn]);

  // Teclado móvil: ocultar el CTA solo si el foco está en otro input (no en el email del CTA).
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth >= 768) return;

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (ctaRootRef.current?.contains(target)) return;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        queueMicrotask(() => {
          setIsInputFocusedElsewhere(true);
          setIsVisible(false);
        });
      }
    };

    const restoreAfterKeyboard = () => {
      setTimeout(() => {
        queueMicrotask(() => {
          setIsInputFocusedElsewhere(false);
          if (
            !isLoggedIn &&
            !authOpen &&
            pathname &&
            shouldShowRegistrationCta(pathname)
          ) {
            if (sessionStorage.getItem(SESSION_STORAGE_SUBSCRIBED) === "true")
              return;
            const minimized =
              sessionStorage.getItem(SESSION_STORAGE_MINIMIZED) === "true";
            setIsMinimized(minimized);
            setIsVisible(true);
          }
        });
      }, 300);
    };

    const handleFocusOut = () => {
      restoreAfterKeyboard();
    };

    const initialViewportHeight =
      window.visualViewport?.height ?? window.innerHeight;
    const handleResize = () => {
      if (newsletterInputFocusedRef.current) return;
      if (window.innerWidth >= 768) return;
      const currentHeight = window.visualViewport?.height ?? window.innerHeight;
      const heightDiff = initialViewportHeight - currentHeight;
      if (heightDiff > 150) {
        queueMicrotask(() => {
          setIsInputFocusedElsewhere(true);
          setIsVisible(false);
        });
      } else if (heightDiff < 50) {
        restoreAfterKeyboard();
      }
    };

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);
    window.visualViewport?.addEventListener("resize", handleResize);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
      window.visualViewport?.removeEventListener("resize", handleResize);
      window.removeEventListener("resize", handleResize);
    };
  }, [authOpen, isLoggedIn, pathname]);

  const handleMinimize = () => {
    setIsMinimized(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_STORAGE_MINIMIZED, "true");
    }
  };

  const handleExpand = () => {
    setIsMinimized(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_STORAGE_MINIMIZED);
    }
  };

  const handleHideAfterSuccess = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_STORAGE_SUBSCRIBED, "true");
    }
    setSessionSubscribed(true);
    setIsVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!marketingAccepted || submitState === "loading") return;

    setSubmitState("loading");
    setErrorCode(null);

    const result = await submitNewsletterSubscription({
      email,
      locale,
      marketingAccepted: true,
      source: "registration_cta",
    });

    if (result.ok) {
      setSubmitState("success");
      return;
    }

    setSubmitState("error");
    setErrorCode(result.code);
  };

  if (sessionSubscribed) return null;
  if (!isVisible || isInputFocusedElsewhere) return null;

  const errorMessage =
    errorCode === "duplicate"
      ? t("registrationCTA.errorDuplicate")
      : errorCode === "invalid_email"
        ? t("registrationCTA.errorInvalidEmail")
        : errorCode === "marketing_required"
          ? t("registrationCTA.errorMarketingRequired")
          : errorCode === "generic"
            ? t("registrationCTA.errorGeneric")
            : null;
  const isGoodIdeas = pathname ? isGoodIdeasPath(pathname) : false;
  const palette = isGoodIdeas
    ? {
        minimizedButton:
          "font-inter w-full rounded-full border border-white/[0.08] bg-[#151B24] px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-[#E8ECF1] shadow-[0_10px_36px_-12px_rgba(0,0,0,0.52),0_2px_8px_rgba(0,0,0,0.22)] transition hover:border-[rgba(59,130,246,0.45)] hover:bg-[#1B2432] hover:text-white md:w-auto md:px-4 md:text-xs",
        panel:
          "rounded-2xl border border-white/[0.08] bg-[#151B24] p-4 shadow-[0_18px_48px_-20px_rgba(0,0,0,0.6),0_6px_20px_rgba(0,0,0,0.28)] sm:p-5",
        title:
          "font-display text-balance text-lg font-medium leading-snug tracking-[-0.02em] text-[#E8ECF1] md:text-xl",
        subtitle:
          "font-inter mt-1.5 text-sm leading-relaxed text-[rgba(232,236,241,0.78)]",
        secondaryText:
          "font-inter mt-1 text-xs leading-relaxed text-[rgba(232,236,241,0.55)]",
        iconButton:
          "shrink-0 rounded-lg p-1 text-[rgba(232,236,241,0.55)] transition hover:bg-white/[0.06] hover:text-[#E8ECF1]",
        successText:
          "font-inter text-sm font-medium leading-relaxed text-[#E8ECF1]",
        primaryAction:
          "font-inter inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-[#3B82F6] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(59,130,246,0.28),inset_0_1px_0_rgba(255,255,255,0.12)] transition hover:bg-[#2563EB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#151B24]",
        submitAction:
          "font-inter inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-[#3B82F6] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(59,130,246,0.28),inset_0_1px_0_rgba(255,255,255,0.12)] transition enabled:hover:bg-[#2563EB] enabled:focus:outline-none enabled:focus-visible:ring-2 enabled:focus-visible:ring-[#3B82F6]/50 enabled:focus-visible:ring-offset-2 enabled:focus-visible:ring-offset-[#151B24] disabled:cursor-not-allowed disabled:opacity-45",
        secondaryAction:
          "font-inter inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/[0.12] px-4 py-2.5 text-sm font-medium text-[#E8ECF1] transition hover:border-[rgba(59,130,246,0.38)] hover:bg-[rgba(59,130,246,0.1)]",
        input:
          "font-inter w-full rounded-xl border border-white/[0.12] bg-[#0B0F14] px-3 py-2.5 text-sm text-[#E8ECF1] placeholder:text-[rgba(232,236,241,0.4)] shadow-inner outline-none ring-[#3B82F6]/25 transition focus:border-[rgba(59,130,246,0.45)] focus:ring-2",
        checkboxLabel:
          "font-inter flex cursor-pointer gap-2.5 text-left text-xs leading-snug text-[rgba(232,236,241,0.82)]",
        checkbox:
          "mt-0.5 h-4 w-4 shrink-0 rounded border-white/[0.22] bg-[#0B0F14] text-[#3B82F6] focus:ring-[#3B82F6]/30",
        privacyLink:
          "font-medium text-[#3B82F6] underline decoration-[rgba(59,130,246,0.35)] underline-offset-2 hover:decoration-[#3B82F6]",
        error: "font-inter text-sm text-[#FCA5A5]",
      }
    : {
        minimizedButton:
          "font-inter w-full rounded-full border border-[rgba(110,31,40,0.35)] bg-[#F4EBDD] px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2E4A36] shadow-[0_10px_36px_-12px_rgba(46,74,54,0.35),0_2px_8px_rgba(46,74,54,0.08)] transition hover:border-[#6E1F28]/55 hover:shadow-[0_14px_40px_-10px_rgba(46,74,54,0.28)] md:w-auto md:px-4 md:text-xs",
        panel:
          "rounded-2xl border border-[rgba(46,74,54,0.12)] bg-[#F4EBDD] p-4 shadow-[0_18px_48px_-20px_rgba(46,74,54,0.35),0_6px_20px_rgba(46,74,54,0.12)] sm:p-5",
        title:
          "font-display text-balance text-lg font-medium leading-snug tracking-[-0.02em] text-[#2E4A36] md:text-xl",
        subtitle:
          "font-inter mt-1.5 text-sm leading-relaxed text-[rgba(46,74,54,0.78)]",
        secondaryText:
          "font-inter mt-1 text-xs leading-relaxed text-[rgba(46,74,54,0.62)]",
        iconButton:
          "shrink-0 rounded-lg p-1 text-[rgba(46,74,54,0.55)] transition hover:bg-[rgba(46,74,54,0.06)] hover:text-[#2E4A36]",
        successText:
          "font-inter text-sm font-medium leading-relaxed text-[#2E4A36]",
        primaryAction:
          "font-inter inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-[#6E1F28] px-4 py-2.5 text-sm font-semibold text-[#F4EBDD] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition hover:bg-[#5c1a22] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E4A36]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4EBDD]",
        submitAction:
          "font-inter inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-[#6E1F28] px-4 py-2.5 text-sm font-semibold text-[#F4EBDD] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition enabled:hover:bg-[#5c1a22] enabled:focus:outline-none enabled:focus-visible:ring-2 enabled:focus-visible:ring-[#2E4A36]/30 enabled:focus-visible:ring-offset-2 enabled:focus-visible:ring-offset-[#F4EBDD] disabled:cursor-not-allowed disabled:opacity-45",
        secondaryAction:
          "font-inter inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[rgba(46,74,54,0.2)] px-4 py-2.5 text-sm font-medium text-[#2E4A36] transition hover:border-[rgba(46,74,54,0.35)] hover:bg-[rgba(46,74,54,0.04)]",
        input:
          "font-inter w-full rounded-xl border border-[rgba(46,74,54,0.18)] bg-white/90 px-3 py-2.5 text-sm text-[#2E4A36] placeholder:text-[rgba(46,74,54,0.45)] shadow-inner outline-none ring-[#6E1F28]/25 transition focus:border-[rgba(110,31,40,0.45)] focus:ring-2",
        checkboxLabel:
          "font-inter flex cursor-pointer gap-2.5 text-left text-xs leading-snug text-[rgba(46,74,54,0.85)]",
        checkbox:
          "mt-0.5 h-4 w-4 shrink-0 rounded border-[rgba(46,74,54,0.35)] text-[#6E1F28] focus:ring-[#6E1F28]/30",
        privacyLink:
          "font-medium text-[#6E1F28] underline decoration-[rgba(110,31,40,0.35)] underline-offset-2 hover:decoration-[#6E1F28]",
        error: "font-inter text-sm text-[#6E1F28]",
      };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 left-1/2 z-[45] w-[min(100%-1rem,calc(100vw-1rem))] max-w-sm -translate-x-1/2 animate-fade-in pb-[max(0.75rem,env(safe-area-inset-bottom))] md:left-4 md:w-auto md:max-w-none md:translate-x-0">
        <button
          type="button"
          onClick={handleExpand}
          className={palette.minimizedButton}
          aria-label={t("registrationCTA.expand")}
        >
          {t("registrationCTA.minimizedLabel")}
        </button>
      </div>
    );
  }

  return (
    <div
      ref={ctaRootRef}
      data-gn-newsletter-cta
      className="fixed bottom-4 left-1/2 z-[45] w-[min(100%-1rem,calc(100vw-1rem))] max-w-md -translate-x-1/2 animate-fade-in pb-[max(0.75rem,env(safe-area-inset-bottom))] md:left-4 md:translate-x-0"
    >
      <div className={palette.panel}>
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className={palette.title}>
              {t("registrationCTA.title")}
            </h3>
            <p className={palette.subtitle}>
              {t("registrationCTA.subtitle")}
            </p>
            <p className={palette.secondaryText}>
              {t("registrationCTA.secondaryText")}
            </p>
          </div>
          <button
            type="button"
            onClick={handleMinimize}
            className={palette.iconButton}
            aria-label={t("registrationCTA.minimize")}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
          </button>
        </div>

        {submitState === "success" ? (
          <div className="space-y-3">
            <p className={palette.successText}>
              {t("registrationCTA.successMessage")}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleHideAfterSuccess}
                className={palette.primaryAction}
              >
                {t("registrationCTA.hideAfterSuccess")}
              </button>
              <button
                type="button"
                onClick={handleMinimize}
                className={palette.secondaryAction}
              >
                {t("registrationCTA.minimize")}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="gn-newsletter-email" className="sr-only">
                {t("registrationCTA.emailLabel")}
              </label>
              <input
                id="gn-newsletter-email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(ev) => {
                  setEmail(ev.target.value);
                  if (submitState === "error") {
                    setSubmitState("idle");
                    setErrorCode(null);
                  }
                }}
                onFocus={() => {
                  newsletterInputFocusedRef.current = true;
                }}
                onBlur={() => {
                  newsletterInputFocusedRef.current = false;
                }}
                placeholder={t("registrationCTA.emailPlaceholder")}
                className={palette.input}
                required
              />
            </div>

            <label className={palette.checkboxLabel}>
              <input
                type="checkbox"
                checked={marketingAccepted}
                onChange={(e) => {
                  setMarketingAccepted(e.target.checked);
                  if (submitState === "error") {
                    setSubmitState("idle");
                    setErrorCode(null);
                  }
                }}
                className={palette.checkbox}
              />
              <span>
                {t("registrationCTA.marketingLabel")}{" "}
                <Link
                  href={privacyHref}
                  className={palette.privacyLink}
                >
                  {t("registrationCTA.privacyLink")}
                </Link>
              </span>
            </label>

            {errorMessage ? (
              <p className={palette.error} role="alert">
                {errorMessage}
              </p>
            ) : null}

            <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
              <button
                type="submit"
                disabled={
                  !marketingAccepted || submitState === "loading" || !email.trim()
                }
                className={palette.submitAction}
              >
                {submitState === "loading"
                  ? t("registrationCTA.submitLoading")
                  : t("registrationCTA.cta")}
              </button>
              <button
                type="button"
                onClick={handleMinimize}
                className={palette.secondaryAction}
              >
                {t("registrationCTA.minimize")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
