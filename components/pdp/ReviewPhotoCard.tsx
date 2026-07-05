import SmartImage from "@/components/SmartImage";
import StarRating from "@/components/pdp/StarRating";
import {
  formatReviewDate,
  reviewAuthorInitial,
} from "@/lib/pdp-review-format";
import { isValidImageSrc } from "@/lib/image-src";
import type { ProductReviewRow } from "@/lib/pdp-supabase-types";

type Props = {
  review: ProductReviewRow;
  verifiedLabel: string;
  anonymousLabel: string;
  locale?: string;
  surface?: "dark" | "light";
};

export default function ReviewPhotoCard({
  review,
  verifiedLabel,
  anonymousLabel,
  locale = "en-US",
  surface = "light",
}: Props) {
  const light = surface === "light";
  const displayName = review.author?.trim() || anonymousLabel;
  const initial = reviewAuthorInitial(review.author);
  const images = (review.images ?? []).filter(isValidImageSrc);
  const heroImage = images[0];
  const extraCount = images.length > 1 ? images.length - 1 : 0;

  const cardClass = light
    ? "flex h-full flex-col overflow-hidden rounded-[20px] border border-[#ECECEC] bg-white shadow-[0_8px_28px_rgba(0,0,0,0.06)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[rgba(59,130,246,0.25)] hover:shadow-[0_16px_40px_rgba(59,130,246,0.1)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    : "flex h-full flex-col overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#151B24]/60 transition-colors duration-200 hover:border-white/[0.14]";

  const nameClass = light
    ? "font-body text-sm font-semibold text-[#111111]"
    : "font-body text-sm font-semibold text-[#E8ECF1]";

  const dateClass = light
    ? "font-body text-xs text-[#9CA3AF]"
    : "font-body text-xs text-[rgba(232,236,241,0.5)]";

  const badgeClass = light
    ? "inline-flex items-center gap-1 rounded-full bg-[#F0FDF4] px-2 py-0.5 font-body text-[10px] font-semibold text-[#16A34A]"
    : "inline-flex items-center gap-1 rounded-full bg-[#16A34A]/10 px-2 py-0.5 font-body text-[10px] font-semibold text-[#4ADE80]";

  const titleClass = light
    ? "font-body text-sm font-semibold text-[#111111]"
    : "font-body text-sm font-semibold text-[#E8ECF1]";

  const bodyClass = light
    ? "line-clamp-4 font-body text-sm leading-relaxed text-[#6B7280]"
    : "line-clamp-4 font-body text-sm leading-relaxed text-[rgba(232,236,241,0.72)]";

  const avatarClass = light
    ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F3F4F6] font-body text-sm font-bold text-[#111111]"
    : "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.08] font-body text-sm font-bold text-[#E8ECF1]";

  if (!heroImage) return null;

  return (
    <article className={cardClass}>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <header className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-2.5">
            <div className={avatarClass} aria-hidden>
              {initial}
            </div>
            <div className="min-w-0 space-y-1">
              <p className={`truncate ${nameClass}`}>{displayName}</p>
              <span className={badgeClass}>
                <svg
                  viewBox="0 0 20 20"
                  className="h-3 w-3 shrink-0"
                  fill="currentColor"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
                {verifiedLabel}
              </span>
            </div>
          </div>
          <time dateTime={review.created_at} className={`shrink-0 ${dateClass}`}>
            {formatReviewDate(review.created_at, locale)}
          </time>
        </header>

        <div className="mt-4 space-y-2">
          <StarRating rating={review.rating} size="sm" />
          {review.title ? <h4 className={titleClass}>{review.title}</h4> : null}
        </div>

        {review.text ? <p className={`mt-3 ${bodyClass}`}>{review.text}</p> : null}
      </div>

      <div className="relative aspect-[4/3] w-full shrink-0 bg-[#FAFAFA]">
        <SmartImage
          src={heroImage}
          alt={`${displayName} — review photo`}
          fill
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 33vw"
          className="object-cover object-center"
          loading="lazy"
        />
        {extraCount > 0 ? (
          <span className="absolute bottom-3 right-3 rounded-full bg-[#111111]/75 px-2.5 py-1 font-body text-[11px] font-semibold text-white backdrop-blur-sm">
            +{extraCount}
          </span>
        ) : null}
      </div>
    </article>
  );
}
