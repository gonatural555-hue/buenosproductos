"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Suspense,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useHomeNewsletterModal } from "@/context/HomeNewsletterModalContext";
import { useUser } from "@/context/UserContext";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import GoNaturalHomeNewsletterDirectorPanel from "@/components/go-natural/GoNaturalHomeNewsletterDirectorPanel";
import { submitNewsletterSubscription } from "@/lib/newsletter-client";
import { GN_COLORS } from "@/lib/ui/gonatural-design";
import {
  GN_HOME_NEWSLETTER_BACKGROUND,
  GN_HOME_NEWSLETTER_BACKGROUND_OPACITY,
  GN_HOME_NEWSLETTER_DISMISSED,
  GN_HOME_NEWSLETTER_MINIMIZED,
  GN_HOME_NEWSLETTER_MODAL,
  GN_HOME_NEWSLETTER_SOURCE,
  GN_HOME_NEWSLETTER_SUBSCRIBED,
} from "@/lib/newsletter-home-modal";
import {
  GN_HOME_NEWSLETTER_PANEL_CLASS,
  elementOffsetTransform,
  isHomeNewsletterDirectorMode,
  loadHomeNewsletterBlockLayout,
  type HomeNewsletterBlockLayout,
} from "@/lib/newsletter-home-modal-layout";
import { isGoNaturalHomePath } from "@/lib/routing/brands";

type SubmitState = "idle" | "loading" | "success" | "error";

const { width: MODAL_W, height: MODAL_H } = GN_HOME_NEWSLETTER_MODAL;

const primaryCtaClass =
  "font-inter inline-flex h-[46px] w-full shrink-0 items-center justify-center rounded-none bg-[linear-gradient(135deg,#1F3527_0%,#2E4A36_50%,#3E654B_100%)] px-6 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#F4EBDD] shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] transition duration-300 hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A441]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-45";

function GoNaturalHomeNewsletterModalInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations();
  const { isLoggedIn } = useUser();
  const { authOpen, openAuthModal } = useAuth();
  const { setSuppressHeader } = useHomeNewsletterModal();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const isDirector = isHomeNewsletterDirectorMode(searchParams);

  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [email, setEmail] = useState("");
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [blockLayout, setBlockLayout] = useState<HomeNewsletterBlockLayout>(
    () => loadHomeNewsletterBlockLayout()
  );

  const privacyHref = `/${locale}/privacy-policy`;
  const isHomeGn = pathname ? isGoNaturalHomePath(pathname) : false;
  const isExpandedOpen = isHomeGn && isVisible && !isMinimized;

  const syncVisibility = useCallback(() => {
    if (typeof window === "undefined" || !pathname) return;

    if (!isGoNaturalHomePath(pathname)) {
      setIsVisible(false);
      return;
    }

    if (isDirector) {
      setIsMinimized(false);
      setIsVisible(true);
      return;
    }

    if (isLoggedIn || authOpen) {
      setIsVisible(false);
      return;
    }

    if (sessionStorage.getItem(GN_HOME_NEWSLETTER_SUBSCRIBED) === "true") {
      setIsVisible(false);
      return;
    }

    if (sessionStorage.getItem(GN_HOME_NEWSLETTER_DISMISSED) === "true") {
      setIsVisible(false);
      return;
    }

    const minimized =
      sessionStorage.getItem(GN_HOME_NEWSLETTER_MINIMIZED) === "true";
    setIsMinimized(minimized);
    setIsVisible(true);
  }, [authOpen, isDirector, isLoggedIn, pathname]);

  useEffect(() => {
    queueMicrotask(() => {
      syncVisibility();
    });
  }, [syncVisibility]);

  useEffect(() => {
    setBlockLayout(loadHomeNewsletterBlockLayout());
  }, []);

  useEffect(() => {
    setSuppressHeader(isExpandedOpen);
    return () => {
      setSuppressHeader(false);
    };
  }, [isExpandedOpen, setSuppressHeader]);

  const handleDismiss = useCallback(() => {
    if (isDirector) return;
    setIsVisible(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(GN_HOME_NEWSLETTER_DISMISSED, "true");
      sessionStorage.removeItem(GN_HOME_NEWSLETTER_MINIMIZED);
    }
  }, [isDirector]);

  useEffect(() => {
    if (!isExpandedOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isDirector) {
        handleDismiss();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    if (!isDirector) {
      emailInputRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpandedOpen, handleDismiss, isDirector]);

  const handleMinimize = () => {
    if (isDirector) return;
    setIsMinimized(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(GN_HOME_NEWSLETTER_MINIMIZED, "true");
    }
  };

  const handleExpand = () => {
    setIsMinimized(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(GN_HOME_NEWSLETTER_MINIMIZED);
    }
  };

  const handleHideAfterSuccess = () => {
    if (isDirector) return;
    if (typeof window !== "undefined") {
      sessionStorage.setItem(GN_HOME_NEWSLETTER_SUBSCRIBED, "true");
    }
    setIsVisible(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!marketingAccepted || submitState === "loading") return;

    setSubmitState("loading");
    setErrorCode(null);

    const result = await submitNewsletterSubscription({
      email,
      locale,
      marketingAccepted: true,
      source: GN_HOME_NEWSLETTER_SOURCE,
    });

    if (result.ok) {
      setSubmitState("success");
      return;
    }

    setSubmitState("error");
    setErrorCode(result.code);
  };

  const handleLogin = () => {
    if (isDirector) return;
    handleMinimize();
    openAuthModal("login");
  };

  if (!isHomeGn || !isVisible) return null;

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

  if (isMinimized && !isDirector) {
    return (
      <div className="fixed bottom-4 left-1/2 z-[46] w-[min(100%-1rem,calc(100vw-1rem))] max-w-sm -translate-x-1/2 animate-fade-in pb-[max(0.75rem,env(safe-area-inset-bottom))] md:left-4 md:w-auto md:max-w-none md:translate-x-0">
        <button
          type="button"
          onClick={handleExpand}
          className="font-inter w-full rounded-full border border-[rgba(110,31,40,0.35)] bg-[#F4EBDD] px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2E4A36] shadow-[0_10px_36px_-12px_rgba(46,74,54,0.35),0_2px_8px_rgba(46,74,54,0.08)] transition hover:border-[#6E1F28]/55 hover:shadow-[0_14px_40px_-10px_rgba(46,74,54,0.28)] md:w-auto md:px-4 md:text-xs"
          aria-label={t("homeNewsletterModal.expand")}
        >
          {t("registrationCTA.minimizedLabel")}
        </button>
      </div>
    );
  }

  const blockTransform = `translate(calc(-50% + ${blockLayout.block.x}px), calc(-50% + ${blockLayout.block.y}px))`;

  return (
    <>
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden p-4"
        role="presentation"
      >
        {!isDirector ? (
          <button
            type="button"
            className="absolute inset-0 bg-black/55"
            onClick={handleDismiss}
            aria-label={t("homeNewsletterModal.close")}
          />
        ) : (
          <div
            className="absolute inset-0 bg-black/55"
            aria-hidden
          />
        )}

        <div
          className="relative flex max-h-[calc(100dvh-2rem)] max-w-[calc(100vw-2rem)] items-center justify-center"
          style={{
            transform: `scale(min(1, calc((100vw - 2rem) / ${MODAL_W}), calc((100dvh - 2rem) / ${MODAL_H})))`,
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative isolate overflow-hidden bg-[#0B0F14] shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
            style={{ width: MODAL_W, height: MODAL_H }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={GN_HOME_NEWSLETTER_BACKGROUND}
              alt=""
              width={MODAL_W}
              height={MODAL_H}
              className="pointer-events-none absolute left-0 top-0 z-0 object-fill object-center"
              style={{
                width: MODAL_W,
                height: MODAL_H,
                opacity: GN_HOME_NEWSLETTER_BACKGROUND_OPACITY,
              }}
              decoding="async"
              fetchPriority="high"
            />

            <button
              type="button"
              onClick={handleDismiss}
              disabled={isDirector}
              className="absolute right-6 top-6 z-[3] flex items-center gap-2 rounded-sm px-1 py-1 font-inter text-[13px] font-medium text-white/90 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:cursor-default disabled:opacity-40"
              aria-label={t("homeNewsletterModal.closeWindow")}
            >
              <svg
                className="h-4 w-4 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span>{t("homeNewsletterModal.closeWindow")}</span>
            </button>

            <div className="relative z-[1] h-full w-full overflow-hidden">
              <div
                className="absolute left-1/2 top-1/2 z-[1] w-full max-w-[520px] px-6"
                style={{ transform: blockTransform }}
              >
                <div
                  className={`${GN_HOME_NEWSLETTER_PANEL_CLASS} flex flex-col items-center text-center`}
                >
                  <div
                    className="shrink-0"
                    style={elementOffsetTransform(blockLayout.logo)}
                    data-director-element="logo"
                  >
                    <Image
                      src="/assets/images/logo/LOGO-GONATURAL.png"
                      alt={t("header.logoAlt")}
                      width={240}
                      height={96}
                      className="h-auto w-[min(100%,200px)] object-contain drop-shadow-[0_4px_18px_rgba(0,0,0,0.35)]"
                      priority
                    />
                  </div>

                  {submitState === "success" ? (
                    <div className="flex w-full flex-col items-center gap-4">
                      <p className="font-inter text-[15px] leading-relaxed text-[rgba(244,235,221,0.92)]">
                        {t("homeNewsletterModal.successMessage")}
                      </p>
                      <button
                        type="button"
                        onClick={handleHideAfterSuccess}
                        className={primaryCtaClass}
                      >
                        {t("registrationCTA.hideAfterSuccess")}
                      </button>
                    </div>
                  ) : (
                    <>
                      <p
                        className="font-inter shrink-0 text-[11px] font-medium uppercase tracking-[0.22em] text-[rgba(244,235,221,0.72)]"
                        style={elementOffsetTransform(blockLayout.eyebrow)}
                        data-director-element="eyebrow"
                      >
                        {t("homeNewsletterModal.eyebrow")}
                      </p>
                      <h2
                        id={titleId}
                        className="font-display mt-1.5 max-w-[520px] shrink-0 text-balance text-[1.85rem] font-medium leading-[1.06] tracking-[-0.02em] text-[#F4EBDD]"
                        style={elementOffsetTransform(blockLayout.headline)}
                        data-director-element="headline"
                      >
                        {t("homeNewsletterModal.headlineBefore")}
                        <span style={{ color: GN_COLORS.mustard }}>
                          {t("homeNewsletterModal.headlineFreeShipping")}
                        </span>
                        {t("homeNewsletterModal.headlineMiddle")}
                        <span style={{ color: GN_COLORS.burgundy }}>
                          {t("homeNewsletterModal.headlineFirstOrders")}
                        </span>
                      </h2>
                      <p
                        className="font-inter mt-2 max-w-[440px] shrink-0 text-pretty text-[13px] leading-snug text-[rgba(244,235,221,0.78)]"
                        style={elementOffsetTransform(blockLayout.subtitle)}
                        data-director-element="subtitle"
                      >
                        {t("homeNewsletterModal.subtitle")}
                      </p>

                      <form
                        onSubmit={handleSubmit}
                        className="mt-4 flex w-full shrink-0 flex-col gap-2 text-left"
                        style={elementOffsetTransform(blockLayout.form)}
                        data-director-element="form"
                      >
                        <div>
                          <label
                            htmlFor="gn-home-newsletter-email"
                            className="sr-only"
                          >
                            {t("registrationCTA.emailLabel")}
                          </label>
                          <input
                            ref={emailInputRef}
                            id="gn-home-newsletter-email"
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
                            placeholder={t("registrationCTA.emailPlaceholder")}
                            className="font-inter h-[44px] w-full rounded-none border border-white/20 bg-black/30 px-4 text-sm text-[#F4EBDD] placeholder:text-[rgba(244,235,221,0.45)] outline-none transition focus:border-[#D9A441]/55 focus:ring-2 focus:ring-[#D9A441]/25"
                            required
                          />
                        </div>

                        <label className="font-inter flex shrink-0 cursor-pointer gap-2.5 text-left text-[11px] leading-snug text-[rgba(244,235,221,0.82)]">
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
                            className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/30 bg-black/30 text-[#6E1F28] focus:ring-[#D9A441]/30"
                          />
                          <span>
                            {t("registrationCTA.marketingLabel")}{" "}
                            <Link
                              href={privacyHref}
                              className="font-medium text-[#D9A441] underline decoration-[rgba(217,164,65,0.35)] underline-offset-2 hover:decoration-[#D9A441]"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {t("registrationCTA.privacyLink")}
                            </Link>
                          </span>
                        </label>

                        {errorMessage ? (
                          <p
                            className="font-inter shrink-0 text-sm text-[#FCA5A5]"
                            role="alert"
                          >
                            {errorMessage}
                          </p>
                        ) : null}

                        <button
                          type="submit"
                          disabled={
                            !marketingAccepted ||
                            submitState === "loading" ||
                            !email.trim()
                          }
                          className={primaryCtaClass}
                        >
                          {submitState === "loading"
                            ? t("registrationCTA.submitLoading")
                            : t("homeNewsletterModal.cta")}
                        </button>
                      </form>

                      <button
                        type="button"
                        onClick={handleLogin}
                        className="font-inter mt-2 shrink-0 text-sm text-[rgba(244,235,221,0.78)] transition hover:text-[#F4EBDD]"
                        style={elementOffsetTransform(blockLayout.login)}
                        data-director-element="login"
                      >
                        {t("homeNewsletterModal.alreadyMember")}{" "}
                        <span className="font-semibold text-[#D9A441] underline underline-offset-2">
                          {t("homeNewsletterModal.logIn")}
                        </span>
                      </button>

                      <p
                        className="font-inter mt-2 max-w-[440px] shrink-0 text-[10px] leading-snug text-[rgba(244,235,221,0.5)]"
                        style={elementOffsetTransform(blockLayout.legal)}
                        data-director-element="legal"
                      >
                        {t("homeNewsletterModal.legalFinePrint")}
                      </p>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={handleMinimize}
                    disabled={isDirector}
                    className="font-inter mt-4 shrink-0 text-[11px] font-medium uppercase tracking-[0.14em] text-[rgba(244,235,221,0.45)] transition hover:text-[rgba(244,235,221,0.72)] disabled:cursor-default disabled:opacity-40"
                    style={elementOffsetTransform(blockLayout.minimize)}
                    data-director-element="minimize"
                  >
                    {t("registrationCTA.minimize")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isDirector && isExpandedOpen ? (
        <GoNaturalHomeNewsletterDirectorPanel
          layout={blockLayout}
          onChange={setBlockLayout}
        />
      ) : null}
    </>
  );
}

export default function GoNaturalHomeNewsletterModal() {
  return (
    <Suspense fallback={null}>
      <GoNaturalHomeNewsletterModalInner />
    </Suspense>
  );
}
