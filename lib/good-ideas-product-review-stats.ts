import { sanitizeReviewsForDisplay } from "@/lib/pdp-review-sanitize";
import { computeReviewStats } from "@/lib/pdp-review-stats";
import type { ProductReviewRow } from "@/lib/pdp-supabase-types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ProductReviewStatsSnapshot = {
  averageRating: number;
  totalReviews: number;
};

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/** Stats agregadas por producto (misma sanitización que el PDP). */
export async function fetchGoodIdeasProductReviewStatsMap(
  productIds: string[]
): Promise<Record<string, ProductReviewStatsSnapshot>> {
  if (productIds.length === 0 || !isSupabaseConfigured()) {
    return {};
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("product_reviews")
      .select("id, product_id, rating, title, text, author, country, created_at")
      .in("product_id", productIds);

    if (error || !data?.length) {
      return {};
    }

    const grouped = new Map<string, ProductReviewRow[]>();
    for (const row of data as ProductReviewRow[]) {
      const list = grouped.get(row.product_id) ?? [];
      list.push(row);
      grouped.set(row.product_id, list);
    }

    const out: Record<string, ProductReviewStatsSnapshot> = {};
    for (const id of productIds) {
      const sanitized = sanitizeReviewsForDisplay(grouped.get(id) ?? []);
      const stats = computeReviewStats(sanitized);
      if (stats.totalReviews > 0) {
        out[id] = {
          averageRating: stats.averageRating,
          totalReviews: stats.totalReviews,
        };
      }
    }

    return out;
  } catch {
    return {};
  }
}
