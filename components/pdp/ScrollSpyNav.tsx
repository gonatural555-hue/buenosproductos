"use client";

import { useEffect, useMemo, useState } from "react";
import { useScrollSpy, type ScrollSpySection } from "@/hooks/useScrollSpy";
import { GI_PDP_INNER } from "@/lib/ui/gi-pdp-layout";

type Props = {
  sections: ScrollSpySection[];
};

function useMountedSections(sections: ScrollSpySection[]) {
  const [ready, setReady] = useState(sections);

  useEffect(() => {
    const resolve = () => {
      const found = sections.filter((s) =>
        Boolean(document.getElementById(s.id))
      );
      setReady(found.length > 0 ? found : sections.slice(0, 1));
    };

    resolve();
    const t1 = window.setTimeout(resolve, 400);
    const t2 = window.setTimeout(resolve, 1500);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [sections]);

  return ready;
}

function NavPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "shrink-0 rounded-full px-3.5 py-1.5 font-body text-sm font-medium transition-all duration-200",
        active
          ? "bg-[#3B82F6] text-white shadow-[0_4px_14px_rgba(59,130,246,0.35)]"
          : "text-[rgba(232,236,241,0.72)] hover:bg-white/[0.06] hover:text-[#E8ECF1]",
      ].join(" ")}
      aria-current={active ? "true" : undefined}
    >
      {label}
    </button>
  );
}

export default function ScrollSpyNav({ sections }: Props) {
  const visibleSections = useMountedSections(sections);
  const stableSections = useMemo(
    () => visibleSections,
    [visibleSections]
  );

  const { activeId, scrollToSection } = useScrollSpy({
    sections: stableSections,
  });

  if (stableSections.length < 2) return null;

  return (
    <>
      {/* Desktop: rail lateral */}
      <nav
        aria-label="Product sections"
        className="pointer-events-none fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
      >
        <ul className="pointer-events-auto flex flex-col gap-1 rounded-xl border border-white/[0.08] bg-[#0B0F14]/90 p-2 shadow-lg backdrop-blur-md">
          {stableSections.map((section) => {
            const active = activeId === section.id;
            return (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => scrollToSection(section.id)}
                  className={[
                    "w-full rounded-lg px-3 py-2 text-left font-body text-xs font-medium transition-all duration-200",
                    active
                      ? "bg-[#3B82F6]/15 text-[#60A5FA]"
                      : "text-[rgba(232,236,241,0.6)] hover:bg-white/[0.05] hover:text-[#E8ECF1]",
                  ].join(" ")}
                  aria-current={active ? "true" : undefined}
                >
                  {section.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile + tablet: barra horizontal sticky */}
      <div
        className={[
          "sticky z-40 border-b border-white/[0.08] bg-[#0B0F14]/95 backdrop-blur-md",
          "top-[calc(env(safe-area-inset-top,0px)+4.75rem)] lg:hidden",
        ].join(" ")}
      >
        <div
          className={`${GI_PDP_INNER} flex gap-2 overflow-x-auto py-2.5 scrollbar-thin`}
        >
          {stableSections.map((section) => (
            <NavPill
              key={section.id}
              label={section.label}
              active={activeId === section.id}
              onClick={() => scrollToSection(section.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
