import { getGoodIdeasProducts } from "@/lib/good-ideas-products";
import { sanitizeReviewsForDisplay } from "@/lib/pdp-review-sanitize";
import type { ProductReviewRow } from "@/lib/pdp-supabase-types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/i18n/config";
import { productPath, productsPath } from "@/lib/routing/paths";

export type GoodIdeasHomeReviewCard = {
  id: string;
  rating: number;
  text: string;
  author: string;
  country?: string;
  productId?: string;
  /** `true` cuando no hay datos en Supabase — reemplazar al importar reviews. */
  isPlaceholder: boolean;
};

export type GoodIdeasHomeReviewsPayload = {
  reviews: GoodIdeasHomeReviewCard[];
  viewMoreHref: string;
  source: "supabase" | "placeholder";
};

const HOME_REVIEWS_LIMIT = 4;
const REVIEW_TEXT_MAX = 140;

type PlaceholderInput = {
  author: string;
  country: string;
  text: string;
  rating?: number;
};

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

function truncateReviewText(text: string, max = REVIEW_TEXT_MAX): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max).trimEnd()}…`;
}

function authorKey(review: ProductReviewRow): string {
  const name = review.author?.trim().toLowerCase();
  return name || review.id;
}

function pickHomeReviews(
  rows: ProductReviewRow[],
  limit = HOME_REVIEWS_LIMIT
): ProductReviewRow[] {
  const candidates = sanitizeReviewsForDisplay(rows).filter((row) =>
    Boolean(row.text?.trim())
  );

  const sorted = [...candidates].sort((a, b) => {
    const ratingDiff = b.rating - a.rating;
    if (ratingDiff !== 0) return ratingDiff;
    const lenA = a.text?.length ?? 0;
    const lenB = b.text?.length ?? 0;
    const ideal = 120;
    return Math.abs(lenA - ideal) - Math.abs(lenB - ideal);
  });

  const picked: ProductReviewRow[] = [];
  const seenAuthors = new Set<string>();
  const seenProducts = new Set<string>();

  const tryPick = (row: ProductReviewRow, requireNewAuthor: boolean) => {
    if (picked.length >= limit) return;
    const key = authorKey(row);
    if (requireNewAuthor && seenAuthors.has(key)) return;
    picked.push(row);
    seenAuthors.add(key);
    seenProducts.add(row.product_id);
  };

  for (const row of sorted) {
    if (picked.length >= limit) break;
    if (!seenProducts.has(row.product_id) || picked.length >= limit - 1) {
      tryPick(row, true);
    }
  }

  for (const row of sorted) {
    if (picked.length >= limit) break;
    tryPick(row, true);
  }

  for (const row of sorted) {
    if (picked.length >= limit) break;
    tryPick(row, false);
  }

  return picked.slice(0, limit);
}

function mapRowToCard(row: ProductReviewRow): GoodIdeasHomeReviewCard {
  return {
    id: row.id,
    rating: row.rating,
    text: truncateReviewText(row.text ?? ""),
    author: row.author?.trim() || "",
    country: row.country?.trim() || undefined,
    productId: row.product_id,
    isPlaceholder: false,
  };
}

function buildPlaceholderCards(
  placeholders: PlaceholderInput[]
): GoodIdeasHomeReviewCard[] {
  return placeholders.slice(0, HOME_REVIEWS_LIMIT).map((item, index) => ({
    id: `placeholder-${index + 1}`,
    rating: item.rating ?? 5,
    text: item.text,
    author: item.author,
    country: item.country,
    isPlaceholder: true,
  }));
}

function resolveViewMoreHref(
  locale: Locale,
  reviews: GoodIdeasHomeReviewCard[]
): string {
  const productId = reviews.find((r) => r.productId && !r.isPlaceholder)
    ?.productId;
  if (productId) {
    return `${productPath(locale, productId)}#pdp-reviews`;
  }
  return productsPath(locale);
}

async function fetchSupabaseHomeReviews(): Promise<GoodIdeasHomeReviewCard[]> {
  if (!isSupabaseConfigured()) return [];

  const productIds = getGoodIdeasProducts().map((p) => p.id);
  if (productIds.length === 0) return [];

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("product_reviews")
      .select("id, product_id, rating, title, text, author, country, created_at")
      .in("product_id", productIds)
      .order("created_at", { ascending: false })
      .limit(80);

    if (error || !data?.length) return [];

    return pickHomeReviews(data as ProductReviewRow[]).map(mapRowToCard);
  } catch {
    return [];
  }
}

export async function resolveGoodIdeasHomeReviews(
  locale: Locale,
  placeholders: PlaceholderInput[]
): Promise<GoodIdeasHomeReviewsPayload> {
  const dynamic = await fetchSupabaseHomeReviews();

  if (dynamic.length > 0) {
    return {
      reviews: dynamic,
      viewMoreHref: resolveViewMoreHref(locale, dynamic),
      source: "supabase",
    };
  }

  const fallback = buildPlaceholderCards(placeholders);
  return {
    reviews: fallback,
    viewMoreHref: productsPath(locale),
    source: "placeholder",
  };
}

export function buildGoodIdeasHomeReviewPlaceholders(
  t: (key: string) => string
): PlaceholderInput[] {
  return [
    {
      author: t("goodIdeas.socialProof.placeholders.one.author"),
      country: t("goodIdeas.socialProof.placeholders.one.country"),
      text: t("goodIdeas.socialProof.placeholders.one.text"),
    },
    {
      author: t("goodIdeas.socialProof.placeholders.two.author"),
      country: t("goodIdeas.socialProof.placeholders.two.country"),
      text: t("goodIdeas.socialProof.placeholders.two.text"),
    },
    {
      author: t("goodIdeas.socialProof.placeholders.three.author"),
      country: t("goodIdeas.socialProof.placeholders.three.country"),
      text: t("goodIdeas.socialProof.placeholders.three.text"),
    },
    {
      author: t("goodIdeas.socialProof.placeholders.four.author"),
      country: t("goodIdeas.socialProof.placeholders.four.country"),
      text: t("goodIdeas.socialProof.placeholders.four.text"),
    },
  ];
}
