import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { GN_EASE_PREMIUM } from "@/lib/ui/gonatural-design";

const PANEL_EASE = GN_EASE_PREMIUM;

export type GoNaturalEditorialColumnProps = {
  tagline: string;
  cta: string;
  href: string;
  isActive: boolean;
};

/**
 * Opción A — columna editorial única: eyebrow, logo, wordmark, tagline y CTA
 * con el mismo eje de alineación.
 */
export default function GoNaturalEditorialColumn({
  tagline,
  cta,
  href,
  isActive,
}: GoNaturalEditorialColumnProps) {
  return (
    <div className="relative z-20 flex w-full max-w-[300px] flex-col items-start">
      <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D9A441]">
        Outdoor
      </p>

      <div className="mt-4 w-full">
        <Image
          src="/assets/images/logo/LOGO-GONATURAL.png"
          alt="Go Natural"
          width={640}
          height={256}
          priority
          draggable={false}
          className="mx-auto h-auto w-full max-w-[220px] object-contain drop-shadow-[0_8px_28px_rgba(46,74,54,0.1)] md:max-w-[240px]"
        />
        <p
          aria-hidden
          className="font-display mt-3 w-full text-center text-[clamp(1.5rem,4.2vw,2.15rem)] font-normal uppercase leading-none tracking-[-0.02em] text-[#2E4A36]"
        >
          GO NATURAL
        </p>
      </div>

      <p className="mt-5 max-w-[280px] font-inter text-[15px] leading-relaxed text-[rgba(46,74,54,0.72)] md:text-[16px]">
        {tagline}
      </p>

      <motion.div
        className="relative z-20 mt-8"
        animate={{
          opacity: isActive ? 1 : 0.82,
          y: isActive ? 0 : 4,
        }}
        transition={{ duration: 0.6, ease: PANEL_EASE }}
      >
        <Link
          href={href}
          className="group inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#2E4A36] px-8 font-inter text-[12px] font-semibold uppercase tracking-[0.14em] text-[#F4EBDD] shadow-[0_12px_40px_rgba(46,74,54,0.2)] transition-[transform,box-shadow] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(46,74,54,0.24)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A441]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4EBDD] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          <span className="flex items-center gap-2">
            {cta}
            <span
              className="inline-block transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5"
              aria-hidden
            >
              →
            </span>
          </span>
        </Link>
      </motion.div>
    </div>
  );
}
