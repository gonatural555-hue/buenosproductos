"use client";

type Step = { title: string; description: string };

type Props = {
  title: string;
  subtitle: string;
  steps: Step[];
};

export default function OrderWhatHappensNext({ title, subtitle, steps }: Props) {
  return (
    <section className="border-t border-[#E5E7EB] py-10 md:py-14">
      <header className="max-w-2xl">
        <h2 className="font-body text-xl font-bold tracking-[-0.02em] text-[#111111] md:text-2xl">
          {title}
        </h2>
        <p className="mt-2 font-body text-[15px] leading-relaxed text-[#6B7280]">
          {subtitle}
        </p>
      </header>
      <ol className="mt-8 grid gap-4 md:grid-cols-3 md:gap-5">
        {steps.map((step, index) => (
          <li
            key={`${step.title}-${index}`}
            className="gi-os-card rounded-[18px] border border-[#ECECEC] bg-white p-5 md:p-6"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#111111] font-body text-sm font-bold text-white">
              {index + 1}
            </div>
            <h3 className="font-body text-[15px] font-semibold text-[#111111]">
              {step.title}
            </h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-[#6B7280]">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
