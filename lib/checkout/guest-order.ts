import type { Order } from "@/context/UserContext";

const GUEST_ORDER_KEY = "gn-guest-order-snapshot";

export function persistGuestOrderSnapshot(order: Order): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(GUEST_ORDER_KEY, JSON.stringify(order));
  } catch {
    /* ignore */
  }
}

export function readGuestOrderSnapshot(): Order | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(GUEST_ORDER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Order;
  } catch {
    return null;
  }
}

export function clearGuestOrderSnapshot(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(GUEST_ORDER_KEY);
  } catch {
    /* ignore */
  }
}
