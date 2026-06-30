"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProductVideoRow } from "@/lib/pdp-supabase-types";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/browser";

type State = {
  videos: ProductVideoRow[];
  loading: boolean;
  error: string | null;
};

export function useProductVideos(productId: string, enabled = true) {
  const [state, setState] = useState<State>({
    videos: [],
    loading: Boolean(enabled && productId),
    error: null,
  });

  useEffect(() => {
    if (!enabled || !productId) {
      setState({ videos: [], loading: false, error: null });
      return;
    }

    let cancelled = false;

    async function load() {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      if (!isSupabaseConfigured()) {
        if (!cancelled) {
          setState({ videos: [], loading: false, error: null });
        }
        return;
      }

      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase
          .from("product_videos")
          .select("*")
          .eq("product_id", productId)
          .order("created_at", { ascending: false });

        if (cancelled) return;

        if (process.env.NODE_ENV === "development") {
          console.log("PRODUCT ID:", productId);
          console.log("VIDEOS DATA:", data);
          console.log("VIDEOS ERROR:", error);
        }

        if (error) {
          setState({ videos: [], loading: false, error: error.message });
          return;
        }

        setState({
          videos: (data ?? []) as ProductVideoRow[],
          loading: false,
          error: null,
        });
      } catch (err) {
        if (!cancelled) {
          setState({
            videos: [],
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
      videos: state.videos,
      loading: state.loading,
      error: state.error,
      hasVideos: state.videos.length > 0,
    }),
    [state]
  );
}
