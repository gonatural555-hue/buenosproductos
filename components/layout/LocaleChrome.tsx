"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import RegistrationCTA from "@/components/RegistrationCTA";
import AuthModal from "@/components/AuthModal";
import GoNaturalHomeNewsletterModal from "@/components/go-natural/GoNaturalHomeNewsletterModal";
import { useAuth } from "@/context/AuthContext";
import { HomeNewsletterModalProvider, useHomeNewsletterModal } from "@/context/HomeNewsletterModalContext";
import { GoNaturalHomeLayoutProvider } from "@/context/GoNaturalHomeLayoutContext";
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
  const { authOpen, setAuthOpen, initialTab } = useAuth();
  const showGnHeader =
    shouldShowGoNaturalHeader(pathname) && !suppressHeader && !authOpen;
  const showGnFooter = shouldShowGoNaturalFooter(pathname);

  return (
    <>
      <div className="relative">
        {showGnHeader ? <Header /> : null}
        <div>
          {children}
        </div>
      </div>
      <CookieConsent />
      {showGnFooter ? <Footer /> : null}
      <GoNaturalHomeNewsletterModal />
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        initialTab={initialTab}
      />
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
      <Suspense fallback={null}>
        <GoNaturalHomeLayoutProvider>
          <LocaleChromeInner>{children}</LocaleChromeInner>
        </GoNaturalHomeLayoutProvider>
      </Suspense>
    </HomeNewsletterModalProvider>
  );
}
