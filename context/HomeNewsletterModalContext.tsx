"use client";

import { createContext, useContext, useMemo, useState } from "react";

type HomeNewsletterModalContextValue = {
  suppressHeader: boolean;
  setSuppressHeader: (value: boolean) => void;
};

const HomeNewsletterModalContext = createContext<
  HomeNewsletterModalContextValue | undefined
>(undefined);

export function HomeNewsletterModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [suppressHeader, setSuppressHeader] = useState(false);

  const value = useMemo(
    () => ({ suppressHeader, setSuppressHeader }),
    [suppressHeader]
  );

  return (
    <HomeNewsletterModalContext.Provider value={value}>
      {children}
    </HomeNewsletterModalContext.Provider>
  );
}

export function useHomeNewsletterModal() {
  const context = useContext(HomeNewsletterModalContext);
  if (!context) {
    throw new Error(
      "useHomeNewsletterModal must be used within HomeNewsletterModalProvider"
    );
  }
  return context;
}
