const REVIEW_ARRAY_KEYS = new Set([
  "evaViewList",
  "evaluations",
  "evaluationList",
  "feedbacks",
  "feedbackList",
  "reviewList",
  "reviews",
  "pcTradeReviews",
  "tradeReviewList",
  "buyerReviewList",
  "buyerShowReviewList",
  "items",
  "list",
  "result",
  "data",
]);

const BODY_KEYS = [
  "buyerFeedback",
  "buyerAddFbFeedback",
  "feedback",
  "content",
  "reviewContent",
  "text",
  "comment",
  "body",
];

const TRANSLATION_KEYS = ["buyerTranslationFeedback", "translationFeedback"];

const NAME_KEYS = [
  "buyerName",
  "buyerLoginId",
  "anonymousName",
  "displayName",
  "author",
  "userName",
];

const COUNTRY_KEYS = ["buyerCountry", "country", "buyerCountryName"];

const DATE_KEYS = [
  "evalDate",
  "gmtCreate",
  "gmtEvaluated",
  "buyerAddFbTime",
  "feedbackDate",
  "reviewDate",
  "createTime",
  "created_at",
  "date",
];

const RATING_KEYS = [
  "buyerEval",
  "buyerStar",
  "star",
  "starLevel",
  "rating",
  "score",
  "evalStar",
  "evaluationRating",
];

const EXTERNAL_ID_KEYS = [
  "feedbackId",
  "reviewId",
  "id",
  "evaluationId",
  "buyerFeedbackId",
];

function pickString(obj, keys) {
  for (const key of keys) {
    const v = obj?.[key];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

function pickNumber(obj, keys) {
  for (const key of keys) {
    const v = obj?.[key];
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() && !Number.isNaN(Number(v))) {
      return Number(v);
    }
  }
  return null;
}

function pickExternalId(obj) {
  for (const key of EXTERNAL_ID_KEYS) {
    const v = obj?.[key];
    if (v == null || v === "") continue;
    if (typeof v === "string" || typeof v === "number") {
      const s = String(v).trim();
      if (s && s !== "0") return s;
    }
  }
  return null;
}

/** AliExpress usa 20–100 (×20) o 1–5 según endpoint. */
export function normalizeRating(raw) {
  if (raw == null || Number.isNaN(Number(raw))) return null;
  const n = Number(raw);
  if (n >= 1 && n <= 5) return Math.round(n);
  if (n > 5 && n <= 10) return Math.min(5, Math.max(1, Math.round(n / 2)));
  if (n > 10 && n <= 100) return Math.min(5, Math.max(1, Math.round(n / 20)));
  return null;
}

function parseDate(raw) {
  if (raw == null) return null;
  if (typeof raw === "number") {
    const ms = raw < 1e12 ? raw * 1000 : raw;
    const d = new Date(ms);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }
  const s = String(raw).trim();
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/** Fingerprint para dedup (ignora mayúsculas / espacios). */
export function textFingerprint(text) {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .slice(0, 240);
}

function wordOverlapRatio(a, b) {
  const wordsA = textFingerprint(a).split(/\s+/).filter((w) => w.length > 2);
  const wordsB = textFingerprint(b).split(/\s+/).filter((w) => w.length > 2);
  if (wordsA.length === 0 || wordsB.length === 0) return 0;
  const setB = new Set(wordsB);
  let overlap = 0;
  for (const w of wordsA) {
    if (setB.has(w)) overlap += 1;
  }
  return overlap / Math.min(wordsA.length, wordsB.length);
}

/** Una sola versión del texto — evita EN en body + ES en title. */
function pickReviewBody(obj) {
  const original = pickString(obj, BODY_KEYS);
  const translation = pickString(obj, TRANSLATION_KEYS);

  if (original && translation) {
    if (wordOverlapRatio(original, translation) >= 0.45) {
      return original;
    }
    return original.length >= translation.length ? original : translation;
  }

  return original || translation;
}

function dedupKey(mapped) {
  if (mapped.external_id) {
    return `id:${mapped.external_id}`;
  }
  return `fp:${textFingerprint(mapped.body)}|${mapped.rating}`;
}

function looksLikeReview(obj) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return false;
  const rating = normalizeRating(pickNumber(obj, RATING_KEYS));
  const body = pickReviewBody(obj);
  return Boolean(rating && body && body.length >= 3);
}

function mapReview(obj) {
  const rating = normalizeRating(pickNumber(obj, RATING_KEYS));
  const body = pickReviewBody(obj);
  if (!rating || !body) return null;

  const author =
    pickString(obj, NAME_KEYS) ||
    (obj.anonymous === true || obj.buyerAnonymous === true
      ? "AliExpress buyer"
      : "AliExpress buyer");
  const country = pickString(obj, COUNTRY_KEYS);
  const created_at =
    parseDate(pickNumber(obj, DATE_KEYS) ?? pickString(obj, DATE_KEYS)) ??
    new Date().toISOString();
  const external_id = pickExternalId(obj);

  return {
    rating,
    title: null,
    body: body.slice(0, 4000),
    author_name: author.slice(0, 120),
    country: country?.slice(0, 80) ?? null,
    external_id,
    created_at,
  };
}

function tryAddReview(mapped, out, seen) {
  if (!mapped) return;
  const key = dedupKey(mapped);
  if (seen.has(key)) return;
  seen.add(key);
  out.push(mapped);
}

function collectReviewsFromNode(node, out, seen) {
  if (node == null) return;

  if (Array.isArray(node)) {
    for (const item of node) {
      if (looksLikeReview(item)) {
        tryAddReview(mapReview(item), out, seen);
      }
      collectReviewsFromNode(item, out, seen);
    }
    return;
  }

  if (typeof node !== "object") return;

  for (const [key, value] of Object.entries(node)) {
    if (REVIEW_ARRAY_KEYS.has(key) && Array.isArray(value)) {
      collectReviewsFromNode(value, out, seen);
    }
  }

  if (looksLikeReview(node)) {
    tryAddReview(mapReview(node), out, seen);
  }

  for (const value of Object.values(node)) {
    if (value && typeof value === "object") {
      collectReviewsFromNode(value, out, seen);
    }
  }
}

/**
 * @param {unknown[]} payloads
 * @param {number} maxReviews
 * @param {{ minRating?: number }} options
 */
export function normalizeAliExpressPayloads(
  payloads,
  maxReviews = 20,
  { minRating = 4 } = {}
) {
  const out = [];
  const seen = new Set();

  for (const payload of payloads) {
    collectReviewsFromNode(payload, out, seen);
  }

  const min = Math.max(1, Math.min(5, minRating));

  return out
    .filter((r) => r.rating >= min)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, maxReviews);
}

export function extractItemIdFromUrl(listingUrl) {
  const match = String(listingUrl).match(/\/item\/(\d+)\.html/i);
  return match?.[1] ?? null;
}
