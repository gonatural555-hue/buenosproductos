"use client";

import Link from "next/link";
import { useId, useState } from "react";

type LinkItem = {
  href: string;
  label: string;
  highlight?: boolean;
};

type Props = {
  title: string;
  links: LinkItem[];
  variant?: "dark" | "light";
  defaultOpen?: boolean;
};

export default function GoodIdeasFooterAccordion({
  title,
  links,
  variant = "dark",
  defaultOpen = false,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const isLight = variant === "light";

  const buttonClass = isLight
    ? "flex w-full items-center justify-between gap-3 border-b border-[#E5E5E5] py-4 text-left font-body text-sm font-bold text-[#111111]"
    : "flex w-full items-center justify-between gap-3 border-b border-white/[0.08] py-4 text-left font-body text-sm font-bold text-[#E8ECF1]";

  const linkClass = isLight
    ? "font-body text-[13px] leading-relaxed text-[#737373] transition-colors duration-160 hover:text-[#3B82F6] sm:text-sm"
    : "font-body text-[13px] leading-relaxed text-[rgba(232,236,241,0.55)] transition-colors duration-160 hover:text-[#60A5FA] sm:text-sm";

  const highlightLinkClass = isLight
    ? "font-body text-[13px] font-semibold leading-relaxed text-[#2563EB] transition-colors duration-160 hover:text-[#3B82F6] sm:text-sm"
    : "font-body text-[13px] font-semibold leading-relaxed text-[#93C5FD] transition-colors duration-160 hover:text-[#60A5FA] sm:text-sm";

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className={buttonClass}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{title}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-5 w-5 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          } ${isLight ? "text-[#9CA3AF]" : "text-[rgba(232,236,241,0.55)]"}`}
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.25a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div
        id={panelId}
        hidden={!open}
        className="overflow-hidden pb-4 pt-1"
      >
        <ul className="space-y-2.5">
          {links.map((link) => (
            <li key={`${link.href}-${link.label}`}>
              <Link
                href={link.href}
                className={link.highlight ? highlightLinkClass : linkClass}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
