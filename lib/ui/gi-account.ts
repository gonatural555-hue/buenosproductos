/** Tokens UI — página Mi cuenta Good Products. */

export const GI_ACCOUNT_TOP_PAD =
  "pt-[calc(env(safe-area-inset-top,0px)+5.5rem)] md:pt-[calc(env(safe-area-inset-top,0px)+6rem)]";

export const giAccountCard =
  "rounded-2xl border border-white/[0.08] bg-[#151B24]/80 p-6";

export const giAccountNavBtn = (active: boolean) =>
  [
    "w-full rounded-xl border px-4 py-3 text-left font-body text-sm font-semibold transition-colors duration-200",
    active
      ? "border-[#3B82F6]/45 bg-[#3B82F6]/10 text-[#E8ECF1]"
      : "border-white/[0.08] bg-[#151B24]/60 text-[rgba(232,236,241,0.65)] hover:border-white/[0.14] hover:text-[#E8ECF1]",
  ].join(" ");

export const giAccountInput =
  "w-full rounded-xl border border-white/[0.1] bg-[#0B0F14] px-4 py-3 font-body text-sm text-[#E8ECF1] placeholder:text-[rgba(232,236,241,0.4)] focus:border-[#3B82F6]/55 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/25";

export const giAccountLabel =
  "font-body text-xs font-semibold uppercase tracking-[0.12em] text-[rgba(232,236,241,0.55)]";

export const giAccountPrimaryBtn =
  "rounded-full bg-[#3B82F6] px-5 py-3 font-body text-sm font-semibold text-white transition hover:bg-[#2563EB]";

export const giAccountGhostBtn =
  "rounded-xl border border-white/[0.12] px-5 py-3 font-body text-sm font-semibold text-[rgba(232,236,241,0.72)] transition hover:border-white/20 hover:text-[#E8ECF1]";
