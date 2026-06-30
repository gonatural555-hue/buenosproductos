import type { Address } from "@/context/UserContext";

/**
 * NEXT_PUBLIC_WHATSAPP_NUMBER — reiniciá `npm run dev` tras cambiar .env.local
 * (Next.js embebe variables NEXT_PUBLIC_* al arrancar el servidor).
 */
export function getWhatsAppNumber(): string | null {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim();
  if (!raw) return null;
  return raw;
}

export function isWhatsAppNumberValid(
  phone: string | null | undefined
): boolean {
  return normalizeWhatsAppDigits(phone).length >= 10;
}

export function isWhatsAppConfigured(): boolean {
  return isWhatsAppNumberValid(getWhatsAppNumber());
}

/** Lectura en servidor (p. ej. RSC) — evita depender del bundle del cliente. */
export function resolveWhatsAppCheckoutConfig(): {
  number: string | null;
  configured: boolean;
} {
  const number = getWhatsAppNumber();
  return {
    number,
    configured: isWhatsAppNumberValid(number),
  };
}

function normalizeWhatsAppDigits(phone: string | null | undefined): string {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
}

export function buildWhatsAppHref(phone: string, message: string): string {
  const digits = normalizeWhatsAppDigits(phone);
  const text = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${text}`;
}

/** Enlace de soporte/consultas (sin crear pedido). */
export function buildWhatsAppSupportHref(message: string): string | null {
  const phone = getWhatsAppNumber();
  return buildWhatsAppSupportHrefFromNumber(phone, message);
}

export function buildWhatsAppSupportHrefFromNumber(
  phone: string | null | undefined,
  message: string
): string | null {
  if (!phone || !isWhatsAppNumberValid(phone)) return null;
  return buildWhatsAppHref(phone, message);
}

export function formatAddressBlock(address: Address): string {
  const lines = [
    address.fullName,
    address.addressLine1,
    address.addressLine2,
    [address.city, address.state, address.postalCode].filter(Boolean).join(", "),
    address.country,
    address.phone ? `Tel: ${address.phone}` : null,
  ].filter((line): line is string => Boolean(line && String(line).trim()));
  return lines.join("\n");
}

type OrderLine = {
  title: string;
  quantity: number;
  price: number;
  priceLabel?: string;
  variantSummary?: string;
};

export function buildWhatsAppOrderMessage(params: {
  template: string;
  orderId: string;
  totalLabel: string;
  email: string;
  items: OrderLine[];
  address: Address;
}): string {
  const itemsBlock = params.items
    .map((item) => {
      const variant = item.variantSummary ? ` (${item.variantSummary})` : "";
      const unitPrice = item.priceLabel ? ` — ${item.priceLabel}` : "";
      return `• ${item.title}${variant} × ${item.quantity}${unitPrice}`;
    })
    .join("\n");

  return params.template
    .replace(/\{orderId\}/g, params.orderId)
    .replace(/\{total\}/g, params.totalLabel)
    .replace(/\{email\}/g, params.email)
    .replace(/\{items\}/g, itemsBlock)
    .replace(/\{address\}/g, formatAddressBlock(params.address));
}
