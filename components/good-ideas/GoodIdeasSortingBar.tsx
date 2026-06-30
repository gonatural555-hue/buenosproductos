"use client";

import { giPlpClasses } from "@/lib/ui/good-ideas-plp";

type SortOption = { value: string; label: string };

type Props = {
  q?: string;
  sort: string;
  category?: string;
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  options: SortOption[];
  label: string;
  action: string;
  className?: string;
};

export default function GoodIdeasSortingBar({
  q,
  sort,
  category,
  brand,
  priceMin,
  priceMax,
  options,
  label,
  action,
  className = "",
}: Props) {
  const activeLabel =
    options.find((opt) => opt.value === (sort || "featured"))?.label ??
    options[0]?.label;

  return (
    <form
      action={action}
      method="get"
      className={`flex items-center justify-end gap-2 font-inter ${className}`}
    >
      {q?.trim() ? <input type="hidden" name="q" value={q.trim()} /> : null}
      {category?.trim() ? (
        <input type="hidden" name="category" value={category.trim()} />
      ) : null}
      {brand?.trim() ? (
        <input type="hidden" name="brand" value={brand.trim()} />
      ) : null}
      {priceMin != null && Number.isFinite(priceMin) ? (
        <input type="hidden" name="priceMin" value={String(priceMin)} />
      ) : null}
      {priceMax != null && Number.isFinite(priceMax) ? (
        <input type="hidden" name="priceMax" value={String(priceMax)} />
      ) : null}
      <label className="sr-only" htmlFor="gi-products-sort">
        {label}
      </label>
      <span className={`hidden ${giPlpClasses.sortLabel} sm:inline`}>
        {label}:
      </span>
      <div className="relative inline-flex items-center">
        <span className={`${giPlpClasses.sortLabel} sm:hidden`}>
          {label}:
        </span>
        <select
          id="gi-products-sort"
          name="sort"
          defaultValue={sort || "featured"}
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
          className={giPlpClasses.sortSelect}
          aria-label={`${label}: ${activeLabel}`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white">
              {opt.label}
            </option>
          ))}
        </select>
        <span className={giPlpClasses.sortChevron} aria-hidden>
          ▾
        </span>
      </div>
    </form>
  );
}
