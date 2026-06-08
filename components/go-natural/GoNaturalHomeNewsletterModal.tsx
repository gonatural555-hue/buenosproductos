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
  useSyncExternalStore,
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
  elementOffsetTransformDesktop,
  isHomeNewsletterDirectorMode,
  loadHomeNewsletterBlockLayout,
  type HomeNewsletterBlockLayout,
  type HomeNewsletterLayoutElementId,
} from "@/lib/newsletter-home-modal-layout";
import { isGoNaturalHomePath } from "@/lib/routing/brands";

type SubmitState = "idle" | "loading" | "success" | "error";

const { width: MODAL_W, height: MODAL_H } = GN_HOME_NEWSLETTER_MODAL;

const primaryCtaClass =
  "font-inter inline-flex h-[46px] w-full shrink-0 items-center justify-center rounded-none bg-[linear-gradient(135deg,#1F3527_0%,#2E4A36_50%,#3E654B_100%)] px-6 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#F4EBDD] shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] transition duration-300 hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A441]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-45";

const MD_MEDIA_QUERY = "(min-width: 768px)";

function subscribeMdViewport(onChange: () => void) {
  const mq = window.matchMedia(MD_MEDIA_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getMdViewportSnapshot() {
  return window.matchMedia(MD_MEDIA_QUERY).matches;
}

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
  const isDesktopLayout = useSyncExternalStore(
    subscribeMdViewport,
    getMdViewportSnapshot,
    () => false
  );

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

  const blockTransform = isDesktopLayout
    ? `translate(calc(-50% + ${blockLayout.block.x}px), calc(-50% + ${blockLayout.block.y}px))`
    : undefined;

  const layoutOffset = (id: HomeNewsletterLayoutElementId) =>
    elementOffsetTransformDesktop(blockLayout[id], isDesktopLayout);

  return (
    <>
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden p-0 md:p-4"
        role="presentation"
      >
        {!isDirector ? (
          <button
            type="button"
            className="absolute inset-0 hidden bg-black/55 md:block"
            onClick={handleDismiss}
            aria-label={t("homeNewsletterModal.close")}
          />
        ) : (
          <div className="absolute inset-0 hidden bg-black/55 md:block" aria-hidden />
        )}

        <div
          className="relative flex h-full w-full items-center justify-center md:h-auto md:w-auto md:max-h-[calc(100dvh-2rem)] md:max-w-[calc(100vw-2rem)]"
          style={
            isDesktopLayout
              ? {
                  transform: `scale(min(1, calc((100vw - 2rem) / ${MODAL_W}), calc((100dvh - 2rem) / ${MODAL_H})))`,
                }
              : undefined
          }
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative isolate flex h-[100dvh] w-full flex-col overflow-hidden bg-[#0B0F14] md:block md:h-auto md:w-auto md:shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
            style={
              isDesktopLayout
                ? { width: MODAL_W, height: MODAL_H }
                : undefined
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={GN_HOME_NEWSLETTER_BACKGROUND}
              alt=""
              width={MODAL_W}
              height={MODAL_H}
              className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center md:left-0 md:top-0 md:object-fill"
              style={{
                opacity: GN_HOME_NEWSLETTER_BACKGROUND_OPACITY,
                ...(isDesktopLayout
                  ? { width: MODAL_W, height: MODAL_H }
                  : undefined),
              }}
              decoding="async"
              fetchPriority="high"
            />

            <button
              type="button"
              onClick={handleDismiss}
              disabled={isDirector}
              className="absolute right-4 top-[max(0.75rem,env(safe-area-inset-top))] z-[3] flex items-center gap-2 rounded-sm p-2 font-inter text-[13px] font-medium text-white/90 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:cursor-default disabled:opacity-40 md:right-6 md:top-6 md:p-1"
              aria-label={t("homeNewsletterModal.closeWindow")}
            >
              <svg
                className="h-5 w-5 shrink-0 md:h-4 md:w-4"
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
              <span className="hidden md:inline">
                {t("homeNewsletterModal.closeWindow")}
              </span>
            </button>

            <div className="relative z-[1] flex min-h-0 w-full flex-1 flex-col md:h-full md:overflow-hidden">
              <div
                className={
                  isDesktopLayout
                    ? "absolute left-1/2 top-1/2 z-[1] w-full max-w-[520px] px-6"
                    : "flex min-h-0 flex-1 flex-col justify-center overflow-y-auto overscroll-contain px-5 pt-[calc(env(safe-area-inset-top,0px)+3.25rem)] pb-[max(2rem,env(safe-area-inset-bottom))]"
                }
                style={
                  isDesktopLayout && blockTransform
                    ? { transform: blockTransform }
                    : undefined
                }
              >
                <div
                  className={`${GN_HOME_NEWSLETTER_PANEL_CLASS} mx-auto my-auto flex w-full flex-col items-center gap-6 text-center md:gap-0`}
                >
                  <div
                    className="hidden shrink-0 md:block"
                    style={layoutOffset("logo")}
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
                        className="font-inter shrink-0 text-[10px] font-medium uppercase tracking-[0.2em] text-[rgba(244,235,221,0.72)] md:text-[11px] md:tracking-[0.22em]"
                        style={layoutOffset("eyebrow")}
                        data-director-element="eyebrow"
                      >
                        {t("homeNewsletterModal.eyebrow")}
                      </p>
                      <h2
                        id={titleId}
                        className="font-display max-w-[520px] shrink-0 text-balance text-[1.4rem] font-medium leading-[1.08] tracking-[-0.02em] text-[#F4EBDD] md:mt-1.5 md:text-[1.85rem] md:leading-[1.06]"
                        style={layoutOffset("headline")}
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
                        className="font-inter max-w-[440px] shrink-0 text-pretty text-[12px] leading-snug text-[rgba(244,235,221,0.78)] md:mt-2 md:text-[13px]"
                        style={layoutOffset("subtitle")}
                        data-director-element="subtitle"
                      >
                        {t("homeNewsletterModal.subtitle")}
                      </p>

                      <form
                        onSubmit={handleSubmit}
                        className="flex w-full shrink-0 flex-col gap-3 text-left md:mt-4 md:gap-2"
                        style={layoutOffset("form")}
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
                        className="font-inter shrink-0 text-sm text-[rgba(244,235,221,0.78)] transition hover:text-[#F4EBDD] md:mt-2"
                        style={layoutOffset("login")}
                        data-director-element="login"
                      >
                        {t("homeNewsletterModal.alreadyMember")}{" "}
                        <span className="font-semibold text-[#D9A441] underline underline-offset-2">
                          {t("homeNewsletterModal.logIn")}
                        </span>
                      </button>

                      <p
                        className="font-inter max-w-[440px] shrink-0 text-[9px] leading-snug text-[rgba(244,235,221,0.5)] md:mt-2 md:text-[10px]"
                        style={layoutOffset("legal")}
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
                    className="font-inter shrink-0 text-[11px] font-medium uppercase tracking-[0.14em] text-[rgba(244,235,221,0.45)] transition hover:text-[rgba(244,235,221,0.72)] disabled:cursor-default disabled:opacity-40 md:mt-4"
                    style={layoutOffset("minimize")}
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
