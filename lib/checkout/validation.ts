import type { Address } from "@/context/UserContext";

export function trimCheckoutAddress(addr: Address): Address {
  return {
    ...addr,
    fullName: addr.fullName.trim(),
    phone: addr.phone.trim(),
    addressLine1: addr.addressLine1.trim(),
    addressLine2: addr.addressLine2?.trim() || "",
    city: addr.city.trim(),
    postalCode: addr.postalCode.trim(),
    country: addr.country.trim(),
    state: addr.state?.trim() || "",
  };
}

export function isCheckoutAddressComplete(addr: Address): boolean {
  const t = trimCheckoutAddress(addr);
  const base = Boolean(
    t.fullName &&
      t.phone &&
      t.addressLine1 &&
      t.city &&
      t.postalCode &&
      t.country
  );
  if (!base) return false;
  if (t.country === "Argentina" || t.country === "AR") {
    return Boolean(t.state);
  }
  return true;
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
