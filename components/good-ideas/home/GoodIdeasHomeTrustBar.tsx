import { Fragment } from "react";
import {
  GoodIdeasTrustBarIcon,
  type GoodIdeasTrustBarItem,
} from "@/components/good-ideas/home/GoodIdeasTrustBarIcons";

type Props = {
  items: GoodIdeasTrustBarItem[];
  ariaLabel: string;
};

function TrustBarCell({ item }: { item: GoodIdeasTrustBarItem }) {
  return (
    <div className="flex min-w-0 items-start gap-3 sm:gap-3.5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#3B82F6]/20 bg-[#3B82F6]/[0.08]">
        <GoodIdeasTrustBarIcon id={item.id} className="h-[22px] w-[22px]" />
      </span>
      <div className="min-w-0 pt-0.5">
        <p className="font-body text-sm font-semibold leading-snug text-[#E8ECF1] sm:text-[15px]">
          {item.title}
        </p>
        <p className="mt-0.5 font-body text-xs leading-relaxed text-[rgba(232,236,241,0.55)] sm:text-[13px]">
          {item.description}
        </p>
      </div>
    </div>
  );
}

export default function GoodIdeasHomeTrustBar({ items, ariaLabel }: Props) {
  if (items.length === 0) return null;

  return (
    <section
      className="border-y border-white/[0.08] bg-[linear-gradient(180deg,#151B24_0%,#121820_50%,#0B0F14_100%)]"
      aria-label={ariaLabel}
    >
      <div className="mx-auto max-w-[1320px] px-4 py-[22px] sm:px-6 sm:py-7 md:py-8 lg:px-10">
        <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-7 lg:hidden">
          {items.map((item) => (
            <li key={item.id} className="min-w-0">
              <TrustBarCell item={item} />
            </li>
          ))}
        </ul>

        <ul className="hidden lg:flex lg:items-center lg:justify-between lg:gap-0">
          {items.map((item, index) => (
            <Fragment key={item.id}>
              <li className="min-w-0 flex-1 px-2 xl:px-4">
                <TrustBarCell item={item} />
              </li>
              {index < items.length - 1 ? (
                <li
                  className="mx-1 h-12 w-px shrink-0 bg-white/[0.12] xl:mx-2"
                  aria-hidden
                />
              ) : null}
            </Fragment>
          ))}
        </ul>
      </div>
    </section>
  );
}
