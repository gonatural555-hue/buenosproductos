import { reviewAuthorInitial } from "@/lib/pdp-review-format";
import type { GoodIdeasHomeReviewCard } from "@/lib/good-ideas-home-reviews";

type Props = {
  review: GoodIdeasHomeReviewCard;
  anonymousLabel: string;
};

function HomeReviewStars({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} de 5`}
    >
      {Array.from({ length: 5 }, (_, i) => {
        const filled = rating >= i + 1;
        return (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            className="h-4 w-4"
            fill={filled ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={1.2}
            style={{ color: filled ? "#FBBF24" : "rgba(232,236,241,0.28)" }}
            aria-hidden
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
          </svg>
        );
      })}
    </div>
  );
}

export default function GoodIdeasHomeReviewCard({
  review,
  anonymousLabel,
}: Props) {
  const displayName = review.author.trim() || anonymousLabel;
  const initial = reviewAuthorInitial(review.author);

  return (
    <article className="flex h-full flex-col rounded-[20px] border border-white/[0.08] bg-[#151B24] p-6 transition duration-300 hover:border-[rgba(59,130,246,0.22)] hover:shadow-[0_16px_40px_rgba(59,130,246,0.08)] motion-reduce:transition-none sm:p-7">
      <HomeReviewStars rating={review.rating} />

      <blockquote className="mt-4 flex-1">
        <p className="line-clamp-4 font-body text-sm leading-relaxed text-[#E8ECF1] sm:text-[15px]">
          “{review.text}”
        </p>
      </blockquote>

      <footer className="mt-5 flex items-center gap-3 border-t border-white/[0.08] pt-4">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3B82F6]/[0.12] font-body text-sm font-bold text-[#3B82F6]"
          aria-hidden
        >
          {initial}
        </div>
        <div className="min-w-0">
          <p className="truncate font-body text-sm font-semibold text-[#E8ECF1]">
            {displayName}
          </p>
          {review.country ? (
            <p className="truncate font-body text-xs text-[rgba(232,236,241,0.62)]">
              {review.country}
            </p>
          ) : null}
        </div>
      </footer>
    </article>
  );
}
