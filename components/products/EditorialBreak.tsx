import Image from "next/image";
import ScrollReveal from "@/components/blog/ScrollReveal";
import PremiumImageOverlay from "@/components/ui/PremiumImageOverlay";

type EditorialBreakProps = {
  variant: "image" | "text";
  title: string;
  imageSrc?: string;
  imageAlt?: string;
};

export default function EditorialBreak({
  variant,
  title,
  imageSrc,
  imageAlt = "",
}: EditorialBreakProps) {
  if (variant === "image" && imageSrc) {
    return (
      <section className="my-16 md:my-24 lg:my-28">
        <ScrollReveal>
          <div className="relative min-h-[200px] w-full overflow-hidden md:min-h-[280px]">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="100vw"
              loading="lazy"
              className="object-cover object-center"
            />
            <PremiumImageOverlay />
            <div className="absolute inset-0 flex items-center justify-center px-6">
              <p className="font-editorial max-w-2xl text-center font-medium leading-tight tracking-tight text-white text-[clamp(1.25rem,3.5vw,2rem)] [text-shadow:0_2px_28px_rgba(0,0,0,0.55),0_1px_2px_rgba(0,0,0,0.45)]">
                {title}
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>
    );
  }

  return (
    <section className="border-y border-earth-brown/12 bg-soft-stone py-14 md:py-20">
      <ScrollReveal>
        <p className="font-editorial mx-auto max-w-2xl px-6 text-center font-medium leading-snug tracking-tight text-dark-base text-[clamp(1.2rem,3vw,1.85rem)]">
          {title}
        </p>
      </ScrollReveal>
    </section>
  );
}
