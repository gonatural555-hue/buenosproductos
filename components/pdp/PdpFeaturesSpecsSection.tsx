import type { UISurface } from "@/lib/ui-surface";

import type { SpecRow } from "@/lib/pdp-spec-rows";
import { parseFeatureSpecRows } from "@/lib/pdp-spec-rows";

export type { SpecRow };
export { parseFeatureSpecRows };

type Props = {
  featuresTitle: string;
  specsTitle: string;
  features: string[];
  specRows: SpecRow[];
  surface?: UISurface;
};

export default function PdpFeaturesSpecsSection({
  featuresTitle,
  specsTitle,
  features,
  specRows,
  surface = "light",
}: Props) {
  const L = surface === "light";
  if (features.length === 0 && specRows.length === 0) return null;

  return (
    <section
      id="pdp-features"
      className={
        L
          ? "border-t border-neutral-200/90 bg-gn-page-bg py-14 md:py-20 lg:py-20"
          : "border-t border-white/[0.08] py-14 md:py-18 lg:py-20"
      }
      aria-labelledby="pdp-features-heading"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-10 lg:grid-cols-2 lg:gap-16 lg:px-16">
        {features.length > 0 ? (
          <div>
            <h2
              id="pdp-features-heading"
              className={
                L
                  ? "font-display text-2xl font-semibold tracking-tight text-neutral-900 md:text-[1.75rem]"
                  : "font-display text-2xl font-semibold tracking-tight text-text-primary md:text-[1.75rem]"
              }
            >
              {featuresTitle}
            </h2>
            <ul className="mt-6 space-y-3.5">
              {features.map((line) => (
                <li
                  key={line}
                  className={
                    L
                      ? "flex gap-3 text-[15px] leading-relaxed text-neutral-800"
                      : "flex gap-3 text-[15px] leading-relaxed text-text-primary/90"
                  }
                >
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gn-forest"
                    aria-hidden
                  />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div aria-hidden />
        )}

        {specRows.length > 0 ? (
          <div>
            <h2
              className={
                L
                  ? "font-display text-2xl font-semibold tracking-tight text-neutral-900 md:text-[1.75rem]"
                  : "font-display text-2xl font-semibold tracking-tight text-text-primary md:text-[1.75rem]"
              }
            >
              {specsTitle}
            </h2>
            <div
              className={
                L
                  ? "mt-6 overflow-hidden rounded-md border border-neutral-200"
                  : "mt-6 overflow-hidden rounded-md border border-white/12"
              }
            >
              <table className="w-full border-collapse text-left text-sm">
                <tbody>
                  {specRows.map((row, index) => (
                    <tr
                      key={`${row.label}-${index}`}
                      className={
                        index % 2 === 0
                          ? L
                            ? "bg-white"
                            : "bg-dark-surface/30"
                          : L
                            ? "bg-neutral-50"
                            : "bg-dark-surface/20"
                      }
                    >
                      <th
                        scope="row"
                        className={
                          L
                            ? "w-[42%] px-4 py-3 font-medium text-neutral-800"
                            : "w-[42%] px-4 py-3 font-medium text-text-primary"
                        }
                      >
                        {row.label}
                      </th>
                      <td
                        className={
                          L
                            ? "px-4 py-3 text-neutral-600"
                            : "px-4 py-3 text-text-muted"
                        }
                      >
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
