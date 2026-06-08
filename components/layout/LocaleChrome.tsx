"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import RegistrationCTA from "@/components/RegistrationCTA";
import GoNaturalHomeNewsletterModal from "@/components/go-natural/GoNaturalHomeNewsletterModal";
import { HomeNewsletterModalProvider, useHomeNewsletterModal } from "@/context/HomeNewsletterModalContext";
import {
  shouldShowGoNaturalFooter,
  shouldShowGoNaturalHeader,
} from "@/lib/routing/brands";

function LocaleChromeInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const { suppressHeader } = useHomeNewsletterModal();
  const showGnHeader = shouldShowGoNaturalHeader(pathname) && !suppressHeader;
  const showGnFooter = shouldShowGoNaturalFooter(pathname);

  return (
    <>
      {showGnHeader ? <Header /> : null}
      {children}
      <CookieConsent />
      {showGnFooter ? <Footer /> : null}
      <GoNaturalHomeNewsletterModal />
      <RegistrationCTA />
    </>
  );
}

export default function LocaleChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HomeNewsletterModalProvider>
      <LocaleChromeInner>{children}</LocaleChromeInner>
    </HomeNewsletterModalProvider>
  );
}
