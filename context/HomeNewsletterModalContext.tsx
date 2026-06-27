"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type HomeNewsletterModalContextValue = {
  suppressHeader: boolean;
  setSuppressHeader: (value: boolean) => void;
  /** Incrementa en cada solicitud explícita de apertura (p. ej. CTA comunidad). */
  openSignal: number;
  openModal: () => void;
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
  const [openSignal, setOpenSignal] = useState(0);

  const openModal = useCallback(() => {
    setOpenSignal((n) => n + 1);
  }, []);

  const value = useMemo(
    () => ({ suppressHeader, setSuppressHeader, openSignal, openModal }),
    [suppressHeader, openSignal, openModal]
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
