"use client";



import Image from "next/image";

import Link from "next/link";

import type { ReactNode } from "react";

import { useTranslations } from "@/components/i18n/LocaleProvider";

import {

  GN_AUTH_MODAL_BACKGROUND,

  GN_AUTH_MODAL_BACKGROUND_OPACITY,

  GN_AUTH_PANEL_CLASS,

} from "@/lib/auth-modal";



type Props = {

  children: ReactNode;

  /** Modal overlay: click en backdrop cierra */

  onClose?: () => void;

  showClose?: boolean;

  /** Pantalla /auth: enlace volver en lugar de cerrar modal */

  backHref?: string;

  mode?: "modal" | "page";

};



function AuthBackgroundImage({ className }: { className?: string }) {

  return (

    // eslint-disable-next-line @next/next/no-img-element

    <img

      src={GN_AUTH_MODAL_BACKGROUND}

      alt=""

      className={className}

      style={{ opacity: GN_AUTH_MODAL_BACKGROUND_OPACITY }}

      decoding="async"

    />

  );

}



export default function AuthExperienceShell({

  children,

  onClose,

  showClose = false,

  backHref,

  mode = "modal",

}: Props) {

  const t = useTranslations();

  const isModal = mode === "modal";



  return (

    <div

      className={

        isModal

          ? "fixed inset-0 z-[120] flex min-h-[100dvh] flex-col"

          : "relative flex min-h-[100dvh] flex-col"

      }

      role={isModal ? "dialog" : undefined}

      aria-modal={isModal ? true : undefined}

    >

      {isModal && onClose ? (

        <button

          type="button"

          className="absolute inset-0 z-0 bg-black/55 backdrop-blur-[2px]"

          onClick={onClose}

          aria-label={t("common.close", "Cerrar")}

        />

      ) : null}



      {/* Mobile: imagen full-bleed detrás del panel crema */}

      <AuthBackgroundImage className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center md:hidden" />



      <div

        className={

          isModal

            ? "relative z-[1] flex min-h-0 flex-1 flex-col md:items-center md:justify-center md:p-6"

            : "relative z-[1] mx-auto flex w-full max-w-md flex-1 flex-col md:py-10"

        }

      >

        <div

          className={

            isModal

              ? "flex min-h-[100dvh] flex-1 flex-col md:min-h-0 md:h-auto md:w-full md:max-w-md md:flex-none"

              : "flex w-full flex-1 flex-col"

          }

        >

          <div

            className={`${GN_AUTH_PANEL_CLASS} relative isolate flex min-h-[100dvh] flex-1 flex-col bg-[#F4EBDD]/97 md:min-h-0 md:h-auto md:bg-[#F4EBDD]`}

          >

            {/* Desktop: imagen solo dentro del panel (no filtra contenido de la página) */}

            <AuthBackgroundImage className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full object-cover object-center md:block" />

            <div

              className="absolute inset-0 z-0 hidden bg-[#F4EBDD]/88 md:block"

              aria-hidden

            />



            <div className="relative z-[1] flex min-h-0 flex-1 flex-col">

              <div className="mb-6 flex items-start justify-between gap-3 md:mb-4">

                <div className="flex min-w-0 flex-1 flex-col gap-4 pt-[max(0.5rem,env(safe-area-inset-top))] md:hidden">

                  <Image

                    src="/assets/images/logo/LOGO-GONATURAL.png"

                    alt={t("header.logoAlt")}

                    width={200}

                    height={80}

                    className="h-auto w-[min(100%,160px)] object-contain"

                    priority

                  />

                </div>

                <div className="hidden md:block md:flex-1" aria-hidden />



                {showClose && onClose ? (

                  <button

                    type="button"

                    onClick={onClose}

                    className="mt-[max(0.5rem,env(safe-area-inset-top))] flex shrink-0 items-center gap-2 rounded-sm p-2 font-inter text-[13px] font-medium text-[#171717]/80 transition hover:text-[#171717] focus:outline-none focus-visible:ring-2 focus-visible:ring-gn-mustard/50 md:mt-0"

                    aria-label={t("common.close", "Cerrar")}

                  >

                    <svg

                      className="h-5 w-5"

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

                    <span className="hidden sm:inline">

                      {t("common.close", "Cerrar")}

                    </span>

                  </button>

                ) : null}



                {backHref ? (

                  <Link

                    href={backHref}

                    className="mt-[max(0.5rem,env(safe-area-inset-top))] inline-flex shrink-0 items-center gap-2 font-inter text-sm text-[#666666] transition hover:text-[#171717] md:mt-0"

                  >

                    <svg

                      className="h-4 w-4"

                      fill="none"

                      stroke="currentColor"

                      viewBox="0 0 24 24"

                      aria-hidden

                    >

                      <path

                        strokeLinecap="round"

                        strokeLinejoin="round"

                        strokeWidth={2}

                        d="M15 19l-7-7 7-7"

                      />

                    </svg>

                    Volver

                  </Link>

                ) : null}

              </div>



              <div className="flex flex-1 flex-col justify-center pb-[max(1.5rem,env(safe-area-inset-bottom))] md:block md:flex-none md:pb-0">

                {children}

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

