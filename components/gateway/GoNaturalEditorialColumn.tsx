import Link from "next/link";
import { motion } from "framer-motion";
import { GN_EASE_PREMIUM } from "@/lib/ui/gonatural-design";
import BrandHeroContent from "@/components/gateway/BrandHeroContent";

const PANEL_EASE = GN_EASE_PREMIUM;

export type GoNaturalEditorialColumnProps = {
  title: string;
  tagline: string;
  cta: string;
  href: string;
  isActive: boolean;
};

export default function GoNaturalEditorialColumn({
  title,
  tagline,
  cta,
  href,
  isActive,
}: GoNaturalEditorialColumnProps) {
  return (
    <BrandHeroContent isActive={isActive}>
      <p className="w-full font-inter text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D9A441]">
        Outdoor
      </p>

      <h2 className="mx-auto max-w-[14ch] font-display text-[clamp(2.25rem,5vw,3.75rem)] font-normal leading-[0.95] tracking-[-0.02em] text-[#2E4A36]">
        {title}
      </h2>

      <p className="max-w-md font-inter text-[15px] leading-relaxed text-[#D9A441] md:text-[16px]">
        {tagline}
      </p>

      <motion.div
        className="flex w-full justify-center"
        initial={false}
        animate={{ opacity: isActive ? 1 : 0.82 }}
        transition={{ duration: 0.6, ease: PANEL_EASE }}
      >
        <Link
          href={href}
          className="group inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#2E4A36] px-8 font-inter text-[12px] font-semibold uppercase tracking-[0.14em] text-[#F4EBDD] transition-[transform,background-color] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-[#263d2f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A441]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4EBDD] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
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
    </BrandHeroContent>
  );
}
