"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";

type Tab = "login" | "register";

type Props = {
  initialTab?: Tab;
  onSuccess?: () => void;
  isPage?: boolean;
  /** Ruta interna (ej. /es/checkout) tras login correcto */
  redirectTo?: string;
};

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.358 5 12 5c4.642 0 8.477 2.511 9.964 6.678.07.202.07.424 0 .639C20.577 16.49 16.642 19 12 19c-4.642 0-8.477-2.511-9.964-6.678z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function EyeSlashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19 12 19c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 5c4.638 0 8.573 2.511 9.963 6.678.07.202.07.424 0 .639M12 12v.01M17 17l2 2M3 3l18 18"
      />
    </svg>
  );
}

const inputClass =
  "w-full rounded-xl border border-[rgba(46,74,54,0.18)] bg-white/95 px-3 py-3 font-inter text-sm text-[#171717] placeholder:text-[#666666]/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] focus:border-[rgba(110,31,40,0.45)] focus:outline-none focus:ring-2 focus:ring-[rgba(217,164,65,0.28)] sm:px-4";

const labelClass =
  "font-inter text-xs font-semibold uppercase tracking-[0.12em] text-[rgba(46,74,54,0.72)]";

const toggleButtonClass =
  "absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#666666] transition hover:bg-[rgba(46,74,54,0.06)] hover:text-[#171717] focus:outline-none focus-visible:ring-2 focus-visible:ring-gn-mustard/40";

