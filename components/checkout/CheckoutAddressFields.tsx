"use client";

import type { Address } from "@/context/UserContext";
import { AR_PROVINCES } from "@/lib/addresses/ar-provinces";
import {
  checkoutInputClass,
  checkoutSelectClass,
} from "@/lib/ui/checkout-form";
import { useTranslations } from "@/components/i18n/LocaleProvider";

type Props = {
  value: Address;
  onChange: (next: Address) => void;
  idPrefix?: string;
};

export default function CheckoutAddressFields({
  value,
  onChange,
  idPrefix = "ship",
}: Props) {
  const t = useTranslations();
  const set = (patch: Partial<Address>) => onChange({ ...value, ...patch });

  return (
    <div className="space-y-3">
      <select
        id={`${idPrefix}-country`}
        value={value.country || "Argentina"}
        onChange={(e) => set({ country: e.target.value })}
        className={checkoutSelectClass}
      >
        <option value="Argentina">Argentina</option>
      </select>

      <input
        id={`${idPrefix}-fullName`}
        type="text"
        value={value.fullName}
        onChange={(e) => set({ fullName: e.target.value })}
        placeholder={t("checkoutPage.form.fullName")}
        className={checkoutInputClass}
        autoComplete="name"
      />

      <input
        id={`${idPrefix}-address1`}
        type="text"
        value={value.addressLine1}
        onChange={(e) => set({ addressLine1: e.target.value })}
        placeholder={t("checkoutPage.form.address")}
        className={checkoutInputClass}
        autoComplete="address-line1"
      />

      <input
        id={`${idPrefix}-address2`}
        type="text"
        value={value.addressLine2 || ""}
        onChange={(e) => set({ addressLine2: e.target.value })}
        placeholder={t("checkoutPage.form.addressLine2")}
        className={checkoutInputClass}
        autoComplete="address-line2"
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <input
          id={`${idPrefix}-postalCode`}
          type="text"
          value={value.postalCode}
          onChange={(e) => set({ postalCode: e.target.value })}
          placeholder={t("checkoutPage.form.postalCode")}
          className={checkoutInputClass}
          autoComplete="postal-code"
        />
        <input
          id={`${idPrefix}-city`}
          type="text"
          value={value.city}
          onChange={(e) => set({ city: e.target.value })}
          placeholder={t("checkoutPage.form.city")}
          className={checkoutInputClass}
          autoComplete="address-level2"
        />
        <select
          id={`${idPrefix}-state`}
          value={value.state || ""}
          onChange={(e) => set({ state: e.target.value })}
          className={checkoutSelectClass}
          autoComplete="address-level1"
        >
          <option value="">{t("checkoutPage.form.state")}</option>
          {AR_PROVINCES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <input
        id={`${idPrefix}-phone`}
        type="tel"
        value={value.phone}
        onChange={(e) => set({ phone: e.target.value })}
        placeholder={t("checkoutPage.form.phone")}
        className={checkoutInputClass}
        autoComplete="tel"
      />
    </div>
  );
}
