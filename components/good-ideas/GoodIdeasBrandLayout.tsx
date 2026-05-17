"use client";

import { GoodIdeasCartProvider } from "@/context/GoodIdeasCartContext";
import GoodIdeasFooter from "@/components/good-ideas/GoodIdeasFooter";
import GoodIdeasHeader from "@/components/good-ideas/GoodIdeasHeader";

export default function GoodIdeasBrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoodIdeasCartProvider>
      <div className="flex min-h-[100dvh] flex-col bg-[#0B0F14] text-[#E8ECF1]">
        <GoodIdeasHeader />
        <div className="flex-1">{children}</div>
        <GoodIdeasFooter />
      </div>
    </GoodIdeasCartProvider>
  );
}
