"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";
import { SignInModal } from "@/components/form/SignInModal";
import { WayfarerLogo } from "@/components/WayfarerLogo";
import { useSearch } from "@/components/search/SearchContext";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const { open: openSearch } = useSearch();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-200/60">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          {/* Logo — real Wayfarer wordmark + globemark, inlined to inherit color */}
          <Link
            href="/"
            aria-label="Wayfarer home"
            className="flex items-center text-text-wordmark"
          >
            <WayfarerLogo className="h-7 w-auto" />
          </Link>

          {/* Desktop Nav — Destinations / Discover / Plan share the same treatment
              as Search and Sign in on the right cluster (one shared class, five
              equal-weight text items) per DS simplify-first defaults. 15px is
              on-scale from the DS type ramp; text-sm (14) is off-scale drift. */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/destinations"
              className="text-[0.9375rem] font-medium text-neutral-600 hover:text-link-strong transition-colors"
            >
              Destinations
            </Link>
            <Link
              href="/discover"
              className="text-[0.9375rem] font-medium text-neutral-600 hover:text-link-strong transition-colors"
            >
              Discover
            </Link>
            <Link
              href="/planner"
              className="text-[0.9375rem] font-medium text-neutral-600 hover:text-link-strong transition-colors"
            >
              Plan
            </Link>
          </div>

          {/* Right side — Search + Sign in as nav-link peers (no border,
              no placeholder, no kbd, no title tooltip). Matches barreiro +
              MSR restraint: search reads as a fifth nav item, not a widget. */}
          <div className="flex items-center gap-8">
            <button
              type="button"
              onClick={openSearch}
              aria-label="Search destinations"
              className="hidden md:inline-flex items-center gap-2 text-[0.9375rem] font-medium text-neutral-600 hover:text-link-strong transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>

            <button
              onClick={() => setSignInOpen(true)}
              className="hidden md:inline-flex text-[0.9375rem] font-medium text-neutral-600 hover:text-link-strong transition-colors"
            >
              Sign in
            </button>

            <button
              type="button"
              onClick={openSearch}
              aria-label="Search"
              className="md:hidden p-2 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <Search className="w-5 h-5 text-neutral-600" />
            </button>

            <button
              aria-label="Menu"
              className="md:hidden p-2 rounded-full hover:bg-neutral-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-neutral-600" />
              ) : (
                <Menu className="w-5 h-5 text-neutral-600" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Nav — all items share the same treatment; no bordered pill
            pair, no primary-fill CTA in the drawer. */}
        {mobileOpen && (
          <div className="md:hidden border-t border-neutral-200 bg-white px-6 py-4 space-y-3">
            <Link
              href="/destinations"
              className="block text-[0.9375rem] font-medium text-neutral-700"
              onClick={() => setMobileOpen(false)}
            >
              Destinations
            </Link>
            <Link
              href="/discover"
              className="block text-[0.9375rem] font-medium text-neutral-700"
              onClick={() => setMobileOpen(false)}
            >
              Discover
            </Link>
            <Link
              href="/planner"
              className="block text-[0.9375rem] font-medium text-neutral-700"
              onClick={() => setMobileOpen(false)}
            >
              Plan
            </Link>
            <button
              onClick={() => {
                setSignInOpen(true);
                setMobileOpen(false);
              }}
              className="block text-left text-[0.9375rem] font-medium text-neutral-700"
            >
              Sign in
            </button>
          </div>
        )}
      </header>

      <SignInModal
        open={signInOpen}
        onClose={() => setSignInOpen(false)}
      />
    </>
  );
}
