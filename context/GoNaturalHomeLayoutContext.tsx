"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import GoNaturalHomeLayoutDirectorPanel from "@/components/go-natural/GoNaturalHomeLayoutDirectorPanel";
import { isGoNaturalHomePath } from "@/lib/routing/brands";
import {
  DEFAULT_GO_NATURAL_HOME_LAYOUT,
  elementOffsetTransform,
  isGoNaturalHomeLayoutDirectorMode,
  loadGoNaturalHomeLayout,
  type GoNaturalHomeLayout,
  type GoNaturalHomeLayoutElementId,
} from "@/lib/go-natural-home-layout";

type GoNaturalHomeLayoutContextValue = {
  isDirector: boolean;
  isHomeGn: boolean;
  layout: GoNaturalHomeLayout;
  offsetStyle: (id: GoNaturalHomeLayoutElementId) => CSSProperties | undefined;
};

const GoNaturalHomeLayoutContext =
  createContext<GoNaturalHomeLayoutContextValue | null>(null);

export function GoNaturalHomeLayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();
  const isHomeGn = isGoNaturalHomePath(pathname);
  const isDirector =
    isHomeGn && isGoNaturalHomeLayoutDirectorMode(searchParams);

  const [layout, setLayout] = useState<GoNaturalHomeLayout>(
    () => DEFAULT_GO_NATURAL_HOME_LAYOUT
  );

  useEffect(() => {
    setLayout(loadGoNaturalHomeLayout());
  }, []);

  const offsetStyle = useCallback(
    (id: GoNaturalHomeLayoutElementId): CSSProperties | undefined => {
      if (id === "hero" && !isHomeGn) return undefined;
      return elementOffsetTransform(layout[id]);
    },
    [isHomeGn, layout]
  );

  const value = useMemo(
    () => ({
      isDirector,
      isHomeGn,
      layout,
      offsetStyle,
    }),
    [isDirector, isHomeGn, layout, offsetStyle]
  );

  return (
    <GoNaturalHomeLayoutContext.Provider value={value}>
      {children}
      {isDirector ? (
        <GoNaturalHomeLayoutDirectorPanel
          layout={layout}
          onChange={setLayout}
        />
      ) : null}
    </GoNaturalHomeLayoutContext.Provider>
  );
}

export function useGoNaturalHomeLayout() {
  const ctx = useContext(GoNaturalHomeLayoutContext);
  if (!ctx) {
    return {
      isDirector: false,
      isHomeGn: false,
      layout: DEFAULT_GO_NATURAL_HOME_LAYOUT,
      offsetStyle: () => undefined,
    };
  }
  return ctx;
}
