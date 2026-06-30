"use client";

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AccordionGroupContextValue = {
  openId: string | null;
  toggle: (id: string) => void;
};

const AccordionGroupContext = createContext<AccordionGroupContextValue | null>(
  null
);

export function PdpAccordionGroup({
  children,
  defaultOpenId = null,
}: {
  children: ReactNode;
  defaultOpenId?: string | null;
}) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId);

  const toggle = useCallback((id: string) => {
    setOpenId((current) => (current === id ? null : id));
  }, []);

  const value = useMemo(() => ({ openId, toggle }), [openId, toggle]);

  return (
    <AccordionGroupContext.Provider value={value}>
      <div className="border-t border-white/[0.1]">{children}</div>
    </AccordionGroupContext.Provider>
  );
}

export function usePdpAccordionGroup() {
  const ctx = useContext(AccordionGroupContext);
  if (!ctx) {
    throw new Error("usePdpAccordionGroup must be used within PdpAccordionGroup");
  }
  return ctx;
}

export function PdpPremiumAccordion({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  const { openId, toggle } = usePdpAccordionGroup();
  const reactId = useId();
  const panelId = `pdp-accordion-panel-${id}-${reactId}`;
  const triggerId = `pdp-accordion-trigger-${id}-${reactId}`;
  const isOpen = openId === id;

  return (
    <div className="border-b border-white/[0.1]">
      <h3>
        <button
          type="button"
          id={triggerId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => toggle(id)}
          className="flex w-full items-center justify-between gap-4 py-5 text-left outline-none transition-colors hover:text-[#E8ECF1] focus-visible:ring-2 focus-visible:ring-[#3B82F6]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F14] sm:py-6"
        >
          <span className="font-body text-base font-semibold tracking-[var(--gi-tracking-tight)] text-[#E8ECF1] sm:text-[17px]">
            {title}
          </span>
          <span
            aria-hidden
            className={`flex h-7 w-7 shrink-0 items-center justify-center text-xl font-light leading-none text-[rgba(232,236,241,0.7)] transition-transform duration-200 ease-out motion-reduce:transition-none ${
              isOpen ? "rotate-45" : "rotate-0"
            }`}
          >
            +
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden" aria-hidden={!isOpen}>
          <div className="pdp-accordion-scroll max-h-[500px] overflow-y-auto pb-6 pt-1 sm:pb-7">
            {isOpen ? children : null}
          </div>
        </div>
      </div>
    </div>
  );
}
