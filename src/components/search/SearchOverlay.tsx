"use client";

/**
 * SearchOverlay
 * ─────────────────────────────────────────────────────────────────────────
 * Command-K palette. Live-filters across name / country / continent / tagline
 * / categories / highlights. Enter on the focused result navigates.
 *
 * Mounted once in layout.tsx, controlled by SearchContext.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search as SearchIcon, MapPin, X } from "lucide-react";
import { DestinationImage } from "@/components/DestinationImage";
import { allDestinations as destinations } from "@/data/destinations";
import { useSearch } from "./SearchContext";

const MAX_RESULTS = 12;

function score(haystack: string, needle: string): number {
  if (!needle) return 0;
  const h = haystack.toLowerCase();
  const n = needle.toLowerCase();
  if (h === n) return 100;
  if (h.startsWith(n)) return 60;
  if (h.includes(n)) return 30;
  return 0;
}

export function SearchOverlay() {
  const { isOpen, close } = useSearch();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIdx(0);
      // Focus after the animation kicks in
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  const results = useMemo(() => {
    if (!query.trim()) {
      // Empty state: show six featured destinations as suggestions
      return destinations.slice(0, 6).map((d) => ({ d, s: 0 }));
    }
    const ranked = destinations
      .map((d) => {
        const s = Math.max(
          score(d.name,      query) * 1.2,
          score(d.country,   query),
          score(d.continent, query) * 0.6,
          score(d.tagline,   query) * 0.5,
          ...d.categories.map((c) => score(c, query) * 0.4),
          ...d.highlights.map((h) => score(h, query) * 0.3),
        );
        return { d, s };
      })
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, MAX_RESULTS);
    return ranked;
  }, [query]);

  // Reset cursor when result list shrinks
  useEffect(() => {
    if (activeIdx >= results.length) setActiveIdx(0);
  }, [results, activeIdx]);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = results[activeIdx];
      if (r) {
        router.push(`/destinations/${r.d.slug}`);
        close();
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-start justify-center pt-[10vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Scrim */}
          <button
            type="button"
            aria-label="Close search"
            className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm"
            onClick={close}
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-label="Search destinations"
            className="relative z-10 w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden"
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0,  opacity: 1 }}
            exit={{    y: -8, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {/* Input row */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-200">
              <SearchIcon className="w-5 h-5 text-neutral-400 flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search destinations, regions, or interests"
                className="flex-1 bg-transparent outline-none text-base text-neutral-900 placeholder:text-neutral-400"
                aria-label="Search input"
              />
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded border border-neutral-200 text-[10px] font-mono text-neutral-500 bg-neutral-50">
                Esc
              </kbd>
              <button
                onClick={close}
                aria-label="Close"
                className="sm:hidden p-1 text-neutral-500 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {results.length === 0 ? (
                <div className="py-12 text-center text-sm text-neutral-500">
                  No destinations match &ldquo;{query}&rdquo;. Try a country, continent, or interest.
                </div>
              ) : (
                <>
                  {!query.trim() && (
                    <p className="px-5 pt-4 pb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                      Suggested
                    </p>
                  )}
                  <ul className="py-2">
                    {results.map((r, i) => {
                      const active = i === activeIdx;
                      return (
                        <li key={r.d.slug}>
                          <Link
                            href={`/destinations/${r.d.slug}`}
                            onClick={close}
                            onMouseEnter={() => setActiveIdx(i)}
                            className={`flex items-center gap-4 px-5 py-3 transition-colors ${
                              active ? "bg-brand-50" : "hover:bg-neutral-50"
                            }`}
                          >
                            <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                              <DestinationImage
                                src={r.d.image}
                                fallbackSrc={r.d.gallery[0]}
                                alt={r.d.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-neutral-900 truncate">
                                {r.d.name}
                              </p>
                              <p className="text-xs text-neutral-500 truncate flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {r.d.country} &middot; {r.d.continent}
                              </p>
                            </div>
                            <span className="hidden sm:inline text-[10px] font-medium uppercase tracking-wider text-neutral-400">
                              {r.d.categories[0]}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </div>

            {/* Footer hint */}
            <div className="hidden sm:flex items-center justify-between px-5 py-3 border-t border-neutral-200 bg-neutral-50 text-[11px] text-neutral-500">
              <div className="flex items-center gap-3">
                <span>
                  <kbd className="px-1.5 py-0.5 rounded border border-neutral-300 font-mono">&uarr;&darr;</kbd>{" "}
                  navigate
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 rounded border border-neutral-300 font-mono">&crarr;</kbd>{" "}
                  open
                </span>
              </div>
              <span>
                {destinations.length} destinations &middot;{" "}
                <kbd className="px-1.5 py-0.5 rounded border border-neutral-300 font-mono">&#8984;K</kbd>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
