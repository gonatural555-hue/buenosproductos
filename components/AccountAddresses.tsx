"use client";

import { useMemo, useState } from "react";
import { useUser, type Address } from "@/context/UserContext";
import { useTranslations } from "@/components/i18n/LocaleProvider";
import { AR_PROVINCES } from "@/lib/addresses/ar-provinces";

type FormState = Omit<Address, "id" | "isDefault"> & { isDefault: boolean };

const emptyForm: FormState = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  postalCode: "",
  state: "",
  country: "",
  isDefault: false,
};

export default function AccountAddresses() {
  const { addresses, upsertAddress, setDefaultAddress, removeAddress } = useUser();
  const t = useTranslations();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const hasAddresses = addresses.length > 0;
  const sortedAddresses = useMemo(() => {
    const copy = [...addresses];
    copy.sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
    return copy;
  }, [addresses]);

  const startNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setIsEditing(true);
  };

  const startEdit = (address: Address) => {
    setForm({
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      postalCode: address.postalCode,
      state: address.state || "",
      country: address.country,
      isDefault: address.isDefault,
    });
    setEditingId(address.id);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    void removeAddress(id);
  };

  const handleDefault = (id: string) => {
    void setDefaultAddress(id);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void (async () => {
      const trimmed = {
        ...form,
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        addressLine1: form.addressLine1.trim(),
        addressLine2: form.addressLine2?.trim() || "",
        city: form.city.trim(),
        postalCode: form.postalCode.trim(),
        state: form.state.trim(),
        country: form.country.trim(),
      };

      if (
        !trimmed.fullName ||
        !trimmed.phone ||
        !trimmed.addressLine1 ||
        !trimmed.city ||
        !trimmed.postalCode ||
        !trimmed.state ||
        !trimmed.country
      ) {
        return;
      }

      const nextAddress: Address = {
        id: editingId ?? "",
        ...trimmed,
        isDefault: form.isDefault,
      };

      await upsertAddress(nextAddress);

      setIsEditing(false);
      setEditingId(null);
      setForm(emptyForm);
    })();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">{t("accountAddresses.title")}</h2>
        <button
          type="button"
          onClick={startNew}
          className="rounded-xl border border-earth-brown/18 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-primary transition-colors duration-200 ease-out hover:border-accent-gold/60 hover:text-accent-gold/90"
        >
          {t("accountAddresses.addNew")}
        </button>
      </div>

      {!hasAddresses && !isEditing && (
        <div className="rounded-2xl border border-earth-brown/15 bg-soft-stone p-6">
          <p className="text-sm text-text-muted">
            {t("accountAddresses.noAddresses")}
          </p>
        </div>
      )}

      {hasAddresses && (
        <div className="grid gap-4 sm:grid-cols-2">
          {sortedAddresses.map((address) => (
            <div
              key={address.id}
              className="rounded-2xl border border-earth-brown/15 bg-soft-stone p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {address.fullName}
                  </p>
                  <p className="text-xs text-text-muted">{address.phone}</p>
                </div>
                {address.isDefault && (
                  <span className="rounded-full border border-accent-gold/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-gold">
                    {t("accountAddresses.defaultBadge")}
                  </span>
                )}
              </div>
              <div className="mt-3 text-sm text-text-muted space-y-1">
                <p>{address.addressLine1}</p>
                {address.addressLine2 && <p>{address.addressLine2}</p>}
                <p>
                  {address.city}, {address.state} · {address.postalCode}
                </p>
                <p>{address.country}</p>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => startEdit(address)}
                  className="text-xs font-semibold uppercase tracking-[0.18em] text-text-primary hover:text-accent-gold/90 transition-colors duration-200"
                >
                  {t("accountAddresses.edit")}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(address.id)}
                  className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted hover:text-text-primary transition-colors duration-200"
                >
                  {t("accountAddresses.delete")}
                </button>
                {!address.isDefault && (
                  <button
                    type="button"
                    onClick={() => handleDefault(address.id)}
                    className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted hover:text-accent-gold/90 transition-colors duration-200"
                  >
                    {t("accountAddresses.setAsDefault")}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isEditing && (
        <form
          className="rounded-2xl border border-earth-brown/15 bg-soft-stone p-6 space-y-4"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
                {t("accountAddresses.form.fullName")}
              </label>
              <input
                value={form.fullName}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, fullName: event.target.value }))
                }
                type="text"
                required
                className="w-full rounded-xl border border-earth-brown/20 bg-white px-4 py-3 text-sm text-text-primary focus:border-accent-gold/60 focus:outline-none"
                placeholder={t("accountAddresses.form.fullNamePlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
                {t("accountAddresses.form.phone")}
              </label>
              <input
                value={form.phone}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, phone: event.target.value }))
                }
                type="tel"
                required
                className="w-full rounded-xl border border-earth-brown/20 bg-white px-4 py-3 text-sm text-text-primary focus:border-accent-gold/60 focus:outline-none"
                placeholder={t("accountAddresses.form.phonePlaceholder")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
              {t("accountAddresses.form.address")}
            </label>
            <input
              value={form.addressLine1}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, addressLine1: event.target.value }))
              }
              type="text"
              required
              className="w-full rounded-xl border border-earth-brown/20 bg-white px-4 py-3 text-sm text-text-primary focus:border-accent-gold/60 focus:outline-none"
              placeholder={t("accountAddresses.form.addressPlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
              {t("accountAddresses.form.addressLine2")}
            </label>
            <input
              value={form.addressLine2}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, addressLine2: event.target.value }))
              }
              type="text"
              className="w-full rounded-xl border border-earth-brown/20 bg-white px-4 py-3 text-sm text-text-primary focus:border-accent-gold/60 focus:outline-none"
              placeholder={t("accountAddresses.form.addressLine2Placeholder")}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
                {t("accountAddresses.form.postalCode")}
              </label>
              <input
                value={form.postalCode}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, postalCode: event.target.value }))
                }
                type="text"
                required
                className="w-full rounded-xl border border-earth-brown/20 bg-white px-4 py-3 text-sm text-text-primary focus:border-accent-gold/60 focus:outline-none"
                placeholder={t("accountAddresses.form.postalCodePlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
                {t("accountAddresses.form.state")}
              </label>
              <select
                value={form.state}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, state: event.target.value }))
                }
                required
                className="w-full rounded-xl border border-earth-brown/20 bg-white px-4 py-3 text-sm text-text-primary focus:border-accent-gold/60 focus:outline-none"
              >
                <option value="">{t("accountAddresses.form.statePlaceholder")}</option>
                {AR_PROVINCES.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
                {t("accountAddresses.form.city")}
              </label>
              <input
                value={form.city}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, city: event.target.value }))
                }
                type="text"
                required
                className="w-full rounded-xl border border-earth-brown/20 bg-white px-4 py-3 text-sm text-text-primary focus:border-accent-gold/60 focus:outline-none"
                placeholder={t("accountAddresses.form.cityPlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
                {t("accountAddresses.form.country")}
              </label>
              <input
                value={form.country}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, country: event.target.value }))
                }
                type="text"
                required
                className="w-full rounded-xl border border-earth-brown/20 bg-white px-4 py-3 text-sm text-text-primary focus:border-accent-gold/60 focus:outline-none"
                placeholder={t("accountAddresses.form.countryPlaceholder")}
              />
            </div>
          </div>

          <label className="flex items-center gap-3 text-sm text-text-muted">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, isDefault: event.target.checked }))
              }
              className="h-4 w-4 rounded border border-earth-brown/30 bg-white text-accent-gold focus:ring-accent-gold/60"
            />
            {t("accountAddresses.form.setAsDefault")}
          </label>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="rounded-xl bg-text-primary px-5 py-3 text-sm font-semibold text-dark-base transition-colors duration-200 ease-out hover:bg-white"
            >
              {t("accountAddresses.form.save")}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditingId(null);
                setForm(emptyForm);
              }}
              className="rounded-xl border border-earth-brown/20 px-5 py-3 text-sm font-semibold text-muted-gray transition-colors duration-200 ease-out hover:text-dark-base"
            >
              {t("accountAddresses.form.cancel")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

