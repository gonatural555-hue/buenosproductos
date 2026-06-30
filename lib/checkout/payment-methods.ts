/** Recargo aplicado al total cuando el cliente elige PayPal (comisiones). */
export const PAYPAL_SURCHARGE_RATE = 0.3;

export type CheckoutPaymentMethod = "whatsapp" | "paypal";

export function roundUsd(amount: number): number {
  return Math.round(amount * 100) / 100;
}

export function computePayPalSurcharge(subtotalUsd: number): number {
  return roundUsd(subtotalUsd * PAYPAL_SURCHARGE_RATE);
}

export function computePayPalCheckoutTotal(subtotalUsd: number): number {
  return roundUsd(subtotalUsd * (1 + PAYPAL_SURCHARGE_RATE));
}

export function paypalTotalsMatch(
  subtotalUsd: number,
  chargedTotalUsd: number
): boolean {
  return (
    Math.abs(computePayPalCheckoutTotal(subtotalUsd) - chargedTotalUsd) < 0.011
  );
}
