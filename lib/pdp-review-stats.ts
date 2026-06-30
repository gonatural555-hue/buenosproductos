import type { ProductReviewRow } from "@/lib/pdp-supabase-types";

export type RatingDistribution = Record<1 | 2 | 3 | 4 | 5, number>;

export type ReviewStats = {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: RatingDistribution;
  ratingPercentages: RatingDistribution;
};

const EMPTY_DIST: RatingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

export function computeReviewStats(
  reviews: Pick<ProductReviewRow, "rating">[]
): ReviewStats {
  if (reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { ...EMPTY_DIST },
      ratingPercentages: { ...EMPTY_DIST },
    };
  }

  const ratingDistribution: RatingDistribution = { ...EMPTY_DIST };
  let sum = 0;

  for (const review of reviews) {
    const star = Math.min(5, Math.max(1, Math.round(review.rating))) as
      | 1
      | 2
      | 3
      | 4
      | 5;
    ratingDistribution[star] += 1;
    sum += review.rating;
  }

  const total = reviews.length;
  const ratingPercentages = { ...EMPTY_DIST };
  (Object.keys(ratingDistribution) as unknown as Array<keyof RatingDistribution>).forEach(
    (star) => {
      ratingPercentages[star] = Math.round(
        (ratingDistribution[star] / total) * 100
      );
    }
  );

  return {
    averageRating: sum / total,
    totalReviews: total,
    ratingDistribution,
    ratingPercentages,
  };
}
