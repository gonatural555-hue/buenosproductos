import Link from "next/link";
import SmartImage from "@/components/SmartImage";
import { giType } from "@/lib/ui/gi-typography";

type Props = {
  href: string;
  title: string;
  excerpt?: string;
  categoryLabel: string;
  image: string;
  ctaLabel: string;
};

export default function GoodIdeasBlogPostRow({
  href,
  title,
  excerpt,
  categoryLabel,
  image,
  ctaLabel,
}: Props) {
  return (
    <Link href={href} className="group block">
      <article className="flex gap-4 overflow-hidden rounded-xl border border-[#E5E5E5] bg-white p-4 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)] transition hover:border-[rgba(59,130,246,0.45)] hover:shadow-[0_16px_40px_-16px_rgba(0,0,0,0.4)] sm:gap-5 sm:p-5">
        <div className="relative h-[88px] w-[120px] shrink-0 overflow-hidden rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] sm:h-[96px] sm:w-[140px]">
          <SmartImage
            src={image}
            alt=""
            fill
            sizes="140px"
            className="object-cover object-center"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3B82F6]">
            {categoryLabel}
          </p>
          <h2 className={`mt-1.5 ${giType.blogPostTitle} text-[#111111] transition group-hover:text-[#3B82F6]`}>
            {title}
          </h2>
          {excerpt ? (
            <p className="mt-2 line-clamp-2 font-body text-sm leading-relaxed text-[#737373]">
              {excerpt}
            </p>
          ) : null}
          <span className="mt-3 inline-flex font-body text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] transition group-hover:text-[#3B82F6]">
            {ctaLabel}
          </span>
        </div>
      </article>
    </Link>
  );
}
