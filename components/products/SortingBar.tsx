"use client";

type SortOption = { value: string; label: string };

type SortingBarProps = {
  locale: string;
  q?: string;
  sort: string;
  /** Conserva filtro por categoría al ordenar */
  category?: string;
  options: SortOption[];
  label: string;
  /** URL del formulario (p. ej. página de categoría) */
  action?: string;
  /** Muestra prefijo "Ordenar:" antes del valor activo */
  showPrefix?: boolean;
  className?: string;
};

/**
 * Ordenación mínima via GET — sin JS obligatorio, mantiene q + category.
 */
export default function SortingBar({
  locale,
  q,
  sort,
  category,
  options,
  label,
  action,
  showPrefix = true,
  className = "",
}: SortingBarProps) {
  const formAction = action ?? `/${locale}/products`;
  const activeLabel =
    options.find((opt) => opt.value === (sort || "featured"))?.label ??
    options[0]?.label;

  return (
    <form
      action={formAction}
      method="get"
      className={`flex items-center justify-end gap-2 font-inter ${className}`}
    >
      {q?.trim() ? <input type="hidden" name="q" value={q.trim()} /> : null}
      {category?.trim() ? (
        <input type="hidden" name="category" value={category.trim()} />
      ) : null}
      <label className="sr-only" htmlFor="products-sort">
        {label}
      </label>
      {showPrefix ? (
        <span className="hidden text-sm text-forest/70 sm:inline">{label}:</span>
      ) : null}
      <div className="relative inline-flex items-center">
        {showPrefix ? (
          <span className="text-sm text-forest/70 sm:hidden">{label}:</span>
        ) : null}
        <select
          id="products-sort"
          name="sort"
          defaultValue={sort || "featured"}
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
          className="max-w-[12rem] cursor-pointer appearance-none border-0 bg-transparent py-1 pl-1 pr-6 text-right text-sm text-dark-base outline-none sm:max-w-[14rem]"
          aria-label={`${label}: ${activeLabel}`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span
          className="pointer-events-none absolute right-0 text-forest/50"
          aria-hidden
        >
          ▾
        </span>
      </div>
    </form>
  );
}