function AuthTabButton({
  tab,
  activeTab,
  onSelect,
  children,
}: {
  tab: Tab;
  activeTab: Tab;
  onSelect: (tab: Tab) => void;
  children: React.ReactNode;
}) {
  const isActive = activeTab === tab;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => onSelect(tab)}
      className={[
        "gn-auth-tab relative pb-3 pt-1 font-inter text-sm font-medium transition-colors duration-200",
        isActive ? "text-[#171717]" : "text-[#666666] hover:text-[#171717]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function AuthForm({
  initialTab = "login",
  onSuccess,
  isPage = false,
  redirectTo,
}: Props) {
  const { login, register } = useUser();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [awaitingEmailConfirmation, setAwaitingEmailConfirmation] =
    useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setError(null);
    setAwaitingEmailConfirmation(false);
    setPendingEmail("");
    setActiveTab(initialTab);
  }, [initialTab]);

  const subtitle = useMemo(() => {
    if (activeTab === "login") {
      return "Accedé a tu cuenta para ver pedidos y guardar datos";
    }
    return "Creá tu cuenta para acelerar futuras compras";
  }, [activeTab]);

  const handleTabSelect = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === "login") {
      setAwaitingEmailConfirmation(false);
      setConfirmPassword("");
      setShowPassword(false);
    }
  };

  const handleInputFocus = (inputRef: React.RefObject<HTMLInputElement | null>) => {
    if (inputRef.current && isPage) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "nearest",
            });
          }
        }, 300);
      });
    }
  };

  const afterAuthSuccess = () => {
    const target =
      redirectTo && redirectTo.startsWith("/") ? redirectTo : `/${locale}/account`;
    if (isPage) {
      router.push(target);
      router.refresh();
    } else if (onSuccess) {
      onSuccess();
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (activeTab === "login") {
        const { error: err } = await login({ email, password });
        if (err) {
          setError(err);
          return;
        }
      } else {
        if (password !== confirmPassword) {
          setError(
            t("authForm.passwordMismatch", "Passwords do not match.")
          );
          return;
        }
        const {
          error: err,
          needsEmailConfirmation,
          pendingEmail: registeredEmail,
        } = await register({ name, email, password });
        if (err) {
          setError(err);
          return;
        }
        if (needsEmailConfirmation) {
          setAwaitingEmailConfirmation(true);
          setPendingEmail(registeredEmail ?? email);
          return;
        }
      }
      afterAuthSuccess();
    } finally {
      setSubmitting(false);
    }
  };

  const passwordFieldClass = `${inputClass} pl-3 pr-11 sm:pl-4`;

  return (
    <div className="gn-auth-form w-full">
      <nav
        className="flex gap-8 border-b border-[rgba(46,74,54,0.12)]"
        role="tablist"
        aria-label="Autenticación"
      >
        <AuthTabButton tab="login" activeTab={activeTab} onSelect={handleTabSelect}>
          Iniciar sesión
        </AuthTabButton>
        <AuthTabButton tab="register" activeTab={activeTab} onSelect={handleTabSelect}>
          Crear cuenta
        </AuthTabButton>
      </nav>

      <div className="mt-6 space-y-2">
        <h2 className="section-display text-[clamp(1.5rem,4vw,2rem)] font-semibold leading-[1.12] tracking-tight text-gn-burgundy">
          {awaitingEmailConfirmation && activeTab === "register"
            ? t("authForm.confirmEmailTitle", "Check your email")
            : activeTab === "login"
              ? "Bienvenido de nuevo"
              : "Creá tu cuenta"}
        </h2>
        {!(awaitingEmailConfirmation && activeTab === "register") ? (
          <p className="font-inter text-sm leading-relaxed text-[#666666]">
            {subtitle}
          </p>
        ) : null}
      </div>

      {error ? (
        <p className="mt-4 font-inter text-sm text-gn-burgundy" role="alert">
          {error}
        </p>
      ) : null}

      {awaitingEmailConfirmation && activeTab === "register" ? (
        <div
          className="mt-6 rounded-2xl border border-[rgba(46,74,54,0.12)] bg-white/80 p-5 sm:p-6"
          role="status"
          aria-live="polite"
        >
          <div className="flex gap-4">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[rgba(46,74,54,0.12)] bg-[#F4EBDD] text-gn-burgundy"
              aria-hidden
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <div className="min-w-0 flex-1 space-y-3">
              <p className="font-inter text-sm leading-relaxed text-[#171717]">
                {t("authForm.confirmEmailDescription", "").replace(
                  "{email}",
                  pendingEmail
                )}
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("login");
                  setAwaitingEmailConfirmation(false);
                }}
                className="font-inter text-sm font-semibold text-gn-burgundy underline-offset-4 transition-colors hover:text-[#5c1a22] hover:underline"
              >
                {t("authForm.goToLogin", "Go to sign in")}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form className="mt-6 space-y-4" onSubmit={(e) => void handleSubmit(e)}>
          {activeTab === "register" && (
            <div className="space-y-2">
              <label className={labelClass}>Nombre</label>
              <input
                ref={nameInputRef}
                value={name}
                onChange={(event) => setName(event.target.value)}
                onFocus={() => handleInputFocus(nameInputRef)}
                type="text"
                className={inputClass}
                placeholder="Tu nombre"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <label className={labelClass}>Email</label>
            <input
              ref={emailInputRef}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onFocus={() => handleInputFocus(emailInputRef)}
              type="email"
              className={inputClass}
              placeholder="tuemail@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Contraseña</label>
            <div className="relative">
              <input
                ref={passwordInputRef}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onFocus={() => handleInputFocus(passwordInputRef)}
                type={showPassword ? "text" : "password"}
                autoComplete={
                  activeTab === "login" ? "current-password" : "new-password"
                }
                className={passwordFieldClass}
                placeholder="••••••••"
                required
                minLength={6}
              />
              <button
                type="button"
                className={toggleButtonClass}
                aria-pressed={showPassword}
                aria-label={
                  showPassword
                    ? t("authForm.hidePassword", "Hide password")
                    : t("authForm.showPassword", "Show password")
                }
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {activeTab === "register" && (
            <div className="space-y-2">
              <label className={labelClass}>
                {t("authForm.confirmPassword", "Confirm password")}
              </label>
              <div className="relative">
                <input
                  ref={confirmPasswordInputRef}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  onFocus={() => handleInputFocus(confirmPasswordInputRef)}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={passwordFieldClass}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className={toggleButtonClass}
                  aria-pressed={showPassword}
                  aria-label={
                    showPassword
                      ? t("authForm.hidePassword", "Hide password")
                      : t("authForm.showPassword", "Show password")
                  }
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-gn-burgundy px-4 py-3 font-inter text-sm font-semibold text-[#F4EBDD] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition duration-200 hover:bg-[#5c1a22] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? "…"
              : activeTab === "login"
                ? "Iniciar sesión"
                : "Crear cuenta"}
          </button>
        </form>
      )}
    </div>
  );
}
