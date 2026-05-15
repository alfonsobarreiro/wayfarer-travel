"use client";

/**
 * SearchContext
 * ─────────────────────────────────────────────────────────────────────────
 * Global search overlay state. Any component can call `useSearch().open()`
 * to surface the command-K palette. Wraps the whole app in `layout.tsx`.
 */

import { createContext, useCallback, useContext, useEffect, useState } from "react";

interface SearchContextValue {
  isOpen:   boolean;
  open:     () => void;
  close:    () => void;
  toggle:   () => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open   = useCallback(() => setIsOpen(true),  []);
  const close  = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  // Global ⌘K / Ctrl+K shortcut
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
      if (e.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <SearchContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    // Fail-soft: if a component renders outside the provider (e.g. in tests),
    // return no-op handlers rather than throwing.
    return { isOpen: false, open: () => {}, close: () => {}, toggle: () => {} };
  }
  return ctx;
}
