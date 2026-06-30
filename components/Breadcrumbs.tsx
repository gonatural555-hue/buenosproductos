import Link from "next/link";
import { giType } from "@/lib/ui/gi-typography";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

type Props = {
  items: BreadcrumbItem[];
  /** Miga de pan sutil sobre foto / hero oscuro (p. ej. catálogo). */
  variant?: "default" | "darkHero" | "gi" | "gi-dark";
  className?: string;
};

export default function Breadcrumbs({
  items,
  variant = "default",
  className,
}: Props) {
  const isDarkHero = variant === "darkHero";
  const isGi = variant === "gi";
  const isGiDark = variant === "gi-dark";

  if (isGi || isGiDark) {
    const linkClass = isGiDark
      ? "font-body text-xs font-normal text-[rgba(232,236,241,0.55)] transition-colors hover:text-[rgba(232,236,241,0.85)]"
      : giType.breadcrumbLink;
    const currentClass = isGiDark
      ? "font-body text-xs font-normal text-[rgba(232,236,241,0.55)]"
      : giType.breadcrumbCurrent;
    const sepClass = isGiDark
      ? "mx-2 text-[rgba(232,236,241,0.35)] select-none"
      : giType.breadcrumbSep;

    return (
      <nav
        aria-label="Breadcrumb"
        className={`mb-6 lg:mb-8 ${giType.breadcrumbNav} ${className ?? ""}`.trim()}
      >
        <ol className="flex flex-wrap items-center">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={index} className="flex items-center">
                {item.href && !isLast ? (
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                ) : (
                  <span className={currentClass}>{item.label}</span>
                )}
                {!isLast ? (
                  <span className={sepClass} aria-hidden>
                    /
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol
        className={
          isDarkHero
            ? "flex flex-wrap items-center gap-2 text-sm text-white/50"
            : "flex flex-wrap items-center gap-2 text-sm text-white"
        }
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={
                    isDarkHero
                      ? "transition-colors duration-200 hover:text-white/80"
                      : "hover:text-white/80 transition-colors duration-200"
                  }
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    isDarkHero
                      ? isLast
                        ? "font-medium text-white"
                        : "text-white/50"
                      : isLast
                        ? "text-white font-medium"
                        : "text-white"
                  }
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span
                  className={
                    isDarkHero
                      ? "mx-2 text-white/35"
                      : "mx-2 text-white/70"
                  }
                  aria-hidden="true"
                >
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
