"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import { useTranslations, useLocale } from "@/components/i18n/LocaleProvider";
import { shouldShowRegistrationCta } from "@/lib/newsletter-cta";
import { submitNewsletterSubscription } from "@/lib/newsletter-client";
import { newsletterCtaStyles as s } from "@/lib/ui/newsletter-cta-styles";

const SESSION_STORAGE_MINIMIZED = "gn-registration-cta-minimized";
const SESSION_STORAGE_SUBSCRIBED = "gn-newsletter-cta-subscribed";
const MD_MEDIA_QUERY = "(min-width: 768px)";

function subscribeMdViewport(onChange: () => void) {
  const mq = window.matchMedia(MD_MEDIA_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getMdViewportSnapshot() {
  return window.matchMedia(MD_MEDIA_QUERY).matches;
}

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
  const isDesktop = useSyncExternalStore(
    subscribeMdViewport,
    getMdViewportSnapshot,
    () => false
  );

  const privacyHref = `/${locale}/privacy-policy`;

  const syncVisibility = useCallback(() => {
    if (typeof window === "undefined") return;

    if (!isDesktop) {
      setIsVisible(false);
      return;
    }

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
  }, [authOpen, isDesktop, isLoggedIn, pathname]);

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
            isDesktop &&
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
  }, [authOpen, isDesktop, isLoggedIn, pathname]);

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

  if (!isDesktop) return null;
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

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 left-1/2 z-[45] w-[min(100%-1rem,calc(100vw-1rem))] max-w-sm -translate-x-1/2 animate-fade-in pb-[max(0.75rem,env(safe-area-inset-bottom))] md:left-4 md:w-auto md:max-w-none md:translate-x-0">
        <button
          type="button"
          onClick={handleExpand}
          className={s.minimizedButton}
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
      <div className={s.panel}>
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className={s.title}>
              {t("registrationCTA.title")}
            </h3>
            <p className={s.subtitle}>
              {t("registrationCTA.subtitle")}
            </p>
            <p className={s.secondaryText}>
              {t("registrationCTA.secondaryText")}
            </p>
          </div>
          <button
            type="button"
            onClick={handleMinimize}
            className={s.iconButton}
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
            <p className={s.successText}>
              {t("registrationCTA.successMessage")}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
              <button
                type="button"
                onClick={handleHideAfterSuccess}
                className={s.primaryAction}
              >
                {t("registrationCTA.hideAfterSuccess")}
              </button>
              <button
                type="button"
                onClick={handleMinimize}
                className={s.secondaryAction}
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
                className={s.input}
                required
              />
            </div>

            <label className={s.checkboxLabel}>
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
                className={s.checkbox}
              />
              <span>
                {t("registrationCTA.marketingLabel")}{" "}
                <Link
                  href={privacyHref}
                  className={s.privacyLink}
                >
                  {t("registrationCTA.privacyLink")}
                </Link>
              </span>
            </label>

            {errorMessage ? (
              <p className={s.error} role="alert">
                {errorMessage}
              </p>
            ) : null}

            <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
              <button
                type="submit"
                disabled={
                  !marketingAccepted || submitState === "loading" || !email.trim()
                }
                className={s.submitAction}
              >
                {submitState === "loading"
                  ? t("registrationCTA.submitLoading")
                  : t("registrationCTA.cta")}
              </button>
              <button
                type="button"
                onClick={handleMinimize}
                className={s.secondaryAction}
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
