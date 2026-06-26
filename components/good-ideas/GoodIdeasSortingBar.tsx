"use client";

type SortOption = { value: string; label: string };

type Props = {
  q?: string;
  sort: string;
  category?: string;
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
      {priceMin != null && Number.isFinite(priceMin) ? (
        <input type="hidden" name="priceMin" value={String(priceMin)} />
      ) : null}
      {priceMax != null && Number.isFinite(priceMax) ? (
        <input type="hidden" name="priceMax" value={String(priceMax)} />
      ) : null}
      <label className="sr-only" htmlFor="gi-products-sort">
        {label}
      </label>
      <span className="hidden text-sm text-[rgba(232,236,241,0.55)] sm:inline">
        {label}:
      </span>
      <div className="relative inline-flex items-center">
        <span className="text-sm text-[rgba(232,236,241,0.55)] sm:hidden">
          {label}:
        </span>
        <select
          id="gi-products-sort"
          name="sort"
          defaultValue={sort || "featured"}
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
          className="max-w-[12rem] cursor-pointer appearance-none border-0 bg-transparent py-1 pl-1 pr-6 text-right text-sm text-[#E8ECF1] outline-none sm:max-w-[14rem]"
          aria-label={`${label}: ${activeLabel}`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#151B24]">
              {opt.label}
            </option>
          ))}
        </select>
        <span
          className="pointer-events-none absolute right-0 text-[rgba(232,236,241,0.45)]"
          aria-hidden
        >
          ▾
        </span>
      </div>
    </form>
  );
}
