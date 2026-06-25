"use client";

import { createContext, useContext, useState, useCallback } from "react";

type AuthContextValue = {
  authOpen: boolean;
  setAuthOpen: (open: boolean) => void;
  openAuthModal: (tab?: "login" | "register") => void;
  initialTab: "login" | "register";
  setInitialTab: (tab: "login" | "register") => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authOpen, setAuthOpen] = useState(false);
  const [initialTab, setInitialTab] = useState<"login" | "register">("login");

  const openAuthModal = useCallback((tab: "login" | "register" = "login") => {
    setInitialTab(tab);
    setAuthOpen(true);
    if (
      typeof document !== "undefined" &&
      document.activeElement instanceof HTMLElement
    ) {
      document.activeElement.blur();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authOpen,
        setAuthOpen,
        openAuthModal,
        initialTab,
        setInitialTab,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
