import { Fragment } from "react";
import HomeContainer from "@/components/good-ideas/home/HomeContainer";
import SectionTitle from "@/components/good-ideas/home/SectionTitle";
import {
  GoodIdeasWhyChooseIcon,
  type GoodIdeasWhyChooseItem,
} from "@/components/good-ideas/home/GoodIdeasHomeWhyChooseIcons";

type Props = {
  titleBefore: string;
  titleAccent: string;
  titleAfter: string;
  sectionAriaLabel: string;
  items: GoodIdeasWhyChooseItem[];
};

function WhyChooseCard({ item }: { item: GoodIdeasWhyChooseItem }) {
  return (
    <article className="flex min-w-0 flex-col gap-4 rounded-[20px] border border-white/[0.08] bg-[#151B24] p-6 sm:p-7 lg:rounded-[22px] lg:border-transparent lg:bg-transparent lg:p-0">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#3B82F6]/20 bg-[#3B82F6]/[0.08]">
        <GoodIdeasWhyChooseIcon id={item.id} className="h-6 w-6" />
      </span>
      <div className="min-w-0 space-y-2">
        <h3 className="font-body text-base font-semibold leading-snug text-[#E8ECF1] sm:text-lg">
          {item.title}
        </h3>
        <p className="font-body text-sm leading-relaxed text-[rgba(232,236,241,0.72)] sm:text-[15px]">
          {item.description}
        </p>
      </div>
    </article>
  );
}

export default function GoodIdeasHomeWhyChooseSection({
  titleBefore,
  titleAccent,
  titleAfter,
  sectionAriaLabel,
  items,
}: Props) {
  if (items.length === 0) return null;

  return (
    <section
      className="border-t border-white/[0.08] bg-[#0B0F14] py-16 md:py-20 lg:py-28"
      aria-label={sectionAriaLabel}
    >
      <HomeContainer innerClassName="max-w-[1320px]">
        <SectionTitle align="center" className="mx-auto max-w-3xl">
          {titleBefore}
          <span className="text-[#3B82F6]">{titleAccent}</span>
          {titleAfter}
        </SectionTitle>

        <div className="mt-12 space-y-4 sm:mt-14 lg:hidden">
          {items.map((item) => (
            <WhyChooseCard key={item.id} item={item} />
          ))}
        </div>

        <ul className="mt-14 hidden lg:flex lg:items-start lg:justify-between lg:gap-0">
          {items.map((item, index) => (
            <Fragment key={item.id}>
              <li className="min-w-0 flex-1 px-3 xl:px-5">
                <WhyChooseCard item={item} />
              </li>
              {index < items.length - 1 ? (
                <li
                  className="mx-1 mt-6 h-24 w-px shrink-0 bg-white/[0.08] xl:mx-2"
                  aria-hidden
                />
              ) : null}
            </Fragment>
          ))}
        </ul>
      </HomeContainer>
    </section>
  );
}
