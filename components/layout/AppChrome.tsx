"use client";

import GoodIdeasBrandLayout from "@/components/good-ideas/GoodIdeasBrandLayout";
import CookieConsent from "@/components/CookieConsent";
import RegistrationCTA from "@/components/RegistrationCTA";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/context/AuthContext";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const { authOpen, setAuthOpen, initialTab } = useAuth();

  return (
    <>
      <GoodIdeasBrandLayout>{children}</GoodIdeasBrandLayout>
      <CookieConsent />
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        initialTab={initialTab}
      />
      <RegistrationCTA />
    </>
  );
}
