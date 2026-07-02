/**
 * Tokens y clases Tailwind para secciones de la landing Home (Buenos Productos).
 * Colores alineados con `GI_COLORS` — no duplicar hex fuera de este módulo.
 */
import {
  GI_EASE,
  GI_HERO_DARK_CTA_CLASS,
  GI_HERO_GRID_OVERLAY,
} from "@/lib/ui/goodideas-design";

/** Ancho editorial de secciones home (entre hero 1080px y catálogo 1315px). */
export const GI_HOME_CONTENT_MAX_PX = 1200;

export const GI_HOME_OUTER =
  "mx-auto w-full max-w-[calc(1200px+4rem)] px-6 sm:px-10 lg:px-12";

export const GI_HOME_INNER = "mx-auto w-full max-w-[1200px]";

export const GI_HOME_SECTION_PAD = "py-16 md:py-24";

export const giHomeClasses = {
  page: "bg-[#0B0F14] text-[#E8ECF1]",
  section: `${GI_HOME_SECTION_PAD} border-t border-white/[0.08]`,
  sectionFlush: GI_HOME_SECTION_PAD,
  sectionSurface: "bg-[#151B24]",
  sectionGlow: GI_HERO_GRID_OVERLAY.radial,
  eyebrow:
    "font-inter text-[11px] font-semibold uppercase tracking-[0.24em] text-[#94A3B8]",
  eyebrowCenter: "text-center",
  title:
    "font-display text-balance text-[clamp(1.75rem,4.5vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-[#E8ECF1] md:text-[clamp(2rem,3.5vw,3rem)]",
  titleCenter: "text-center",
  subtitle:
    "max-w-2xl font-inter text-base leading-relaxed text-[rgba(232,236,241,0.72)] md:text-lg",
  subtitleCenter: "mx-auto text-center",
  darkCard:
    "rounded-2xl border border-white/[0.08] bg-[#151B24] p-6 md:rounded-3xl md:p-8",
  darkCardHover:
    "transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-white/[0.12] motion-reduce:transition-none",
  /** CTA azul — reutiliza token hero existente. */
  primaryButton: GI_HERO_DARK_CTA_CLASS,
  /** CTA secundario: contorno sobre fondo oscuro. */
  secondaryButton: [
    "inline-flex h-[52px] min-h-[52px] items-center justify-center rounded-full",
    "border border-white/[0.12] bg-transparent px-8",
    "text-center font-body text-sm font-semibold text-[#E8ECF1]",
    "transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
    "hover:border-white/[0.2] hover:bg-white/[0.06]",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/50",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F14]",
    "motion-reduce:transition-none",
    "md:h-[56px] md:min-h-[56px] md:px-9 md:text-base",
  ].join(" "),
  /** Variante clara (card blanca / contraste sobre oscuro). */
  secondaryButtonLight: [
    "inline-flex h-[52px] min-h-[52px] items-center justify-center rounded-full",
    "border border-white/[0.12] bg-[#E8ECF1] px-8",
    "text-center font-body text-sm font-semibold text-[#0B0F14]",
    "shadow-[0_12px_40px_rgba(0,0,0,0.25)]",
    "transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
    "hover:-translate-y-0.5 hover:bg-white",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/50",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F14]",
    "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
    "md:h-[56px] md:min-h-[56px] md:px-9 md:text-base",
  ].join(" "),
  whiteCard:
    "rounded-2xl border border-[#E5E5E5] bg-white p-6 text-[#111111] md:rounded-3xl md:p-8",
  whiteCardMuted: "font-body text-sm leading-relaxed text-[#6B7280]",
} as const;

export const giHomeEase = GI_EASE;

function joinClasses(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export { joinClasses as giHomeJoinClasses };
