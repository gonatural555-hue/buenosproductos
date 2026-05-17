"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import RegistrationCTA from "@/components/RegistrationCTA";
import {
  shouldShowGoNaturalFooter,
  shouldShowGoNaturalHeader,
} from "@/lib/routing/brands";

export default function LocaleChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const showGnHeader = shouldShowGoNaturalHeader(pathname);
  const showGnFooter = shouldShowGoNaturalFooter(pathname);

  return (
    <>
      {showGnHeader ? <Header /> : null}
      {children}
      <CookieConsent />
      {showGnFooter ? <Footer /> : null}
      <RegistrationCTA />
    </>
  );
}
