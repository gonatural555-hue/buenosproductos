"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import { useUser } from "@/context/UserContext";
import {
  accountPath,
  accountSectionPath,
  authPath,
  homePath,
  type AccountSection,
} from "@/lib/routing/paths";
import { giType } from "@/lib/ui/gi-typography";

function AccountIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.65}
      stroke="currentColor"
      className={className}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
      />
    </svg>
  );
}

function resolveDisplayName(name?: string | null, email?: string | null): string {
  const trimmed = name?.trim();
  if (trimmed) return trimmed.split(/\s+/)[0] ?? trimmed;
  const local = email?.split("@")[0]?.trim();
  return local || "";
}

type MenuItem = {
  section: AccountSection;
  label: string;
};

export default function HeaderAccountMenu({
  variant = "dark",
}: {
  variant?: "dark" | "light";
}) {
  const locale = useLocale();
  const t = useTranslations();
  const router = useRouter();
  const { isLoggedIn, user, logout } = useUser();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const displayName = resolveDisplayName(user?.name, user?.email);
  const helloLabel = displayName
    ? t("goodIdeas.nav.helloUser").replace("{name}", displayName)
    : t("goodIdeas.nav.account");

  const menuItems: MenuItem[] = [
    { section: "account", label: t("accountPage.sections.account") },
    { section: "orders", label: t("accountPage.sections.orders") },
    { section: "addresses", label: t("accountPage.sections.addresses") },
  ];

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [close, open]);

  const handleLogout = async () => {
    close();
    await logout();
    router.push(homePath(locale));
  };

  const light = variant === "light";
  const iconBtnClass = light
    ? "relative flex h-10 w-10 items-center justify-center rounded-full text-[#111111] transition-colors duration-200 hover:bg-[#F3F4F6] hover:text-[#3B82F6]"
    : "relative flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors duration-200 hover:bg-white/8 hover:text-[#3B82F6]";

  if (!isLoggedIn) {
    return (
      <Link
        href={authPath(locale, accountPath(locale))}
        className={iconBtnClass}
        aria-label={t("goodIdeas.nav.account")}
      >
        <AccountIcon className="h-5 w-5" />
      </Link>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className={`flex max-w-[11rem] items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 transition-colors duration-200 sm:max-w-[14rem] ${
          light
            ? "text-[#111111] hover:bg-[#F3F4F6] hover:text-[#3B82F6]"
            : "text-white hover:bg-white/8 hover:text-[#3B82F6]"
        }`}
        aria-label={t("goodIdeas.nav.accountMenuAria")}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
            light ? "bg-[#F3F4F6]" : "bg-white/[0.08]"
          }`}
        >
          <AccountIcon className="h-[18px] w-[18px]" />
        </span>
        <span className={`hidden truncate ${giType.navUtility} sm:inline`}>{helloLabel}</span>
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className={`absolute right-0 top-[calc(100%+0.5rem)] z-[70] min-w-[12.5rem] overflow-hidden rounded-xl border py-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.12)] ${
            light
              ? "border-[#E5E7EB] bg-white"
              : "border-white/[0.1] bg-[rgba(11,15,20,0.96)] shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          }`}
        >
          <p className="border-b border-white/[0.08] px-4 py-2.5 font-body text-sm font-semibold text-[#E8ECF1] sm:hidden">
            {helloLabel}
          </p>
          {menuItems.map((item) => (
            <Link
              key={item.section}
              href={accountSectionPath(locale, item.section)}
              role="menuitem"
              className="block px-4 py-2.5 font-body text-sm text-[rgba(232,236,241,0.85)] transition hover:bg-white/[0.06] hover:text-[#3B82F6]"
              onClick={close}
            >
              {item.label}
            </Link>
          ))}
          <div className="my-1 border-t border-white/[0.08]" />
          <button
            type="button"
            role="menuitem"
            className="block w-full px-4 py-2.5 text-left font-body text-sm text-[rgba(232,236,241,0.85)] transition hover:bg-white/[0.06] hover:text-[#3B82F6]"
            onClick={() => void handleLogout()}
          >
            {t("accountPage.logout")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
