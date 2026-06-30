"use client";

import { useEffect, useMemo, useState } from "react";
import { computeReviewStats, type ReviewStats } from "@/lib/pdp-review-stats";
import { sanitizeReviewsForDisplay } from "@/lib/pdp-review-sanitize";
import type { ProductReviewRow } from "@/lib/pdp-supabase-types";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/browser";

type State = {
  reviews: ProductReviewRow[];
  stats: ReviewStats;
  loading: boolean;
  error: string | null;
};

const EMPTY_STATS = computeReviewStats([]);

export function useProductReviews(productId: string, enabled = true) {
  const [state, setState] = useState<State>({
    reviews: [],
    stats: EMPTY_STATS,
    loading: Boolean(enabled && productId),
    error: null,
  });

  useEffect(() => {
    if (!enabled || !productId) {
      setState({
        reviews: [],
        stats: EMPTY_STATS,
        loading: false,
        error: null,
      });
      return;
    }

    let cancelled = false;

    async function load() {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      if (!isSupabaseConfigured()) {
        if (!cancelled) {
          setState({
            reviews: [],
            stats: EMPTY_STATS,
            loading: false,
            error: null,
          });
        }
        return;
      }

      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase
          .from("product_reviews")
          .select("*")
          .eq("product_id", productId)
          .order("created_at", { ascending: false });

        if (cancelled) return;

        if (process.env.NODE_ENV === "development") {
          console.log("PRODUCT ID:", productId);
          console.log("REVIEWS DATA:", data);
          console.log("REVIEWS ERROR:", error);
        }

        if (error) {
          setState({
            reviews: [],
            stats: EMPTY_STATS,
            loading: false,
            error: error.message,
          });
          return;
        }

        const reviews = sanitizeReviewsForDisplay(
          (data ?? []) as ProductReviewRow[]
        );
        setState({
          reviews,
          stats: computeReviewStats(reviews),
          loading: false,
          error: null,
        });
      } catch (err) {
        if (!cancelled) {
          setState({
            reviews: [],
            stats: EMPTY_STATS,
            loading: false,
            error: err instanceof Error ? err.message : "Unknown error",
          });
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [productId, enabled]);

  return useMemo(
    () => ({
      reviews: state.reviews,
      stats: state.stats,
      loading: state.loading,
      error: state.error,
      hasReviews: state.reviews.length > 0,
    }),
    [state]
  );
}
