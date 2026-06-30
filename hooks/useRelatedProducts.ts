"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { Product } from "@/lib/product-types";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/browser";

function shuffleSeeded<T>(items: T[], seed: string): T[] {
  const arr = [...items];
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  for (let i = arr.length - 1; i > 0; i--) {
    h = (h * 1664525 + 1013904223) | 0;
    const j = Math.abs(h) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function fetchRatingAverages(): Promise<Record<string, number>> {
  if (!isSupabaseConfigured()) return {};

  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("product_reviews")
      .select("product_id, rating");

    if (error || !data) return {};

    const sums: Record<string, { sum: number; count: number }> = {};
    for (const row of data as Array<{ product_id: string; rating: number }>) {
      const id = row.product_id;
      const rating = Number(row.rating);
      if (!sums[id]) sums[id] = { sum: 0, count: 0 };
      sums[id].sum += rating;
      sums[id].count += 1;
    }

    return Object.fromEntries(
      Object.entries(sums).map(([id, { sum, count }]) => [id, sum / count])
    );
  } catch {
    return {};
  }
}

async function fetchRelationIds(productId: string): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("product_relations")
      .select("related_product_id")
      .eq("product_id", productId);

    if (error || !data) return [];
    return data.map((row: { related_product_id: string }) => row.related_product_id);
  } catch {
    return [];
  }
}

export function useRelatedProducts(productId: string, enabled = true, limit = 8) {
  const locale = useLocale();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(Boolean(enabled && productId));

  useEffect(() => {
    if (!enabled || !productId) {
      setProducts([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);

      try {
        const {
          getGoodIdeasProducts,
          getGoodIdeasProductById,
          localizeGoodIdeasProduct,
        } = await import("@/lib/good-ideas-products");

        const current = getGoodIdeasProductById(productId);
        const category = (current?.category ?? "").trim().toLowerCase();

        const ids: string[] = [];
        const seen = new Set<string>([productId]);

        const relationIds = await fetchRelationIds(productId);
        for (const id of relationIds) {
          if (ids.length >= limit) break;
          if (seen.has(id)) continue;
          seen.add(id);
          ids.push(id);
        }

        const catalog = getGoodIdeasProducts().filter((p) => p.id !== productId);

        if (ids.length < limit) {
          for (const product of catalog) {
            if (ids.length >= limit) break;
            if (product.category.trim().toLowerCase() !== category || seen.has(product.id)) {
              continue;
            }
            seen.add(product.id);
            ids.push(product.id);
          }
        }

        if (ids.length < limit) {
          const ratingByProduct = await fetchRatingAverages();
          const ranked = [...catalog]
            .filter((p) => !seen.has(p.id))
            .sort(
              (a, b) =>
                (ratingByProduct[b.id] ?? 0) - (ratingByProduct[a.id] ?? 0)
            );

          for (const product of ranked) {
            if (ids.length >= limit) break;
            seen.add(product.id);
            ids.push(product.id);
          }
        }

        if (ids.length < limit) {
          const remaining = catalog.filter((p) => !seen.has(p.id));
          for (const product of shuffleSeeded(remaining, productId)) {
            if (ids.length >= limit) break;
            seen.add(product.id);
            ids.push(product.id);
          }
        }

        const resolved = ids
          .map((id) => getGoodIdeasProductById(id))
          .filter((p): p is Product => Boolean(p))
          .map((p) => localizeGoodIdeasProduct(p, locale));

        if (process.env.NODE_ENV === "development") {
          console.log("PRODUCT ID:", productId);
          console.log("RELATED PRODUCTS:", resolved);
        }

        if (!cancelled) {
          setProducts(resolved);
          setLoading(false);
        }
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.log("RELATED PRODUCTS ERROR:", err);
        }
        if (!cancelled) {
          setProducts([]);
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [productId, locale, enabled, limit]);

  return useMemo(
    () => ({
      products,
      loading,
      hasProducts: products.length > 0,
    }),
    [products, loading]
  );
}
