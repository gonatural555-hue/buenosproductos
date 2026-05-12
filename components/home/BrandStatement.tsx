import ScrollReveal from "@/components/blog/ScrollReveal";

type BrandStatementProps = {
  text: string;
};

export default function BrandStatement({ text }: BrandStatementProps) {
  return (
    <section className="border-y border-earth-brown/10 bg-[#FFFFFF] py-20 md:py-28 lg:py-32">
      <ScrollReveal>
        <p className="font-display mx-auto max-w-4xl px-6 text-center font-light leading-[1.15] tracking-tight text-dark-base text-[clamp(1.65rem,4.2vw,2.85rem)] md:leading-tight">
          {text}
        </p>
      </ScrollReveal>
    </section>
  );
}
