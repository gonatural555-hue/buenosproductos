import ScrollReveal from "@/components/blog/ScrollReveal";

type BrandStatementProps = {
  text: string;
};

export default function BrandStatement({ text }: BrandStatementProps) {
  return (
    <section className="border-y border-white/[0.06] bg-dark-base py-20 md:py-28 lg:py-32">
      <ScrollReveal>
        <p className="mx-auto max-w-4xl px-6 text-center font-light leading-[1.15] tracking-tight text-text-primary text-[clamp(1.65rem,4.2vw,2.85rem)] md:leading-tight">
          {text}
        </p>
      </ScrollReveal>
    </section>
  );
}
