import type { GoodIdeasProductManual } from "@/lib/good-ideas-product-manual";
import type { UISurface } from "@/lib/ui-surface";
import { GI_PDP_INNER } from "@/lib/ui/gi-pdp-layout";

type Props = {
  manual: GoodIdeasProductManual;
  title: string;
  description: string;
  downloadLabel: string;
  openLabel: string;
  surface?: UISurface;
};

export default function PdpGoodIdeasProductManual({
  manual,
  title,
  description,
  downloadLabel,
  openLabel,
  surface = "dark",
}: Props) {
  const L = surface === "light";

  const shell = L
    ? "border border-neutral-200/90 bg-white/80"
    : "border border-white/[0.08] bg-[#151B24]";

  const heading = L ? "text-neutral-900" : "text-[#E8ECF1]";
  const body = L ? "text-neutral-600" : "text-[rgba(232,236,241,0.65)]";
  const btnPrimary = L
    ? "border border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800"
    : "border border-[#3B82F6] bg-[#3B82F6] text-white hover:bg-[#2563EB]";
  const btnSecondary = L
    ? "border border-neutral-300 text-neutral-800 hover:bg-neutral-50"
    : "border border-white/[0.14] text-[#E8ECF1] hover:border-[#3B82F6]/40 hover:text-[#3B82F6]";

  return (
    <section className="py-16 md:py-20" aria-labelledby="gi-pdp-manual-heading">
      <div className={GI_PDP_INNER}>
        <div className={`overflow-hidden rounded-2xl ${shell}`}>
          <div
            className={`space-y-2 border-b px-5 py-5 sm:px-6 sm:py-6 ${
              L ? "border-neutral-200/90" : "border-white/[0.06]"
            }`}
          >
            <h2
              id="gi-pdp-manual-heading"
              className={`font-display text-xl font-semibold tracking-[-0.02em] sm:text-2xl ${heading}`}
            >
              {title}
            </h2>
            <p className={`font-inter text-sm leading-relaxed sm:text-[15px] ${body}`}>
              {description}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={manual.url}
                download={manual.filename}
                className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 font-inter text-[12px] font-semibold uppercase tracking-[0.12em] transition ${btnPrimary}`}
              >
                {downloadLabel}
              </a>
              <a
                href={manual.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 font-inter text-[12px] font-semibold uppercase tracking-[0.12em] transition ${btnSecondary}`}
              >
                {openLabel}
              </a>
            </div>
          </div>
          <div className="bg-[#0B0F14] p-3 sm:p-4">
            <iframe
              title={title}
              src={`${manual.url}#view=FitH`}
              className="h-[min(72vh,42rem)] w-full rounded-xl border border-white/[0.06] bg-white"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
