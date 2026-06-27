import type { Address } from "@/context/UserContext";

export function createEmptyCheckoutAddress(fullName = ""): Address {
  return {
    id: "",
    fullName,
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    state: "",
    country: "Argentina",
    isDefault: true,
  };
}
