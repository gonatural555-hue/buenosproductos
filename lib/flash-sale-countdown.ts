const STORAGE_PREFIX = "gi-flash-sale-end:";

export function getFlashSaleEndMs(productId: string, hours: number): number {
  const durationMs = Math.max(1, hours) * 60 * 60 * 1000;

  if (typeof window === "undefined") {
    return Date.now() + durationMs;
  }

  const key = `${STORAGE_PREFIX}${productId}`;
  const stored = window.localStorage.getItem(key);
  if (stored) {
    const parsed = Number(stored);
    if (Number.isFinite(parsed) && parsed > Date.now()) {
      return parsed;
    }
  }

  const end = Date.now() + durationMs;
  window.localStorage.setItem(key, String(end));
  return end;
}

export type FlashSaleCountdownParts = {
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
};

export function getFlashSaleCountdownParts(endMs: number): FlashSaleCountdownParts {
  const remaining = Math.max(0, endMs - Date.now());
  if (remaining <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds, expired: false };
}

export function formatFlashSaleCountdown(parts: FlashSaleCountdownParts): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(parts.hours)}:${pad(parts.minutes)}:${pad(parts.seconds)}`;
}

export function hasActivePromoPrice(
  salePriceUsd: number,
  compareAtPriceUsd?: number
): compareAtPriceUsd is number {
  return (
    typeof compareAtPriceUsd === "number" &&
    Number.isFinite(compareAtPriceUsd) &&
    compareAtPriceUsd > salePriceUsd
  );
}
