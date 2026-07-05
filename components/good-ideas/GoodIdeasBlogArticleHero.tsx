import SmartImage from "@/components/SmartImage";

type Props = {
  title: string;
  subtitle?: string;
  categoryLabel?: string;
  image: string;
  imageFit?: "cover" | "contain";
};

export default function GoodIdeasBlogArticleHero({
  title,
  subtitle,
  categoryLabel,
  image,
  imageFit = "cover",
}: Props) {
  const contain = imageFit === "contain";

  return (
    <section className="border-b border-[#E5E5E5] bg-white">
      <div className="mx-auto max-w-[calc(1315px+4rem)] px-8 py-10 md:py-14">
        <div className="mx-auto max-w-[1315px]">
          {categoryLabel ? (
            <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3B82F6]">
              {categoryLabel}
            </p>
          ) : null}
          <h1 className="mt-3 font-display text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-tight tracking-[-0.02em] text-[#111111]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-4 max-w-3xl font-body text-base leading-relaxed text-[#737373] md:text-lg">
              {subtitle}
            </p>
          ) : null}
          <div
            className={`relative mt-8 overflow-hidden rounded-2xl border border-[#E5E5E5] bg-[#FAFAFA] ${
              contain
                ? "aspect-[16/10] min-h-[220px] md:min-h-[320px]"
                : "aspect-[21/9] min-h-[180px] md:min-h-[260px]"
            }`}
          >
            <SmartImage
              src={image}
              alt={title}
              fill
              priority
              className={
                contain
                  ? "object-contain object-center p-6 md:p-10"
                  : "object-cover object-center"
              }
              sizes="(max-width: 1315px) 100vw, 1315px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
