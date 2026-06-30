import type { ReviewStats } from "@/lib/pdp-review-stats";

type Props = {
  stats: ReviewStats;
  reviewsLabel: string;
};

function Stars({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <span className="flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${i < rounded ? "text-[#FBBF24]" : "text-white/20"}`}
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.157c.969 0 1.371 1.24.588 1.81l-3.363 2.444a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.538 1.118l-3.364-2.444a1 1 0 00-1.175 0l-3.364 2.444c-.783.57-1.838-.197-1.538-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.03 9.382c-.783-.57-.38-1.81.588-1.81h4.157a1 1 0 00.95-.69l1.286-3.955z" />
        </svg>
      ))}
    </span>
  );
}

export default function RatingSummary({ stats, reviewsLabel }: Props) {
  const stars = [5, 4, 3, 2, 1] as const;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="font-body text-4xl font-semibold tabular-nums tracking-tight text-[#E8ECF1]">
          {stats.averageRating.toFixed(1)}
        </p>
        <Stars rating={stats.averageRating} />
        <p className="font-body text-sm text-[rgba(232,236,241,0.6)]">
          {stats.totalReviews} {reviewsLabel}
        </p>
      </div>

      <div className="space-y-2.5">
        {stars.map((star) => {
          const pct = stats.ratingPercentages[star];
          return (
            <div key={star} className="flex items-center gap-3">
              <span className="w-8 font-body text-sm text-[rgba(232,236,241,0.65)]">
                {star}★
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
                <div
                  className="h-full rounded-full bg-[#FBBF24] transition-all duration-300 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-10 text-right font-body text-xs tabular-nums text-[rgba(232,236,241,0.5)]">
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
