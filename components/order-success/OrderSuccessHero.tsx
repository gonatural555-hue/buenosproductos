"use client";

type Props = {
  title: string;
  subtitle: string;
  hint: string;
};

export default function OrderSuccessHero({ title, subtitle, hint }: Props) {
  return (
    <section className="relative overflow-hidden border-b border-[#E5E7EB] bg-white pb-8 pt-4 md:pb-10 md:pt-6">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(59,130,246,0.14),transparent_70%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-[640px] text-center gi-os-animate-in">
        <div className="mx-auto mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[rgba(34,197,94,0.12)]">
          <svg
            className="h-9 w-9 text-[#16A34A]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="font-body text-[clamp(1.625rem,3.5vw,2.25rem)] font-bold leading-tight tracking-[-0.02em] text-[#111111]">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-xl font-body text-base leading-relaxed text-[#6B7280] md:text-[17px]">
          {subtitle}
        </p>
        <p className="mx-auto mt-4 max-w-lg font-body text-sm leading-relaxed text-[#9CA3AF]">
          {hint}
        </p>
      </div>
    </section>
  );
}
