"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import GoodProductsBrandName from "@/components/good-ideas/GoodProductsBrandName";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import { homePath } from "@/lib/routing/paths";
import { GI_AUTH_PANEL_CLASS } from "@/lib/ui/gi-auth";
import { GI_HERO_TOP_PAD } from "@/lib/ui/goodideas-design";
import { giType } from "@/lib/ui/gi-typography";

type Props = {
  children: ReactNode;
  onClose?: () => void;
  showClose?: boolean;
  backHref?: string;
  mode?: "modal" | "page";
};

export default function GiAuthExperienceShell({
  children,
  onClose,
  showClose = false,
  backHref,
  mode = "modal",
}: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const isModal = mode === "modal";

  return (
    <div
      className={
        isModal
          ? "fixed inset-0 z-[120] flex min-h-[100dvh] flex-col bg-[#0B0F14]/90 backdrop-blur-sm"
          : `relative flex min-h-[100dvh] flex-col bg-[#0B0F14] ${GI_HERO_TOP_PAD}`
      }
      role={isModal ? "dialog" : undefined}
      aria-modal={isModal ? true : undefined}
    >
      {isModal && onClose ? (
        <button
          type="button"
          className="absolute inset-0 z-0"
          onClick={onClose}
          aria-label={t("common.close")}
        />
      ) : null}

      <div
        className={
          isModal
            ? "relative z-[1] flex min-h-0 flex-1 flex-col items-center justify-center p-4 sm:p-6"
            : "relative z-[1] mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-10 sm:px-6"
        }
      >
        <div className={`${GI_AUTH_PANEL_CLASS} relative flex flex-col`}>
          <div className="mb-6 flex items-start justify-between gap-3">
            <Link href={homePath(locale)} className={`group ${giType.brandLogo}`}>
              <GoodProductsBrandName
                locale={locale}
                prefixClassName="text-[#E8ECF1] transition-colors group-hover:text-[#3B82F6]"
                suffixClassName="text-[#3B82F6] transition-colors group-hover:text-[#E8ECF1]"
              />
            </Link>

            {showClose && onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="flex shrink-0 items-center gap-2 rounded-lg p-2 font-body text-sm text-[rgba(232,236,241,0.7)] transition hover:bg-white/[0.06] hover:text-[#E8ECF1]"
                aria-label={t("common.close")}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : null}

            {backHref ? (
              <Link
                href={backHref}
                className="inline-flex shrink-0 items-center gap-2 font-body text-sm text-[rgba(232,236,241,0.72)] transition hover:text-[#E8ECF1]"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {t("goodIdeas.auth.back")}
              </Link>
            ) : null}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
