import StarRating from "@/components/pdp/StarRating";
import { GI_PDP_STICKY_TOP } from "@/lib/ui/goodideas-design";
import type { ReviewStats } from "@/lib/pdp-review-stats";

type Props = {
  stats: ReviewStats;
  basedOnLabel: string;
  verifiedLabel: string;
  surface?: "dark" | "light";
};

const STARS = [5, 4, 3, 2, 1] as const;

export default function RatingSummary({
  stats,
  basedOnLabel,
  verifiedLabel,
  surface = "light",
}: Props) {
  const light = surface === "light";

  const panelClass = light
    ? "rounded-[22px] border border-[#ECECEC] bg-white p-7 shadow-[0_4px_18px_rgba(0,0,0,0.05)] sm:p-8"
    : "rounded-[22px] border border-white/[0.08] bg-[#151B24]/60 p-7 sm:p-8";

  const averageClass = light
    ? "font-body text-5xl font-bold tabular-nums tracking-tight text-[#111111]"
    : "font-body text-5xl font-bold tabular-nums tracking-tight text-[#E8ECF1]";

  const basedOnClass = light
    ? "font-body text-sm text-[#6B7280]"
    : "font-body text-sm text-[rgba(232,236,241,0.65)]";

  const badgeClass = light
    ? "inline-flex items-center gap-1.5 rounded-full border border-[#BBF7D0] bg-[#F0FDF4] px-3 py-1 font-body text-xs font-semibold text-[#16A34A]"
    : "inline-flex items-center gap-1.5 rounded-full border border-[#16A34A]/30 bg-[#16A34A]/10 px-3 py-1 font-body text-xs font-semibold text-[#4ADE80]";

  const starLabelClass = light
    ? "w-8 shrink-0 font-body text-sm font-medium text-[#374151]"
    : "w-8 shrink-0 font-body text-sm font-medium text-[rgba(232,236,241,0.75)]";

  const pctClass = light
    ? "w-10 shrink-0 text-right font-body text-xs font-medium tabular-nums text-[#6B7280]"
    : "w-10 shrink-0 text-right font-body text-xs font-medium tabular-nums text-[rgba(232,236,241,0.55)]";

  const trackClass = light
    ? "h-2 flex-1 overflow-hidden rounded-full bg-[#E5E7EB]"
    : "h-2 flex-1 overflow-hidden rounded-full bg-white/[0.08]";

  return (
    <aside
      className={`${panelClass} lg:sticky ${GI_PDP_STICKY_TOP} lg:self-start`}
    >
      <div className="space-y-3 text-center lg:text-left">
        <p className={averageClass}>{stats.averageRating.toFixed(1)}</p>
        <div className="flex justify-center lg:justify-start">
          <StarRating rating={stats.averageRating} size="lg" />
        </div>
        <p className={basedOnClass}>{basedOnLabel}</p>
        <div className="flex justify-center pt-1 lg:justify-start">
          <span className={badgeClass}>
            <svg
              viewBox="0 0 20 20"
              className="h-3.5 w-3.5 shrink-0"
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

      <div className={`mt-8 space-y-3 border-t pt-8 ${light ? "border-[#ECECEC]" : "border-white/[0.08]"}`}>
        {STARS.map((star) => {
          const pct = stats.ratingPercentages[star];
          return (
            <div key={star} className="flex items-center gap-3">
              <span className={starLabelClass}>{star}★</span>
              <div className={trackClass}>
                <div
                  className="h-full rounded-full bg-[#F4B400] transition-all duration-300 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className={pctClass}>{pct}%</span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
