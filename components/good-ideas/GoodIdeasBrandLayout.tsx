"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { GoodIdeasCartProvider } from "@/context/GoodIdeasCartContext";
import GoodIdeasFooter from "@/components/good-ideas/GoodIdeasFooter";
import GoodIdeasHeader from "@/components/good-ideas/GoodIdeasHeader";
import {
  shouldHideGiHeader,
  shouldUseLightCommerceFooter,
  shouldUseLightOrderSuccessChrome,
  shouldUseLightPdpChrome,
} from "@/lib/routing/paths";

function GoodIdeasHeaderFallback() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#E5E7EB] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-[64px] max-w-[1400px] items-center px-4 sm:px-6 md:h-[72px]" />
    </header>
  );
}

export default function GoodIdeasBrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const hideHeader = shouldHideGiHeader(pathname);
  const lightFooter = shouldUseLightCommerceFooter(pathname);
  const lightPdp = shouldUseLightPdpChrome(pathname);
  const lightOrderSuccess = shouldUseLightOrderSuccessChrome(pathname);
  const lightShell = lightFooter || lightPdp || lightOrderSuccess;

  return (
    <GoodIdeasCartProvider>
      <div
        className={`flex min-h-[100dvh] flex-col ${
          lightShell ? "bg-white text-[#111111]" : "bg-[#0B0F14] text-[#E8ECF1]"
        }`}
      >
        {!hideHeader ? (
          <Suspense fallback={<GoodIdeasHeaderFallback />}>
            <GoodIdeasHeader />
          </Suspense>
        ) : null}
        <div className="flex-1">{children}</div>
        <GoodIdeasFooter variant={lightFooter ? "light" : "dark"} />
      </div>
    </GoodIdeasCartProvider>
  );
}
