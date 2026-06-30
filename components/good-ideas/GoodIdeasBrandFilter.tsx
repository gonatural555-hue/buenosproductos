import Link from "next/link";
import type { GoodIdeasFilterBrandOption } from "@/lib/good-ideas-plp-brands";
import { giPlpClasses } from "@/lib/ui/good-ideas-plp";

type Props = {
  label: string;
  brands: GoodIdeasFilterBrandOption[];
  activeBrandSlug?: string | null;
};

export default function GoodIdeasBrandFilter({
  label,
  brands,
  activeBrandSlug,
}: Props) {
  if (brands.length === 0) return null;

  const isActive = Boolean(activeBrandSlug);

  return (
    <details
      className={`group border-t ${giPlpClasses.sidebarDivider} first:border-t-0`}
      open={isActive}
    >
      <summary className={giPlpClasses.filterSummary}>
        <span
          className={`${giPlpClasses.filterChevron} transition-transform group-open:rotate-180`}
          aria-hidden
        >
          ▾
        </span>
        <span>{label}</span>
      </summary>
      <div className="pb-3 pl-5">
        <ul className="space-y-0">
          {brands.map((brand) => {
            const active = activeBrandSlug === brand.slug;
            return (
              <li key={brand.slug}>
                <Link
                  href={brand.href}
                  className={
                    active
                      ? giPlpClasses.categoryLinkActive
                      : giPlpClasses.categoryLink
                  }
                >
                  {brand.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </details>
  );
}
