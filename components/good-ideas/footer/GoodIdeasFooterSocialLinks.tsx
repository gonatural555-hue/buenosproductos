"use client";

import {
  FACEBOOK_URL,
  INSTAGRAM_URL,
  TIKTOK_URL,
} from "@/lib/social-links";

type Props = {
  variant?: "dark" | "light";
  facebookAria: string;
  instagramAria: string;
  tiktokAria: string;
};

type SocialNetwork = {
  id: string;
  href: string;
  label: string;
  icon: React.ReactNode;
};

export default function GoodIdeasFooterSocialLinks({
  variant = "dark",
  facebookAria,
  instagramAria,
  tiktokAria,
}: Props) {
  const networks: SocialNetwork[] = [
    {
      id: "facebook",
      href: FACEBOOK_URL,
      label: facebookAria,
      icon: (
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      ),
    },
    {
      id: "instagram",
      href: INSTAGRAM_URL,
      label: instagramAria,
      icon: (
        <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3zm10.5 1.5a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z" />
      ),
    },
    {
      id: "tiktok",
      href: TIKTOK_URL,
      label: tiktokAria,
      icon: (
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
      ),
    },
  ];

  const buttonClass =
    variant === "light"
      ? "inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E5E5] bg-[#FAFAFA] text-[#111111] transition duration-160 hover:border-[rgba(59,130,246,0.35)] hover:bg-[rgba(59,130,246,0.08)] hover:text-[#3B82F6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/40"
      : "inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-[rgba(232,236,241,0.72)] transition duration-160 hover:border-[rgba(59,130,246,0.35)] hover:bg-[rgba(59,130,246,0.14)] hover:text-[#3B82F6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/40";

  const disabledClass =
    variant === "light"
      ? "cursor-default opacity-45"
      : "cursor-default opacity-40";

  return (
    <div className="mt-5 flex flex-wrap gap-2.5">
      {networks.map((network) => {
        const icon = (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            {network.icon}
          </svg>
        );

        if (network.href) {
          return (
            <a
              key={network.id}
              href={network.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={network.label}
              className={buttonClass}
            >
              {icon}
            </a>
          );
        }

        return (
          <span
            key={network.id}
            aria-label={network.label}
            className={`${buttonClass} ${disabledClass}`}
          >
            {icon}
          </span>
        );
      })}
    </div>
  );
}
