/** Oculta badges tipo "+ 5000 vendidos" / "+ 10,000 sold" en PDP. */
const SOLD_COUNT_BADGE_RE = /^\+\s*[\d.,\s]+\s*(sold|vendidos)\s*$/i;

export function resolvePdpSalesBadge(badge?: string): string | undefined {
  if (!badge?.trim()) return undefined;
  if (SOLD_COUNT_BADGE_RE.test(badge.trim())) return undefined;
  return badge;
}
