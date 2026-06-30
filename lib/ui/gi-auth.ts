/** Tokens UI — auth Good Products (login / registro). */

export const GI_AUTH_PANEL_CLASS =
  "w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#151B24]/95 px-6 py-8 shadow-[0_24px_64px_-24px_rgba(0,0,0,0.65)] backdrop-blur-md md:max-w-md md:px-8 md:py-9";

export const giAuthInputClass =
  "w-full rounded-xl border border-white/[0.1] bg-[#0B0F14] px-4 py-3 font-body text-sm text-[#E8ECF1] placeholder:text-[rgba(232,236,241,0.4)] focus:border-[#3B82F6]/55 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/25";

export const giAuthLabelClass =
  "font-body text-xs font-semibold uppercase tracking-[0.12em] text-[rgba(232,236,241,0.65)]";

export const giAuthToggleBtnClass =
  "absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[rgba(232,236,241,0.7)] transition hover:bg-white/[0.06] hover:text-[#E8ECF1] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/40";

export const giAuthSubmitClass =
  "w-full rounded-full bg-[#3B82F6] px-4 py-3 font-body text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(59,130,246,0.55)] transition duration-200 hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:opacity-60";

export const giAuthTabClass = (active: boolean) =>
  [
    "relative pb-3 pt-1 font-body text-sm font-semibold uppercase tracking-[0.08em] transition-colors duration-200",
    active ? "text-[#E8ECF1]" : "text-[rgba(232,236,241,0.5)] hover:text-[#E8ECF1]",
  ].join(" ");
