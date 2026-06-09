import Link from "next/link";

export type FilterCategoryItem = {
  slug: string;
  label: string;
  href: string;
};

export type FilterCategoryGroup = {
  slug: string;
  label: string;
  href: string;
  children?: FilterCategoryItem[];
};

type ProductFilterSidebarProps = {
  title: string;
  categories: FilterCategoryGroup[];
  activeCategorySlug?: string | null;
  attributeLabels: {
    brands: string;
    price: string;
    sizes: string;
    color: string;
    sale: string;
  };
  className?: string;
};

function FilterRow({
  label,
  defaultOpen = false,
  children,
}: {
  label: string;
  defaultOpen?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <details
      className="group border-t border-forest/10 first:border-t-0"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 font-inter text-sm text-dark-base [&::-webkit-details-marker]:hidden">
        <span>{label}</span>
        <span className="text-forest/45 transition-transform group-open:rotate-180">
          ▾
        </span>
      </summary>
      {children ? (
        <div className="pb-4 pl-0.5 font-inter text-sm text-forest/75">
          {children}
        </div>
      ) : null}
    </details>
  );
}

export default function ProductFilterSidebar({
  title,
  categories,
  activeCategorySlug,
  attributeLabels,
  className = "",
}: ProductFilterSidebarProps) {
  return (
    <nav
      aria-label={title}
      className={`font-inter ${className}`}
    >
      <h2 className="mb-4 font-display text-lg text-dark-base">{title}</h2>

      <details className="group mb-2" open>
        <summary className="flex cursor-pointer list-none items-center justify-between py-3 font-inter text-sm font-medium text-dark-base [&::-webkit-details-marker]:hidden">
          <span>Category</span>
          <span className="text-forest/45 transition-transform group-open:rotate-180">
            ▾
          </span>
        </summary>
        <ul className="space-y-1 pb-3">
          {categories.map((cat) => {
            const isActive = activeCategorySlug === cat.slug;
            return (
              <li key={cat.slug}>
                <details className="group/cat" open={isActive}>
                  <summary className="flex cursor-pointer list-none items-center justify-between py-2 text-sm text-forest/80 [&::-webkit-details-marker]:hidden">
                    <Link
                      href={cat.href}
                      className={
                        isActive
                          ? "font-medium text-dark-base underline-offset-2 hover:underline"
                          : "hover:text-dark-base"
                      }
                    >
                      {cat.label}
                    </Link>
                    {cat.children?.length ? (
                      <span className="ml-2 text-forest/40 group-open/cat:rotate-45">
                        +
                      </span>
                    ) : null}
                  </summary>
                  {cat.children?.length ? (
                    <ul className="mb-2 ml-3 space-y-1 border-l border-forest/10 pl-3">
                      {cat.children.map((child) => (
                        <li key={child.slug}>
                          <Link
                            href={child.href}
                            className={
                              activeCategorySlug === child.slug
                                ? "text-sm font-medium text-dark-base"
                                : "text-sm text-forest/70 hover:text-dark-base"
                            }
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </details>
              </li>
            );
          })}
        </ul>
      </details>

      <div className="border-t border-forest/10">
        <FilterRow label={attributeLabels.brands} />
        <FilterRow label={attributeLabels.price} />
        <FilterRow label={attributeLabels.sizes} />
        <FilterRow label={attributeLabels.color} />
        <FilterRow label={attributeLabels.sale} />
      </div>
    </nav>
  );
}
