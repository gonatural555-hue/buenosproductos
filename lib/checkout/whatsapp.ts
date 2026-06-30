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

export function isWhatsAppConfigured(): boolean {
  const digits = normalizeWhatsAppDigits(getWhatsAppNumber());
  return digits.length >= 10;
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
  if (!phone || !isWhatsAppConfigured()) return null;
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
    .map((item) => `• ${item.title} × ${item.quantity}`)
    .join("\n");

  return params.template
    .replace(/\{orderId\}/g, params.orderId)
    .replace(/\{total\}/g, params.totalLabel)
    .replace(/\{email\}/g, params.email)
    .replace(/\{items\}/g, itemsBlock)
    .replace(/\{address\}/g, formatAddressBlock(params.address));
}
