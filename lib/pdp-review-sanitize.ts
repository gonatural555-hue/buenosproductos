import type { ProductReviewRow } from "@/lib/pdp-supabase-types";

const MIN_DISPLAY_RATING = 4;

function textFingerprint(text: string): string {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .slice(0, 240);
}

/** Filtra <4★, deduplica por texto+rating y oculta title (traducción AE). */
export function sanitizeReviewsForDisplay(
  reviews: ProductReviewRow[]
): ProductReviewRow[] {
  const seen = new Set<string>();
  const out: ProductReviewRow[] = [];

  for (const review of reviews) {
    if (review.rating < MIN_DISPLAY_RATING) continue;

    const fp = `${textFingerprint(review.text ?? "")}|${review.rating}`;
    if (seen.has(fp)) continue;
    seen.add(fp);

    out.push(
      review.title
        ? { ...review, title: null }
        : review
    );
  }

  return out;
}
