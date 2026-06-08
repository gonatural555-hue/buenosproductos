/** Envío estándar gratis en los primeros N pedidos pagados por usuario autenticado. */
export const WELCOME_FREE_SHIPPING_ORDERS = 3;

export function getWelcomeFreeShippingRemaining(
  paidOrderCount: number
): number {
  return Math.max(0, WELCOME_FREE_SHIPPING_ORDERS - paidOrderCount);
}

export function isWelcomeFreeShippingEligible(paidOrderCount: number): boolean {
  return paidOrderCount < WELCOME_FREE_SHIPPING_ORDERS;
}

export function countPaidOrders(
  orders: readonly { status: string }[]
): number {
  return orders.filter((o) => o.status === "paid").length;
}
