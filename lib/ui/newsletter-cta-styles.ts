/**
 * Boletín / newsletter flotante — diseño único Good Products.
 * Fondo #121921, tipografía clara, CTA azul #254E85.
 */

export const newsletterCtaStyles = {
  minimizedButton:
    "font-body w-full rounded-full border border-white/[0.08] bg-[#121921] px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_10px_36px_-12px_rgba(0,0,0,0.52),0_2px_8px_rgba(0,0,0,0.22)] transition hover:border-[rgba(59,130,246,0.45)] hover:bg-[#151B24] md:w-auto md:px-4 md:text-xs",
  panel:
    "rounded-2xl border border-white/[0.08] bg-[#121921] p-6 shadow-[0_18px_48px_-20px_rgba(0,0,0,0.6),0_6px_20px_rgba(0,0,0,0.28)] sm:p-8",
  title:
    "font-display text-balance text-lg font-bold leading-snug tracking-[-0.02em] text-white md:text-xl",
  subtitle: "font-body mt-1.5 text-sm leading-relaxed text-[#D1D5DB]",
  secondaryText: "font-body mt-1 text-xs leading-relaxed text-[#9CA3AF]",
  iconButton:
    "shrink-0 rounded-lg p-1 text-[#9CA3AF] transition hover:bg-white/[0.06] hover:text-white",
  successText: "font-body text-sm font-medium leading-relaxed text-[#D1D5DB]",
  primaryAction:
    "font-body inline-flex min-h-[44px] flex-[3] items-center justify-center rounded-lg bg-[#254E85] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1e3f6e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121921]",
  submitAction:
    "font-body inline-flex min-h-[44px] flex-[3] items-center justify-center rounded-lg bg-[#254E85] px-4 py-2.5 text-sm font-semibold transition enabled:text-white enabled:hover:bg-[#1e3f6e] enabled:focus:outline-none enabled:focus-visible:ring-2 enabled:focus-visible:ring-[#3B82F6]/50 enabled:focus-visible:ring-offset-2 enabled:focus-visible:ring-offset-[#121921] disabled:cursor-not-allowed disabled:text-[#4B5563]",
  secondaryAction:
    "font-body inline-flex min-h-[44px] flex-1 items-center justify-center rounded-lg border border-white/20 bg-transparent px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/[0.04]",
  input:
    "font-body w-full rounded-lg border border-white/[0.08] bg-[#0B0F14] px-3 py-2.5 text-sm text-white placeholder:text-[#9CA3AF] outline-none transition focus:border-[rgba(59,130,246,0.45)] focus:ring-2 focus:ring-[#3B82F6]/25",
  checkboxLabel:
    "font-body flex cursor-pointer gap-2.5 text-left text-xs leading-snug text-[#D1D5DB]",
  checkbox:
    "mt-0.5 h-4 w-4 shrink-0 rounded border-white/30 bg-white text-[#254E85] focus:ring-[#3B82F6]/30",
  privacyLink:
    "font-medium text-[#3B82F6] underline decoration-[rgba(59,130,246,0.35)] underline-offset-2 hover:decoration-[#3B82F6]",
  error: "font-body text-sm text-[#FCA5A5]",
} as const;

/** Panel modal (legacy / futuras superficies newsletter). */
export const NEWSLETTER_PANEL_CLASS = newsletterCtaStyles.panel;
