"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";
import { SignUpModal } from "@/components/form/SignUpModal";
import { SignInModal } from "@/components/form/SignInModal";
import { WayfarerLogo } from "@/components/WayfarerLogo";
import { useSearch } from "@/components/search/SearchContext";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const { open: openSearch } = useSearch();
  const [isMac, setIsMac] = useState(false);

  // Detect Mac for accurate keybind hint
  useEffect(() => {
    setIsMac(typeof navigator !== "undefined" && /Mac|iPhone|iPad/i.test(navigator.platform));
  }, []);

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

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/destinations"
              className="text-sm font-medium text-neutral-600 hover:text-link-strong transition-colors"
            >
              Top Spots
            </Link>
            <Link
              href="/discover"
              className="text-sm font-medium text-neutral-600 hover:text-link-strong transition-colors"
            >
              Discover
            </Link>
            <Link
              href="/planner"
              className="text-sm font-medium text-neutral-600 hover:text-link-strong transition-colors"
            >
              Plan
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Persistent search entry point — desktop: pill button, mobile: icon */}
            <button
              type="button"
              onClick={openSearch}
              aria-label="Search destinations"
              className="hidden md:inline-flex items-center gap-2 pl-3 pr-2 py-2 rounded-full border border-neutral-200 text-sm text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 transition-colors min-w-[200px]"
            >
              <Search className="w-4 h-4" />
              <span className="flex-1 text-left">Search destinations</span>
              <kbd className="text-xs font-mono px-2 py-1 rounded bg-neutral-100 text-neutral-500 border border-neutral-200">
                {isMac ? "⌘K" : "Ctrl K"}
              </kbd>
            </button>
            <button
              type="button"
              onClick={openSearch}
              aria-label="Search"
              className="md:hidden p-2 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <Search className="w-5 h-5 text-neutral-600" />
            </button>

            {/* Sign in + Sign up both ghost so the hero owns the one primary per
                screen (per DS simplify-first constraint list: one primary action per
                screen). When the user scrolls past the hero, they still see both
                links; on click either opens the appropriate modal. */}
            <button
              onClick={() => setSignInOpen(true)}
              className="hidden md:inline-flex text-[0.9375rem] font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={() => setSignUpOpen(true)}
              className="hidden md:inline-flex text-[0.9375rem] font-medium text-neutral-900 hover:text-bg-primary transition-colors"
            >
              Sign up
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

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-neutral-200 bg-white px-6 py-4 space-y-3">
            <Link
              href="/destinations"
              className="block text-sm font-medium text-neutral-700"
              onClick={() => setMobileOpen(false)}
            >
              Top Spots
            </Link>
            <Link
              href="/discover"
              className="block text-sm font-medium text-neutral-700"
              onClick={() => setMobileOpen(false)}
            >
              Discover
            </Link>
            <Link
              href="/planner"
              className="block text-sm font-medium text-neutral-700"
              onClick={() => setMobileOpen(false)}
            >
              Plan
            </Link>
            <div className="pt-2 border-t border-neutral-100 flex gap-3">
              <button
                onClick={() => {
                  setSignInOpen(true);
                  setMobileOpen(false);
                }}
                className="flex-1 py-2 rounded-full border border-neutral-200 text-sm font-medium text-neutral-700"
              >
                Sign in
              </button>
              <button
                onClick={() => {
                  setSignUpOpen(true);
                  setMobileOpen(false);
                }}
                className="flex-1 py-2 rounded-full bg-bg-primary text-white text-sm font-semibold"
              >
                Sign up
              </button>
            </div>
          </div>
        )}
      </header>

      <SignUpModal open={signUpOpen} onClose={() => setSignUpOpen(false)} />
      <SignInModal
        open={signInOpen}
        onClose={() => setSignInOpen(false)}
        onSwitchToSignUp={() => setSignUpOpen(true)}
      />
    </>
  );
}
