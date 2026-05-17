export type GoodIdeasComingSoonBlockProps = {
  title: string;
  body: string;
  id?: string;
};

export default function GoodIdeasComingSoonBlock({
  title,
  body,
  id,
}: GoodIdeasComingSoonBlockProps) {
  return (
    <section
      id={id}
      className="scroll-mt-24 border-t border-white/[0.08] bg-[#0B0F14] px-6 py-20 sm:px-10 md:py-28"
    >
      <div className="mx-auto max-w-xl text-center">
        <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3B82F6]">
          {title}
        </p>
        <p className="mt-4 font-inter text-[16px] leading-relaxed text-[rgba(232,236,241,0.72)] md:text-[17px]">
          {body}
        </p>
      </div>
    </section>
  );
}
