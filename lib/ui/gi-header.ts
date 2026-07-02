/** Clases compartidas — header Good Products (light ecommerce). */

export const giHeaderClasses = {
  shell:
    "border-b border-[#E5E7EB] bg-white/95 shadow-[0_1px_0_rgba(11,15,20,0.04)] backdrop-blur-md supports-[backdrop-filter]:bg-white/90",
  shellDark:
    "border-b border-white/[0.08] bg-[rgba(11,15,20,0.88)] backdrop-blur-xl",
  inner:
    "relative mx-auto grid h-[64px] max-w-[1400px] grid-cols-[auto_1fr_auto] items-center gap-3 px-4 sm:gap-4 sm:px-6 md:h-[72px] lg:h-[76px]",
  navDesktop:
    "hidden min-w-0 items-center justify-center gap-1 lg:flex xl:gap-1.5",
  navLinkLight:
    "rounded-full px-3 py-2 font-body text-[13px] font-medium tracking-[-0.01em] text-[#374151] transition-colors duration-200 hover:text-[#3B82F6] xl:px-3.5 xl:text-sm",
  navLinkLightActive:
    "text-[#0B0F14] font-semibold hover:text-[#2563EB]",
  navLinkDark:
    "rounded-full px-3 py-2 font-body text-[13px] font-medium tracking-[-0.01em] text-white/90 transition-colors duration-200 hover:text-[#3B82F6] xl:px-3.5 xl:text-sm",
  navLinkDarkActive: "text-white font-semibold",
  utilityCluster: "flex shrink-0 items-center gap-1.5 sm:gap-2",
  pillGroup:
    "flex items-center gap-0.5 rounded-full border border-[#E5E7EB] bg-[#F9FAFB] p-0.5",
  pillGroupDark: "flex items-center gap-0.5 rounded-full border border-white/10 bg-white/[0.06] p-0.5",
  iconBtnLight:
    "relative flex h-10 w-10 items-center justify-center rounded-full text-[#0B0F14] transition-colors duration-200 hover:bg-[#F3F4F6] hover:text-[#3B82F6]",
  iconBtnDark:
    "relative flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors duration-200 hover:bg-white/8 hover:text-[#3B82F6]",
  menuBtn:
    "flex h-10 w-10 items-center justify-center rounded-full text-[#0B0F14] transition-colors hover:bg-[#F3F4F6] lg:hidden",
  menuBtnDark:
    "flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/8 lg:hidden",
  mobilePanel:
    "border-t border-[#E5E7EB] bg-white px-4 py-3 shadow-[0_12px_32px_rgba(15,23,42,0.08)] lg:hidden",
  mobilePanelDark:
    "border-t border-white/[0.08] bg-[#0B0F14] px-4 py-3 lg:hidden",
  mobileNavLink:
    "block rounded-xl px-3 py-3 font-body text-sm font-medium text-[#374151] transition-colors hover:bg-[#F3F4F6] hover:text-[#3B82F6]",
  mobileNavLinkActive: "bg-[#F3F4F6] font-semibold text-[#0B0F14]",
  mobileNavLinkDark:
    "block rounded-xl px-3 py-3 font-body text-sm font-medium text-[#E8ECF1] transition-colors hover:bg-white/[0.06] hover:text-[#3B82F6]",
  mobileNavLinkDarkActive: "bg-white/[0.06] font-semibold text-white",
  divider: "mx-1 hidden h-6 w-px bg-[#E5E7EB] sm:block",
  dividerDark: "mx-1 hidden h-6 w-px bg-white/10 sm:block",
} as const;
