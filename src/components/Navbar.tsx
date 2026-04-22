"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { SignUpModal } from "@/components/form/SignUpModal";
import { WayfarerLogo } from "@/components/WayfarerLogo";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-200/60">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          {/* Logo — real Wayfarer wordmark + globemark, inlined to inherit color */}
          <Link
            href="/"
            aria-label="Wayfarer home"
            className="flex items-center text-brand-900"
          >
            <WayfarerLogo className="h-7 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/destinations"
              className="text-sm font-medium text-neutral-600 hover:text-brand-700 transition-colors"
            >
              Top Spots
            </Link>
            <Link
              href="/discover"
              className="text-sm font-medium text-neutral-600 hover:text-brand-700 transition-colors"
            >
              Discover
            </Link>
            <Link
              href="/planner"
              className="text-sm font-medium text-neutral-600 hover:text-brand-700 transition-colors"
            >
              Plan
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSignUpOpen(true)}
              className="hidden md:inline-flex text-sm font-medium text-brand-700 hover:text-brand-800 transition-colors"
            >
              Sign Up
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
            <button
              onClick={() => {
                setSignUpOpen(true);
                setMobileOpen(false);
              }}
              className="block text-sm font-medium text-brand-700"
            >
              Sign Up
            </button>
          </div>
        )}
      </header>

      <SignUpModal open={signUpOpen} onClose={() => setSignUpOpen(false)} />
    </>
  );
}
