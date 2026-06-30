import type { ProductReviewRow } from "@/lib/pdp-supabase-types";

type Props = {
  review: ProductReviewRow;
  verifiedLabel?: string;
  locale?: string;
};

function formatReviewDate(iso: string, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function ReviewCard({
  review,
  locale = "en-US",
}: Props) {
  const rounded = Math.round(review.rating);

  return (
    <article className="rounded-xl border border-white/[0.08] bg-[#151B24]/60 p-5 transition-colors duration-200 hover:border-white/[0.12]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-0.5" aria-hidden>
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              viewBox="0 0 20 20"
              className={`h-3.5 w-3.5 ${i < rounded ? "text-[#FBBF24]" : "text-white/20"}`}
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.157c.969 0 1.371 1.24.588 1.81l-3.363 2.444a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.538 1.118l-3.364-2.444a1 1 0 00-1.175 0l-3.364 2.444c-.783.57-1.838-.197-1.538-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.03 9.382c-.783-.57-.38-1.81.588-1.81h4.157a1 1 0 00.95-.69l1.286-3.955z" />
            </svg>
          ))}
        </span>
        <time
          dateTime={review.created_at}
          className="font-body text-xs text-[rgba(232,236,241,0.5)]"
        >
          {formatReviewDate(review.created_at, locale)}
        </time>
      </div>

      {review.title ? (
        <h4 className="mt-3 font-body text-base font-semibold text-[#E8ECF1]">
          {review.title}
        </h4>
      ) : null}

      {review.text ? (
        <p className="mt-2 font-body text-[15px] leading-relaxed text-[rgba(232,236,241,0.78)]">
          {review.text}
        </p>
      ) : null}

      {review.author ? (
        <p className="mt-3 font-body text-sm text-[rgba(232,236,241,0.55)]">
          — {review.author}
          {review.country ? ` · ${review.country}` : ""}
        </p>
      ) : null}
    </article>
  );
}
