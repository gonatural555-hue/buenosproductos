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
 * Columna editorial centrada y compacta — ritmo de espaciado alineado con HomeBrandHero.
 */
export default function GoNaturalEditorialColumn({
  tagline,
  cta,
  href,
  isActive,
}: GoNaturalEditorialColumnProps) {
  return (
    <motion.div
      className="relative z-20 mx-auto flex w-full max-w-[340px] flex-col items-center text-center"
      initial={false}
      animate={{ opacity: isActive ? 1 : 0.92 }}
      transition={{ duration: 0.6, ease: PANEL_EASE }}
    >
      <p className="w-full font-inter text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D9A441]">
        Outdoor
      </p>

      <motion.div
        className="mt-2 w-full"
        initial={false}
        animate={{ y: isActive ? 0 : 2 }}
        transition={{ duration: 0.6, ease: PANEL_EASE }}
      >
        <Image
          src="/assets/images/logo/LOGO-GONATURAL.png"
          alt="Go Natural"
          width={640}
          height={256}
          priority
          draggable={false}
          className="mx-auto h-auto w-full max-w-[min(72vw,288px)] object-contain drop-shadow-[0_8px_28px_rgba(46,74,54,0.1)] md:max-w-[312px]"
        />
        <p
          aria-hidden
          className="font-display mt-1.5 w-full text-[clamp(1.65rem,4.5vw,2.35rem)] font-normal uppercase leading-none tracking-[-0.02em] text-[#2E4A36]"
        >
          GO NATURAL
        </p>
      </motion.div>

      <p className="gn-hero-subtitle mt-3 max-w-[300px] md:mt-4">{tagline}</p>

      <motion.div
        className="relative z-20 mt-5 flex w-full justify-center md:mt-6"
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
    </motion.div>
  );
}
