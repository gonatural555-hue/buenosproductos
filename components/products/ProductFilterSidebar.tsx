import Link from "next/link";
import { plpPatagoniaClasses } from "@/lib/ui/plp-patagonia";
import type { CatalogVisualStyle } from "@/lib/plp-catalog-visual-style";

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
  visualStyle?: CatalogVisualStyle;
};

function FilterRowPatagonia({
  label,
  defaultOpen = false,
}: {
  label: string;
  defaultOpen?: boolean;
}) {
  return (
    <details
      className={`group border-t ${plpPatagoniaClasses.sidebarDivider} first:border-t-0`}
      open={defaultOpen}
    >
      <summary className={plpPatagoniaClasses.filterSummary}>
        <span className={`${plpPatagoniaClasses.filterChevron} transition-transform group-open:rotate-180`} aria-hidden>
          ▾
        </span>
        <span>{label}</span>
      </summary>
    </details>
  );
}

function FilterRowDefault({
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
  visualStyle = "default",
}: ProductFilterSidebarProps) {
  const isPatagonia = visualStyle === "patagonia";

  if (isPatagonia) {
    return (
      <nav aria-label={title} className={`font-inter ${className}`}>
        <FilterRowPatagonia label={attributeLabels.brands} />
        <FilterRowPatagonia label={attributeLabels.price} />
        <FilterRowPatagonia label={attributeLabels.sizes} />
        <FilterRowPatagonia label={attributeLabels.color} />
        <FilterRowPatagonia label={attributeLabels.sale} />

        <details
          className={`group border-t ${plpPatagoniaClasses.sidebarDivider}`}
          open
        >
          <summary className={plpPatagoniaClasses.filterSummary}>
            <span className={`${plpPatagoniaClasses.filterChevron} transition-transform group-open:rotate-180`} aria-hidden>
              ▾
            </span>
            <span>Category</span>
          </summary>
          <ul className="space-y-0 pb-2 pl-5">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={cat.href}
                  className={
                    activeCategorySlug === cat.slug
                      ? "block py-1.5 text-sm font-semibold text-black"
                      : "block py-1.5 text-sm text-black/80 hover:text-black"
                  }
                >
                  {cat.label}
                </Link>
                {cat.children?.length ? (
                  <ul className="mb-2 ml-2 space-y-0 border-l border-[#E5E5E5] pl-3">
                    {cat.children.map((child) => (
                      <li key={child.slug}>
                        <Link
                          href={child.href}
                          className={
                            activeCategorySlug === child.slug
                              ? "block py-1 text-sm font-semibold text-black"
                              : "block py-1 text-sm text-black/70 hover:text-black"
                          }
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </details>
      </nav>
    );
  }

  return (
    <nav aria-label={title} className={`font-inter ${className}`}>
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
        <FilterRowDefault label={attributeLabels.brands} />
        <FilterRowDefault label={attributeLabels.price} />
        <FilterRowDefault label={attributeLabels.sizes} />
        <FilterRowDefault label={attributeLabels.color} />
        <FilterRowDefault label={attributeLabels.sale} />
      </div>
    </nav>
  );
}
