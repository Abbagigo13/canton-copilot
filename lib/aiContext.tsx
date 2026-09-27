// lib/aiContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

type AIContextValue = {
  pageName: string;
  pageContext: unknown;
  setPageContext: (pageName: string, pageContext: unknown) => void;
};

const AIContext = createContext<AIContextValue | null>(null);

export function AIProvider({ children }: { children: ReactNode }) {
  const [pageName, setPageName] = useState<string>("Overview");
  const [pageContext, setPageContextState] = useState<unknown>(null);

  // useCallback keeps the function reference stable across renders
  // so useEffect(() => setPageContext(...), [setPageContext]) doesn't loop
  const setPageContext = useCallback((name: string, context: unknown) => {
    setPageName(name);
    setPageContextState(context);
  }, []);

  return (
    <AIContext.Provider value={{ pageName, pageContext, setPageContext }}>
      {children}
    </AIContext.Provider>
  );
}

export function useAIContext() {
  const ctx = useContext(AIContext);
  if (!ctx) {
    throw new Error("useAIContext must be used within an AIProvider");
  }
  return ctx;
}