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

export default function ReviewCard({
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

  const cardClass = light
    ? "rounded-[20px] border border-[#ECECEC] bg-white p-6 shadow-[0_4px_18px_rgba(0,0,0,0.05)] transition-all duration-[180ms] ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] sm:p-7"
    : "rounded-[20px] border border-white/[0.08] bg-[#151B24]/60 p-6 transition-colors duration-200 hover:border-white/[0.12] sm:p-7";

  const nameClass = light
    ? "font-body text-[15px] font-semibold text-[#111111]"
    : "font-body text-[15px] font-semibold text-[#E8ECF1]";

  const countryClass = light
    ? "font-body text-sm text-[#6B7280]"
    : "font-body text-sm text-[rgba(232,236,241,0.6)]";

  const dateClass = light
    ? "shrink-0 font-body text-[13px] text-[#9CA3AF]"
    : "shrink-0 font-body text-[13px] text-[rgba(232,236,241,0.5)]";

  const badgeClass = light
    ? "inline-flex items-center gap-1 rounded-full bg-[#F0FDF4] px-2 py-0.5 font-body text-[11px] font-semibold text-[#16A34A]"
    : "inline-flex items-center gap-1 rounded-full bg-[#16A34A]/10 px-2 py-0.5 font-body text-[11px] font-semibold text-[#4ADE80]";

  const titleClass = light
    ? "font-body text-base font-semibold text-[#111111]"
    : "font-body text-base font-semibold text-[#E8ECF1]";

  const bodyClass = light
    ? "font-body text-[15px] leading-relaxed text-[#374151]"
    : "font-body text-[15px] leading-relaxed text-[rgba(232,236,241,0.78)]";

  const avatarClass = light
    ? "flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[#F3F4F6] font-body text-base font-bold text-[#111111]"
    : "flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-white/[0.08] font-body text-base font-bold text-[#E8ECF1]";

  return (
    <article className={cardClass}>
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className={avatarClass} aria-hidden>
            {initial}
          </div>
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <p className={nameClass}>{displayName}</p>
              {review.country ? (
                <span className={countryClass}>· {review.country}</span>
              ) : null}
            </div>
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
        <time dateTime={review.created_at} className={dateClass}>
          {formatReviewDate(review.created_at, locale)}
        </time>
      </header>

      <div className="mt-4 space-y-2">
        <StarRating rating={review.rating} size="sm" />
        {review.title ? <h4 className={titleClass}>{review.title}</h4> : null}
      </div>

      {review.text ? (
        <p className={`mt-3 ${bodyClass}`}>{review.text}</p>
      ) : null}

      {images.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {images.map((src, index) => (
            <li
              key={`${src}-${index}`}
              className="relative h-16 w-16 overflow-hidden rounded-[10px] border border-[#ECECEC] bg-[#F9FAFB]"
            >
              <SmartImage
                src={src}
                alt={`${displayName} — foto ${index + 1}`}
                fill
                sizes="64px"
                className="object-cover"
                loading="lazy"
              />
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
