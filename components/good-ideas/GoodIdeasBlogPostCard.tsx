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

export default function GoodIdeasBlogPostCard({
  href,
  title,
  excerpt,
  categoryLabel,
  image,
  ctaLabel,
}: Props) {
  return (
    <Link href={href} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-[20px] border border-[#E5E7EB] bg-white shadow-[0_8px_28px_rgba(0,0,0,0.06)] transition duration-300 hover:border-[rgba(59,130,246,0.35)] hover:shadow-[0_16px_40px_rgba(59,130,246,0.1)] motion-reduce:transition-none">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#FAFAFA]">
          <SmartImage
            src={image}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center transition duration-500 group-hover:scale-[1.04]"
          />
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3B82F6]">
            {categoryLabel}
          </p>
          <h2
            className={`mt-2 line-clamp-3 ${giType.blogPostTitle} text-[#111111] transition group-hover:text-[#3B82F6]`}
          >
            {title}
          </h2>
          {excerpt ? (
            <p className="mt-3 line-clamp-3 flex-1 font-body text-sm leading-relaxed text-[#6B7280]">
              {excerpt}
            </p>
          ) : null}
          <span className="mt-4 inline-flex font-body text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] transition group-hover:text-[#3B82F6]">
            {ctaLabel}
          </span>
        </div>
      </article>
    </Link>
  );
}
