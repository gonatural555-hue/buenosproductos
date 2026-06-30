import type { UISurface } from "@/lib/ui-surface";

type Props = {
  title: string;
  bullets: string[];
  surface?: UISurface;
  embedded?: boolean;
  /** `gi`: sin max-width propio; el padre debe usar `GI_PDP_INNER`. */
  contentLayout?: "default" | "gi";
};

const BENEFIT_ICONS = [
  // Check — quality / reliability
  (className: string) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  // Bolt — performance
  (className: string) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
      />
    </svg>
  ),
  // Shield — protection
  (className: string) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    </svg>
  ),
  // Sparkles — versatility
  (className: string) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
      />
    </svg>
  ),
] as const;

function sectionHeadingClass(L: boolean) {
  return L
    ? "font-inter text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500"
    : "font-inter text-[11px] font-semibold uppercase tracking-[0.14em] text-[rgba(232,236,241,0.55)]";
}

function benefitCardClass(L: boolean) {
  return L
    ? "group flex gap-3.5 rounded-xl border border-neutral-200/90 bg-white p-4 transition-colors duration-200 hover:border-[#3B82F6]/40 hover:bg-neutral-50/80"
    : "group flex gap-3.5 rounded-xl border border-white/[0.08] bg-[#151B24] p-4 transition-colors duration-200 hover:border-[#3B82F6]/45 hover:bg-[#151B24]/90";
}

function iconWrapClass(L: boolean) {
  return L
    ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#3B82F6]/10 text-[#2563EB] transition-colors group-hover:bg-[#3B82F6]/15"
    : "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#3B82F6]/12 text-[#60A5FA] transition-colors group-hover:bg-[#3B82F6]/18";
}

function benefitTextClass(L: boolean) {
  return L
    ? "text-[15px] leading-relaxed text-neutral-800"
    : "text-[15px] leading-relaxed text-[rgba(232,236,241,0.88)]";
}

export default function PdpBenefitsSection({
  title,
  bullets,
  surface = "dark",
  embedded = false,
  contentLayout = "default",
}: Props) {
  const L = surface === "light";
  if (bullets.length === 0) return null;

  const innerClass =
    contentLayout === "gi"
      ? "w-full"
      : "mx-auto max-w-4xl px-6 sm:px-10 lg:px-16";

  const content = (
    <div className={innerClass}>
      <h2 id="pdp-benefits-heading" className={sectionHeadingClass(L)}>
        {title}
      </h2>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-4">
        {bullets.slice(0, 4).map((line, index) => {
          const Icon = BENEFIT_ICONS[index % BENEFIT_ICONS.length];
          return (
            <li key={line} className={benefitCardClass(L)}>
              <span className={iconWrapClass(L)}>{Icon("h-5 w-5")}</span>
              <span className={benefitTextClass(L)}>{line}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );

  if (embedded) {
    return (
      <div aria-labelledby="pdp-benefits-heading">{content}</div>
    );
  }

  return (
    <section
      className={
        L
          ? "border-t border-neutral-200/90 bg-neutral-50/50 py-14 md:py-16"
          : "border-t border-white/[0.07] bg-[#151B24]/40 py-14 md:py-16"
      }
      aria-labelledby="pdp-benefits-heading"
    >
      {content}
    </section>
  );
}
