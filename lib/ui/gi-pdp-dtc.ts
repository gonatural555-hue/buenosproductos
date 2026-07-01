/** PDP estilo DTC premium (referencia Sealify) — fondo blanco, tipografía sans, CTAs negros. */
export const GI_DTC = {
  pageBg: "bg-white text-[#111111]",
  ink: "#111111",
  muted: "#6B7280",
  border: "#E5E7EB",
  success: "#16A34A",
  star: "#FBBF24",
  cta:
    "w-full min-h-[52px] rounded-sm bg-[#111111] px-8 py-4 font-body text-base font-semibold text-white transition-colors hover:bg-[#2a2a2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]/30 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  badge:
    "inline-flex items-center rounded-sm border border-[#111111] px-2.5 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-[#111111]",
  sectionPad: "py-14 md:py-20",
  container: "mx-auto w-full max-w-[1320px] px-5 sm:px-6 lg:px-8",
  heroGrid:
    "hidden lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-start lg:gap-x-10 xl:gap-x-14",
  buyBoxSticky:
    "lg:sticky lg:top-[calc(env(safe-area-inset-top,0px)+5.5rem)] lg:self-start",
} as const;
