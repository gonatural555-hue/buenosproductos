"use client";

import Link from "next/link";
import ScrollReveal from "@/components/blog/ScrollReveal";
import { useHomeNewsletterModal } from "@/context/HomeNewsletterModalContext";
import { premiumPrimaryCtaClass } from "@/lib/ui/premium-cta-classes";
import { LUMINOUS_EDGE_LIGHT } from "@/lib/ui/luminous-edge";

type CommunityCTAProps = {
  title: string;
  /** Línea breve bajo el título (p. ej. “Move with intention”) */
  tagline?: string;
  body: string;
  ctaLabel: string;
  href: string;
  ctaClassName?: string;
  /** Abre el modal newsletter del Home en lugar de navegar. */
  openNewsletterModal?: boolean;
};

/**
 * Closing community invitation — strong type, quiet frame.
 */
export default function CommunityCTA({
  title,
  tagline,
  body,
  ctaLabel,
  href,
  ctaClassName = premiumPrimaryCtaClass,
  openNewsletterModal = false,
}: CommunityCTAProps) {
  const { openModal } = useHomeNewsletterModal();

  return (
    <section className={`border-t border-earth-brown/10 bg-[#FFFFFF] py-20 md:py-28 lg:py-32 ${LUMINOUS_EDGE_LIGHT}`}>
      <div className="mx-auto max-w-3xl px-6 text-center sm:px-10">
        <ScrollReveal>
          <h2 className="section-display font-bold tracking-tight text-gn-burgundy text-[clamp(1.85rem,4vw,2.75rem)] leading-tight">
            {title}
          </h2>
          {tagline ? (
            <p className="mx-auto mt-5 max-w-lg text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-accent-gold sm:text-xs">
              {tagline}
            </p>
          ) : null}
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-gray md:text-lg">
            {body}
          </p>
          {openNewsletterModal ? (
            <button
              type="button"
              onClick={openModal}
              className={`${ctaClassName} mt-10`}
            >
              {ctaLabel}
            </button>
          ) : (
            <Link href={href} className={`${ctaClassName} mt-10`}>
              {ctaLabel}
            </Link>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
