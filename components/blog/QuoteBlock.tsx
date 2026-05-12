import ScrollReveal from "@/components/blog/ScrollReveal";

type QuoteBlockProps = {
  text: string;
};

/**
 * Standalone typographic beat — large, centered, minimal chrome.
 */
export default function QuoteBlock({ text }: QuoteBlockProps) {
  return (
    <section className="border-y border-earth-brown/12 bg-soft-stone py-16 md:py-24 lg:py-28">
      <ScrollReveal>
        <blockquote className="mx-auto max-w-4xl px-6 text-center sm:px-10">
          <p className="font-editorial font-light leading-tight tracking-tight text-dark-base text-[clamp(1.65rem,4.2vw,3.25rem)]">
            {text}
          </p>
        </blockquote>
      </ScrollReveal>
    </section>
  );
}
