import GoodIdeasHomeCategoryTile from "@/components/good-ideas/home/GoodIdeasHomeCategoryTile";
import { SecondaryButton } from "@/components/good-ideas/home";
import HomeContainer from "@/components/good-ideas/home/HomeContainer";
import SectionEyebrow from "@/components/good-ideas/home/SectionEyebrow";
import SectionTitle from "@/components/good-ideas/home/SectionTitle";
import type {
  GoodIdeasHomeCategorySlug,
  GoodIdeasHomeCategoryTileData,
} from "@/lib/good-ideas-home-categories";
import type { Locale } from "@/lib/i18n/config";
import { productsPath } from "@/lib/routing/paths";
import { GI_CATALOG_SECTION_ID } from "@/lib/ui/goodideas-design";

type TileCopy = {
  title: string;
  description: string;
};

type Props = {
  locale: Locale;
  eyebrow: string;
  title: string;
  viewAllLabel: string;
  viewMoreLabel: string;
  sectionAriaLabel: string;
  tiles: GoodIdeasHomeCategoryTileData[];
  tileCopyBySlug: Record<GoodIdeasHomeCategorySlug, TileCopy>;
};

export default function GoodIdeasHomeCategoriesSection({
  locale,
  eyebrow,
  title,
  viewAllLabel,
  viewMoreLabel,
  sectionAriaLabel,
  tiles,
  tileCopyBySlug,
}: Props) {
  if (tiles.length === 0) return null;

  const viewAllHref = `${productsPath(locale)}#${GI_CATALOG_SECTION_ID}`;

  return (
    <section
      className="border-t border-white/[0.08] bg-[#0B0F14] py-16 md:py-20 lg:py-24"
      aria-label={sectionAriaLabel}
    >
      <HomeContainer innerClassName="max-w-[1320px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="max-w-2xl">
            <SectionEyebrow>{eyebrow}</SectionEyebrow>
            <SectionTitle className="mt-3">{title}</SectionTitle>
          </div>
          <SecondaryButton
            href={viewAllHref}
            className="w-full shrink-0 sm:w-auto lg:mb-1"
          >
            {viewAllLabel}
          </SecondaryButton>
        </div>

        <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:mt-12 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:pb-0 lg:grid-cols-3 xl:grid-cols-5 xl:gap-5 [&::-webkit-scrollbar]:hidden">
          {tiles.map((tile) => {
            const copy = tileCopyBySlug[tile.slug];
            return (
              <div
                key={tile.slug}
                className="w-[min(82vw,320px)] shrink-0 snap-start sm:w-auto sm:shrink"
              >
                <GoodIdeasHomeCategoryTile
                  {...tile}
                  title={copy.title}
                  description={copy.description}
                  viewMoreLabel={viewMoreLabel}
                />
              </div>
            );
          })}
        </div>
      </HomeContainer>
    </section>
  );
}
